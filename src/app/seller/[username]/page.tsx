import { notFound } from "next/navigation"
import { db } from "@/db"
import { users, listings } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { ListingCard } from "@/components/listings/ListingCard"
import { formatCurrency } from "@/lib/slug"
import { LayoutGrid } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const [seller] = await db
    .select({ id: users.id, username: users.username, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1)

  if (!seller) notFound()

  const sellerListings = await db
    .select()
    .from(listings)
    .where(and(eq(listings.sellerId, seller.id), eq(listings.status, "active")))
    .orderBy(listings.createdAt)

  const memberSince = new Date(seller.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const initial = seller.username[0].toUpperCase()

  const totalValue = sellerListings.reduce((sum, l) => sum + l.askingPrice, 0)
  const avgPrice = sellerListings.length > 0 ? Math.round(totalValue / sellerListings.length) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="mb-10 rounded-2xl overflow-hidden border border-border/60">
        {/* Gradient banner */}
        <div className="relative h-28 bg-gradient-to-br from-indigo-600 via-indigo-500 to-emerald-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        </div>
        {/* Profile card body */}
        <div className="px-6 pb-6 bg-card">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-background shrink-0">
              {initial}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold">{seller.username}</h1>
              <p className="text-muted-foreground text-sm">Member since {memberSince}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 sm:gap-10 text-sm border-t border-border/40 pt-4 mt-2">
            <div>
              <p className="font-semibold text-lg">{sellerListings.length}</p>
              <p className="text-muted-foreground text-xs">Active listing{sellerListings.length !== 1 ? "s" : ""}</p>
            </div>
            {sellerListings.length > 0 && (
              <>
                <div className="w-px bg-border/60 self-stretch hidden sm:block" />
                <div>
                  <p className="font-semibold text-lg bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatCurrency(totalValue)}
                  </p>
                  <p className="text-muted-foreground text-xs">Total portfolio value</p>
                </div>
                {sellerListings.length > 1 && (
                  <>
                    <div className="w-px bg-border/60 self-stretch hidden sm:block" />
                    <div>
                      <p className="font-semibold text-lg">{formatCurrency(avgPrice)}</p>
                      <p className="text-muted-foreground text-xs">Avg. listing price</p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {sellerListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 flex items-center justify-center mb-5 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
            <LayoutGrid className="w-7 h-7 text-indigo-400 dark:text-indigo-500" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No active listings</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            This seller doesn&apos;t have any active listings right now.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              {sellerListings.length} Active Listing{sellerListings.length !== 1 ? "s" : ""}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerListings.map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                sellerUsername={seller.username}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
