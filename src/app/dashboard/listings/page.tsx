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
import { FileText, Code2, ShoppingCart, Wrench, Mail, Users, Briefcase, LayoutGrid, TrendingUp, type LucideIcon } from "lucide-react"

export const dynamic = "force-dynamic"

const CATEGORY_LABELS: Record<string, string> = {
  "content-site": "Content Site",
  "saas": "SaaS",
  "ecommerce": "eCommerce",
  "tool-or-app": "Tool / App",
  "newsletter": "Newsletter",
  "community": "Community",
  "service-business": "Service Business",
  "other": "Other",
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "content-site": FileText,
  "saas": Code2,
  "ecommerce": ShoppingCart,
  "tool-or-app": Wrench,
  "newsletter": Mail,
  "community": Users,
  "service-business": Briefcase,
  "other": LayoutGrid,
}

const CATEGORY_STYLES: Record<string, string> = {
  "content-site": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "saas": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "ecommerce": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "tool-or-app": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "newsletter": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "community": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "service-business": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "other": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
}

const CATEGORY_PLACEHOLDER_BG: Record<string, string> = {
  "content-site":     "from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/30",
  "saas":             "from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30",
  "ecommerce":        "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30",
  "tool-or-app":      "from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30",
  "newsletter":       "from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/30",
  "community":        "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30",
  "service-business": "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30",
  "other":            "from-slate-50 to-slate-100 dark:from-slate-950/40 dark:to-slate-900/30",
}

const CATEGORY_ICON_COLOR: Record<string, string> = {
  "content-site":     "text-sky-400 dark:text-sky-600",
  "saas":             "text-violet-400 dark:text-violet-600",
  "ecommerce":        "text-orange-400 dark:text-orange-600",
  "tool-or-app":      "text-teal-400 dark:text-teal-600",
  "newsletter":       "text-rose-400 dark:text-rose-600",
  "community":        "text-emerald-400 dark:text-emerald-600",
  "service-business": "text-amber-400 dark:text-amber-600",
  "other":            "text-slate-400 dark:text-slate-600",
}

const CATEGORY_RADIAL: Record<string, string> = {
  "content-site":     "rgba(14,165,233,0.18)",
  "saas":             "rgba(139,92,246,0.18)",
  "ecommerce":        "rgba(249,115,22,0.18)",
  "tool-or-app":      "rgba(20,184,166,0.18)",
  "newsletter":       "rgba(244,63,94,0.18)",
  "community":        "rgba(16,185,129,0.18)",
  "service-business": "rgba(245,158,11,0.18)",
  "other":            "rgba(99,102,241,0.14)",
}

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
        {/* Animated orbs */}
        <div className="animate-orb-1 absolute -top-8 -right-8 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="animate-orb-2 absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        {/* Sparkle particles */}
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/70 blur-[0.5px] pointer-events-none" style={{ top: '16%', left: '6%', animationDuration: '3.2s', animationDelay: '0s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/60 pointer-events-none" style={{ top: '65%', left: '4%', animationDuration: '2.6s', animationDelay: '1.2s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/65 blur-[0.5px] pointer-events-none" style={{ top: '18%', right: '8%', animationDuration: '3.8s', animationDelay: '0.5s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/75 pointer-events-none" style={{ top: '68%', right: '6%', animationDuration: '2.8s', animationDelay: '1.8s' }} />
        <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/20 blur-sm pointer-events-none" style={{ top: '42%', left: '50%', animationDuration: '4.1s', animationDelay: '0.9s' }} />

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
          {rows.map(({ listing }, index) => {
            const s = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.unpublished
            const inquiryCount = inquiryMap[listing.id] ?? 0
            const thumbnailUrl = imageMap[listing.id]
            const catLabel = CATEGORY_LABELS[listing.category] ?? listing.category
            const CatIcon = CATEGORY_ICONS[listing.category] ?? LayoutGrid
            const catStyle = CATEGORY_STYLES[listing.category] ?? CATEGORY_STYLES["other"]
            const revenueMultiple = listing.monthlyRevenue && listing.monthlyRevenue > 0
              ? Math.round(listing.askingPrice / listing.monthlyRevenue)
              : null
            return (
              <div
                key={listing.id}
                className={`group relative rounded-xl border border-l-4 ${s.borderColor} bg-card p-4 transition-all duration-200 ${s.bgGradient} hover:shadow-md animate-fade-in-up overflow-hidden`}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                {/* Shine sweep on hover */}
                <div className="card-shine absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none z-20" />
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt=""
                      className="w-16 h-12 object-cover rounded-lg shrink-0 border border-border/40"
                    />
                  ) : (
                    <div className={`relative w-16 h-12 rounded-lg bg-gradient-to-br overflow-hidden shrink-0 border border-border/40 ${CATEGORY_PLACEHOLDER_BG[listing.category] ?? CATEGORY_PLACEHOLDER_BG["other"]}`}>
                      {/* Radial glow */}
                      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top right, ${CATEGORY_RADIAL[listing.category] ?? CATEGORY_RADIAL["other"]} 0%, transparent 70%)` }} />
                      {/* Category icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CatIcon className={`w-6 h-6 ${CATEGORY_ICON_COLOR[listing.category] ?? CATEGORY_ICON_COLOR["other"]}`} />
                      </div>
                      {/* Scan line */}
                      <div className="animate-mockup-scan" style={{ animationDelay: `${index * 1.4}s` }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="relative inline-flex shrink-0 h-2 w-2">
                        {listing.status === "active" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${s.dotColor}`} />
                      </span>
                      <Link
                        href={`/listings/${listing.slug}`}
                        className="font-semibold hover:underline truncate text-base leading-tight"
                      >
                        {listing.title}
                      </Link>
                      <Badge variant={s.variant} className="text-xs shrink-0">{s.label}</Badge>
                      {/* Category badge */}
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${catStyle}`}>
                        <CatIcon className="w-3 h-3" />
                        {catLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 rounded-lg bg-background border px-3 py-1.5 shadow-sm">
                        <span className="text-xs text-muted-foreground">Asking</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(listing.askingPrice)}
                        </span>
                      </div>

                      {listing.monthlyRevenue != null && listing.monthlyRevenue > 0 && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-background border px-3 py-1.5 shadow-sm">
                          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Mo. Rev</span>
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {formatCurrency(listing.monthlyRevenue)}
                          </span>
                          {revenueMultiple !== null && (
                            <span className="text-xs text-muted-foreground font-medium">
                              · {revenueMultiple}x
                            </span>
                          )}
                        </div>
                      )}

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
