import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { listings, inquiries, listingImages } from "@/db/schema"
import { eq, count, inArray } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/slug"
import { ListingActions } from "@/components/dashboard/ListingActions"
import { Globe } from "lucide-react"

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

  const listingIds = rows.map(({ listing }) => listing.id)
  const images = listingIds.length > 0
    ? await db.select().from(listingImages).where(
        inArray(listingImages.listingId, listingIds)
      ).then(imgs => imgs.filter(img => img.displayOrder === 0))
    : []
  const imageMap = Object.fromEntries(images.map((img) => [img.listingId, img.url]))

  const activeCount = rows.filter(({ listing }) => listing.status === "active").length
  const totalInquiries = rows.reduce((sum, { listing }) => sum + (inquiryMap[listing.id] ?? 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Gradient hero header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-8 mb-6">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        {/* Subtle orbs */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 className="text-xl font-bold text-white">Your Listings</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage the websites you have for sale</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {rows.length > 0 && (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {activeCount} active
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300">
                  {totalInquiries} inquiries
                </span>
              </>
            )}
            <Link href="/dashboard/listings/new">
              <Button className="bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 border-0 text-white text-sm shadow-sm">
                + New listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="relative flex items-center gap-1 border-t border-white/10 pt-4">
          <Link href="/dashboard/listings" className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/15 text-white text-sm font-semibold transition-colors">Listings</Link>
          <Link href="/dashboard/inquiries" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Inquiries</Link>
          <Link href="/dashboard/settings" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Settings</Link>
        </div>
      </div>

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
            const thumbnailUrl = imageMap[listing.id]
            return (
              <div
                key={listing.id}
                className={`group rounded-xl border border-l-4 ${s.borderColor} bg-card p-4 transition-all duration-200 ${s.bgGradient} hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt=""
                      className="w-16 h-12 object-cover rounded-lg shrink-0 border border-border/40"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 flex items-center justify-center shrink-0 border border-border/40">
                      <Globe className="w-5 h-5 text-indigo-300 dark:text-indigo-700" />
                    </div>
                  )}
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
