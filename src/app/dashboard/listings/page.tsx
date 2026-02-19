import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { listings, inquiries } from "@/db/schema"
import { eq, count } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/slug"
import { ListingActions } from "@/components/dashboard/ListingActions"

export const dynamic = "force-dynamic"

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Active", variant: "default" },
  under_offer: { label: "Under Offer", variant: "secondary" },
  sold: { label: "Sold", variant: "destructive" },
  unpublished: { label: "Unpublished", variant: "outline" },
}

export default async function DashboardListingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const rows = await db
    .select({ listing: listings })
    .from(listings)
    .where(eq(listings.sellerId, session.user.id))
    .orderBy(listings.createdAt)

  const inquiryCounts = await db
    .select({ listingId: inquiries.listingId, count: count() })
    .from(inquiries)
    .groupBy(inquiries.listingId)

  const inquiryMap = Object.fromEntries(inquiryCounts.map((r) => [r.listingId, r.count]))

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the websites you have for sale</p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button>+ New listing</Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-4 text-sm">
        <Link href="/dashboard/listings" className="font-medium">Listings</Link>
        <Link href="/dashboard/inquiries" className="text-muted-foreground hover:text-foreground">Inquiries</Link>
        <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground">Settings</Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="mb-4">No listings yet.</p>
          <Link href="/dashboard/listings/new">
            <Button>Create your first listing</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y">
          {rows.map(({ listing }) => {
            const s = STATUS_BADGE[listing.status] ?? STATUS_BADGE.unpublished
            return (
              <div key={listing.id} className="py-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/listings/${listing.slug}`}
                      className="font-medium hover:underline truncate"
                    >
                      {listing.title}
                    </Link>
                    <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatCurrency(listing.askingPrice)} asking ·{" "}
                    {inquiryMap[listing.id] ?? 0} inquiries
                  </p>
                </div>
                <ListingActions listingId={listing.id} currentStatus={listing.status} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
