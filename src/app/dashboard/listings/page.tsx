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

const STATUS_CONFIG: Record<string, {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  borderColor: string
  bgGradient: string
  dotColor: string
}> = {
  active: {
    label: "Active",
    variant: "default",
    borderColor: "border-l-emerald-500",
    bgGradient: "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
    dotColor: "bg-emerald-500",
  },
  under_offer: {
    label: "Under Offer",
    variant: "secondary",
    borderColor: "border-l-amber-500",
    bgGradient: "hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
    dotColor: "bg-amber-500",
  },
  sold: {
    label: "Sold",
    variant: "destructive",
    borderColor: "border-l-slate-400",
    bgGradient: "hover:bg-slate-50/50 dark:hover:bg-slate-950/20",
    dotColor: "bg-slate-400",
  },
  unpublished: {
    label: "Unpublished",
    variant: "outline",
    borderColor: "border-l-slate-300",
    bgGradient: "hover:bg-slate-50/50 dark:hover:bg-slate-950/20",
    dotColor: "bg-slate-300",
  },
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

  const activeCount = rows.filter(({ listing }) => listing.status === "active").length
  const totalInquiries = rows.reduce((sum, { listing }) => sum + (inquiryMap[listing.id] ?? 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the websites you have for sale</p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-sm">
            + New listing
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-4 text-sm">
        <Link href="/dashboard/listings" className="font-medium">Listings</Link>
        <Link href="/dashboard/inquiries" className="text-muted-foreground hover:text-foreground">Inquiries</Link>
        <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground">Settings</Link>
      </div>

      {rows.length > 0 && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1 rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Active Listings</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {rows.length} total</p>
          </div>
          <div className="flex-1 rounded-xl border bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Total Inquiries</p>
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{totalInquiries}</p>
            <p className="text-xs text-muted-foreground mt-0.5">across all listings</p>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-dashed bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/50">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 flex items-center justify-center mx-auto mb-4 text-2xl">
            🌐
          </div>
          <p className="font-semibold text-lg mb-1">No listings yet</p>
          <p className="text-muted-foreground text-sm mb-6">Create your first listing to start receiving inquiries from buyers.</p>
          <Link href="/dashboard/listings/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600">
              Create your first listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ listing }) => {
            const s = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.unpublished
            const inquiryCount = inquiryMap[listing.id] ?? 0
            return (
              <div
                key={listing.id}
                className={`group rounded-xl border border-l-4 ${s.borderColor} bg-card p-5 transition-all duration-200 ${s.bgGradient} hover:shadow-md`}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${s.dotColor} shrink-0`} />
                      <Link
                        href={`/listings/${listing.slug}`}
                        className="font-semibold hover:underline truncate text-base leading-tight"
                      >
                        {listing.title}
                      </Link>
                      <Badge variant={s.variant} className="text-xs shrink-0">{s.label}</Badge>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 rounded-lg bg-background border px-3 py-1.5 shadow-sm">
                        <span className="text-xs text-muted-foreground">Asking</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(listing.askingPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-lg bg-background border px-3 py-1.5 shadow-sm">
                        <span className="text-xs text-muted-foreground">Inquiries</span>
                        <span className={`text-sm font-bold ${inquiryCount > 0 ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`}>
                          {inquiryCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <ListingActions listingId={listing.id} currentStatus={listing.status} />
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
