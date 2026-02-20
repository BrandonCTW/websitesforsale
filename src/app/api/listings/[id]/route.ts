import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { listings } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth"

// PATCH /api/listings/[id] — update listing
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const [listing] = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, parseInt(id)), eq(listings.sellerId, session.user.id)))
    .limit(1)

  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const allowed = [
    "title", "url", "description", "category", "askingPrice",
    "monthlyRevenue", "monthlyProfit", "monthlyTraffic", "ageMonths",
    "monetization", "techStack", "reasonForSelling", "includedAssets", "faqs", "status",
  ]
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const [updated] = await db
    .update(listings)
    .set(updates)
    .where(eq(listings.id, parseInt(id)))
    .returning()

  return NextResponse.json(updated)
}

// DELETE /api/listings/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const where = session.user.isAdmin
    ? eq(listings.id, parseInt(id))
    : and(eq(listings.id, parseInt(id)), eq(listings.sellerId, session.user.id))

  await db.delete(listings).where(where)
  return NextResponse.json({ ok: true })
}
