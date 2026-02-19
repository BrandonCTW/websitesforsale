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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{seller.username}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Member since {memberSince} · {sellerListings.length} active listing{sellerListings.length !== 1 ? "s" : ""}
        </p>
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
