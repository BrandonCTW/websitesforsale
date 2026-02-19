import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { inquiries, listings } from "@/db/schema"
import { eq } from "drizzle-orm"
import { timeAgo } from "@/lib/slug"

export const dynamic = "force-dynamic"

export default async function InquiriesPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const rows = await db
    .select({
      inquiry: inquiries,
      listing: { title: listings.title, slug: listings.slug },
    })
    .from(inquiries)
    .innerJoin(listings, eq(inquiries.listingId, listings.id))
    .where(eq(listings.sellerId, session.user.id))
    .orderBy(inquiries.createdAt)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Messages from interested buyers — reply directly to their email
        </p>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-4 text-sm">
        <Link href="/dashboard/listings" className="text-muted-foreground hover:text-foreground">Listings</Link>
        <Link href="/dashboard/inquiries" className="font-medium">Inquiries</Link>
        <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground">Settings</Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">No inquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map(({ inquiry, listing }) => (
            <div key={inquiry.id} className="border rounded-lg p-5 space-y-2">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold">{inquiry.buyerName}</p>
                  <a
                    href={`mailto:${inquiry.buyerEmail}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {inquiry.buyerEmail}
                  </a>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{timeAgo(new Date(inquiry.createdAt))}</p>
                  <Link href={`/listings/${listing.slug}`} className="hover:underline">
                    {listing.title}
                  </Link>
                </div>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap border-t pt-2">
                {inquiry.message}
              </p>
              <a
                href={`mailto:${inquiry.buyerEmail}?subject=Re: ${encodeURIComponent(listing.title)}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Reply via email →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
