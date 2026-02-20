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
        <div className="relative mb-8 py-14 px-6 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
          <div className="animate-orb-1 absolute -top-10 -right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="animate-orb-2 absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
              Websites for sale.{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                No middleman.
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-6">
              Browse profitable websites and apps. Contact sellers directly — no fees, no commissions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                Zero broker fees
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 inline-block" />
                Direct seller contact
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                No commissions
              </span>
            </div>
          </div>
        </div>
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
