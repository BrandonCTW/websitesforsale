import { notFound } from "next/navigation"
import { db } from "@/db"
import { users, listings } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { ListingCard } from "@/components/listings/ListingCard"

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
          <div className="flex gap-6 text-sm">
            <div>
              <p className="font-semibold text-lg">{sellerListings.length}</p>
              <p className="text-muted-foreground text-xs">Active listing{sellerListings.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </div>

      {sellerListings.length === 0 ? (
        <p className="text-muted-foreground">This seller has no active listings.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              sellerUsername={seller.username}
            />
          ))}
        </div>
      )}
    </div>
  )
}
