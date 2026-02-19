import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { inquiries, listings, users } from "@/db/schema"
import { eq } from "drizzle-orm"

const RATE_LIMIT = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const window = 60 * 60 * 1000 // 1 hour
  const entry = RATE_LIMIT.get(ip)

  if (!entry || now > entry.reset) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + window })
    return true
  }
  if (entry.count >= 3) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many inquiries. Try again later." }, { status: 429 })
  }

  const body = await req.json()
  const { listingId, buyerName, buyerEmail, message, honeypot } = body

  // Honeypot — bots fill this, humans don't
  if (honeypot) return NextResponse.json({ ok: true })

  if (!listingId || !buyerName || !buyerEmail || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Message is too short." }, { status: 400 })
  }

  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, parseInt(listingId)))
    .limit(1)

  if (!listing || listing.status !== "active") {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 })
  }

  const [seller] = await db
    .select({ email: users.email, username: users.username })
    .from(users)
    .where(eq(users.id, listing.sellerId))
    .limit(1)

  await db.insert(inquiries).values({ listingId: listing.id, buyerName, buyerEmail, message })

  // Email notification — only runs when RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    const listingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/listings/${listing.slug}`
    const { sendInquiryEmail } = await import("@/lib/email")
    await sendInquiryEmail({
      sellerEmail: seller.email,
      sellerName: seller.username,
      buyerName,
      buyerEmail,
      message,
      listingTitle: listing.title,
      listingUrl,
    })
  }

  return NextResponse.json({ ok: true })
}
