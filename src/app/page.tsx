import { db } from "@/db"
import { listings, listingImages, users } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { ListingCard } from "@/components/listings/ListingCard"
import { FilterBar } from "@/components/listings/FilterBar"

export const dynamic = "force-dynamic"

const CATEGORIES = [
  "content-site", "saas", "ecommerce", "tool-or-app",
  "newsletter", "community", "service-business", "other",
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { category, minPrice, maxPrice, q } = params

  const conditions: Parameters<typeof and>[0][] = [eq(listings.status, "active")]
  if (category) conditions.push(eq(listings.category, category))

  const rows = await db
    .select({
      listing: listings,
      seller: { username: users.username },
    })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(and(...conditions))
    .orderBy(listings.createdAt)

  const filtered = rows.filter(({ listing }) => {
    if (minPrice && listing.askingPrice < parseInt(minPrice)) return false
    if (maxPrice && listing.askingPrice > parseInt(maxPrice)) return false
    if (q) {
      const search = q.toLowerCase()
      if (
        !listing.title.toLowerCase().includes(search) &&
        !listing.description.toLowerCase().includes(search)
      ) return false
    }
    return true
  })

  const images = filtered.length
    ? await db.select().from(listingImages).where(eq(listingImages.displayOrder, 0))
    : []

  const imageMap = Object.fromEntries(images.map((img) => [img.listingId, img.url]))

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Websites for sale. No middleman.
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Browse profitable websites and apps. Contact sellers directly — no fees, no commissions.
        </p>
      </div>

      <FilterBar categories={CATEGORIES} />

      {filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          No listings match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map(({ listing, seller }) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              sellerUsername={seller.username}
              imageUrl={imageMap[listing.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
