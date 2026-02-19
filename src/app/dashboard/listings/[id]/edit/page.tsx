import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { listings, listingImages } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { EditListingForm } from "@/components/dashboard/EditListingForm"

export const dynamic = "force-dynamic"

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { id } = await params

  const [listing] = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, parseInt(id)), eq(listings.sellerId, session.user.id)))
    .limit(1)

  if (!listing) notFound()

  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listing.id))
    .orderBy(listingImages.displayOrder)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Edit listing</h1>
      <p className="text-muted-foreground mb-8">{listing.title}</p>
      <EditListingForm listing={listing} initialImageUrls={images.map((i) => i.url)} />
    </div>
  )
}
