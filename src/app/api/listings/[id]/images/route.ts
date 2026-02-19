import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { listings, listingImages } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth"

// POST /api/listings/[id]/images — save image URLs for a listing
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { urls } = await req.json() as { urls: string[] }

  if (!Array.isArray(urls)) {
    return NextResponse.json({ error: "urls must be an array" }, { status: 400 })
  }

  // Verify this listing belongs to the session user
  const [listing] = await db
    .select({ id: listings.id })
    .from(listings)
    .where(and(eq(listings.id, parseInt(id)), eq(listings.sellerId, session.user.id)))
    .limit(1)

  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Replace all images for this listing
  await db.delete(listingImages).where(eq(listingImages.listingId, listing.id))

  if (urls.length > 0) {
    await db.insert(listingImages).values(
      urls.slice(0, 6).map((url, i) => ({
        listingId: listing.id,
        url,
        displayOrder: i,
      }))
    )
  }

  return NextResponse.json({ ok: true })
}
