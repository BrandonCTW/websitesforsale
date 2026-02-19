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

      {rows.length > 0 && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1 rounded-xl border bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Total Inquiries</p>
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{rows.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">from interested buyers</p>
          </div>
          <div className="flex-1 rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Unique Buyers</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {new Set(rows.map(({ inquiry }) => inquiry.buyerEmail)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">distinct contacts</p>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-dashed bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/50">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-200 dark:from-indigo-900 dark:to-violet-800 flex items-center justify-center mx-auto mb-4 text-2xl">
            💬
          </div>
          <p className="font-semibold text-lg mb-1">No inquiries yet</p>
          <p className="text-muted-foreground text-sm mb-2">
            When buyers contact you through your listings, their messages will appear here.
          </p>
          <p className="text-muted-foreground text-sm">
            <Link href="/dashboard/listings" className="underline hover:text-foreground">
              Make sure your listings are active
            </Link>{" "}
            to start receiving inquiries.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ inquiry, listing }) => {
            const initials = inquiry.buyerName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()

            return (
              <div
                key={inquiry.id}
                className="group rounded-xl border border-l-4 border-l-indigo-400 bg-card p-5 transition-all duration-200 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 hover:shadow-md"
              >
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Avatar */}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                    {initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <p className="font-semibold text-base leading-tight">{inquiry.buyerName}</p>
                        <a
                          href={`mailto:${inquiry.buyerEmail}`}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {inquiry.buyerEmail}
                        </a>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground mb-0.5">{timeAgo(new Date(inquiry.createdAt))}</p>
                        <Link
                          href={`/listings/${listing.slug}`}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground whitespace-pre-wrap border-t pt-3 mb-3">
                      {inquiry.message}
                    </p>

                    <a
                      href={`mailto:${inquiry.buyerEmail}?subject=Re: ${encodeURIComponent(listing.title)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-medium px-3 py-1.5 shadow-sm transition-all"
                    >
                      Reply via email →
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
