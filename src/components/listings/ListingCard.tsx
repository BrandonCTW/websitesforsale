import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Listing } from "@/db/schema"
import { formatCurrency, formatNumber } from "@/lib/slug"
import { DollarSign, TrendingUp, Eye, Clock, FileText, Code2, ShoppingCart, Wrench, Mail, Users, Briefcase, LayoutGrid, type LucideIcon } from "lucide-react"

function getAvatarGradient(username: string): string {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  const hue2 = (hue + 40) % 360
  return `linear-gradient(135deg, hsl(${hue}, 65%, 50%), hsl(${hue2}, 70%, 55%))`
}

function isNewListing(createdAt: Date | string): boolean {
  const created = new Date(createdAt)
  const diffMs = Date.now() - created.getTime()
  return diffMs / (1000 * 60 * 60 * 24) <= 7
}

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

const CARD_HOVER_STYLES: Record<string, string> = {
  "content-site":     "hover:shadow-sky-100/70 dark:hover:shadow-sky-950/60 hover:border-sky-200/80 dark:hover:border-sky-800/60",
  "saas":             "hover:shadow-violet-100/70 dark:hover:shadow-violet-950/60 hover:border-violet-200/80 dark:hover:border-violet-800/60",
  "ecommerce":        "hover:shadow-orange-100/70 dark:hover:shadow-orange-950/60 hover:border-orange-200/80 dark:hover:border-orange-800/60",
  "tool-or-app":      "hover:shadow-teal-100/70 dark:hover:shadow-teal-950/60 hover:border-teal-200/80 dark:hover:border-teal-800/60",
  "newsletter":       "hover:shadow-rose-100/70 dark:hover:shadow-rose-950/60 hover:border-rose-200/80 dark:hover:border-rose-800/60",
  "community":        "hover:shadow-emerald-100/70 dark:hover:shadow-emerald-950/60 hover:border-emerald-200/80 dark:hover:border-emerald-800/60",
  "service-business": "hover:shadow-amber-100/70 dark:hover:shadow-amber-950/60 hover:border-amber-200/80 dark:hover:border-amber-800/60",
  "other":            "hover:shadow-slate-200/70 dark:hover:shadow-slate-800/60 hover:border-slate-300/80 dark:hover:border-slate-700/60",
}

const CATEGORY_ACCENT: Record<string, string> = {
  "content-site":     "from-sky-400 to-sky-500",
  "saas":             "from-violet-400 to-violet-500",
  "ecommerce":        "from-orange-400 to-orange-500",
  "tool-or-app":      "from-teal-400 to-teal-500",
  "newsletter":       "from-rose-400 to-rose-500",
  "community":        "from-emerald-400 to-emerald-500",
  "service-business": "from-amber-400 to-amber-500",
  "other":            "from-slate-400 to-slate-500",
}

const DEAL_TIERS = [
  { maxMultiple: 20, label: "Great Deal", dotCls: "bg-emerald-400", textCls: "text-emerald-700 dark:text-emerald-300", bgCls: "bg-emerald-50 dark:bg-emerald-950/40" },
  { maxMultiple: 30, label: "Fair Value", dotCls: "bg-amber-400",   textCls: "text-amber-700 dark:text-amber-300",   bgCls: "bg-amber-50 dark:bg-amber-950/40"   },
  { maxMultiple: 42, label: "Premium",    dotCls: "bg-orange-400",  textCls: "text-orange-700 dark:text-orange-300", bgCls: "bg-orange-50 dark:bg-orange-950/40" },
  { maxMultiple: Infinity, label: "Expensive", dotCls: "bg-red-400", textCls: "text-red-700 dark:text-red-300", bgCls: "bg-red-50 dark:bg-red-950/40" },
] as const

function getDealTier(multiple: number) {
  return DEAL_TIERS.find((t) => multiple < t.maxMultiple) ?? DEAL_TIERS[DEAL_TIERS.length - 1]
}

const CATEGORY_PLACEHOLDER: Record<string, { bg: string; radial: string; icon: string }> = {
  "content-site":       { bg: "from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/30",            radial: "rgba(14,165,233,0.14)",  icon: "text-sky-400 dark:text-sky-700" },
  "saas":               { bg: "from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30", radial: "rgba(139,92,246,0.14)",  icon: "text-violet-400 dark:text-violet-700" },
  "ecommerce":          { bg: "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30", radial: "rgba(249,115,22,0.14)", icon: "text-orange-400 dark:text-orange-700" },
  "tool-or-app":        { bg: "from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30",        radial: "rgba(20,184,166,0.14)",  icon: "text-teal-400 dark:text-teal-700" },
  "newsletter":         { bg: "from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/30",        radial: "rgba(244,63,94,0.14)",   icon: "text-rose-400 dark:text-rose-700" },
  "community":          { bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30", radial: "rgba(16,185,129,0.14)", icon: "text-emerald-400 dark:text-emerald-700" },
  "service-business":   { bg: "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30",    radial: "rgba(245,158,11,0.14)", icon: "text-amber-400 dark:text-amber-700" },
  "other":              { bg: "from-slate-50 to-slate-100 dark:from-slate-950/40 dark:to-slate-900/30",    radial: "rgba(100,116,139,0.12)", icon: "text-slate-400 dark:text-slate-600" },
}

export function ListingCard({
  listing,
  sellerUsername,
  imageUrl,
  index = 0,
}: {
  listing: Listing
  sellerUsername: string
  imageUrl?: string
  index?: number
}) {
  const age =
    listing.ageMonths >= 12
      ? `${Math.floor(listing.ageMonths / 12)}y ${listing.ageMonths % 12}mo`
      : `${listing.ageMonths}mo`

  const multiple =
    listing.monthlyRevenue && listing.monthlyRevenue > 0
      ? (listing.askingPrice / listing.monthlyRevenue).toFixed(1)
      : null

  const showNewBadge = isNewListing(listing.createdAt)
  const CategoryIcon = CATEGORY_ICONS[listing.category] ?? LayoutGrid
  const dealTier = multiple ? getDealTier(parseFloat(multiple)) : null

  return (
    <Link href={`/listings/${listing.slug}`} className="animate-fade-in-up block relative" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl z-10 bg-gradient-to-r ${CATEGORY_ACCENT[listing.category] ?? CATEGORY_ACCENT["other"]}`} />
      <Card className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${CARD_HOVER_STYLES[listing.category] ?? CARD_HOVER_STYLES["other"]}`}>
        {imageUrl ? (
          <div className="aspect-video overflow-hidden rounded-t-lg bg-muted relative">
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {showNewBadge && (
              <span className="absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-md">
                New
              </span>
            )}
            {multiple && (
              <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm">
                {multiple}x rev
              </span>
            )}
          </div>
        ) : (
          <div className={`aspect-video rounded-t-lg bg-gradient-to-br ${(CATEGORY_PLACEHOLDER[listing.category] ?? CATEGORY_PLACEHOLDER["other"]).bg} relative overflow-hidden`}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top right, ${(CATEGORY_PLACEHOLDER[listing.category] ?? CATEGORY_PLACEHOLDER["other"]).radial} 0%, transparent 65%)` }} />
            {/* Website mockup frame */}
            <div className="absolute inset-3 rounded-lg bg-white/60 dark:bg-slate-900/50 shadow-sm border border-white/70 dark:border-white/10 flex flex-col overflow-hidden backdrop-blur-sm">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/70 dark:bg-slate-800/60 border-b border-black/5 dark:border-white/5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-300/80 dark:bg-red-500/50" />
                <span className="w-2 h-2 rounded-full bg-amber-300/80 dark:bg-amber-500/50" />
                <span className="w-2 h-2 rounded-full bg-emerald-300/80 dark:bg-emerald-500/50" />
                <div className="flex-1 mx-1.5 h-2.5 rounded-full bg-black/6 dark:bg-white/8 flex items-center px-1.5 gap-1">
                  <CategoryIcon className={`w-1.5 h-1.5 shrink-0 ${(CATEGORY_PLACEHOLDER[listing.category] ?? CATEGORY_PLACEHOLDER["other"]).icon} opacity-60`} />
                  <div className="h-1 w-10 rounded-full bg-black/10 dark:bg-white/10" />
                </div>
              </div>
              {/* Page content mockup */}
              <div className="flex-1 p-2 space-y-1.5">
                {/* Hero block */}
                <div className={`h-5 rounded-md bg-gradient-to-r ${CATEGORY_ACCENT[listing.category] ?? CATEGORY_ACCENT["other"]} opacity-30`} />
                {/* Content rows */}
                <div className="flex gap-1.5">
                  <div className="h-3 rounded flex-1 bg-black/8 dark:bg-white/8" />
                  <div className="h-3 rounded w-12 bg-black/5 dark:bg-white/5" />
                </div>
                <div className="h-3 rounded w-4/5 bg-black/6 dark:bg-white/6" />
                {/* Card row */}
                <div className="flex gap-1 pt-0.5">
                  <div className="h-6 rounded flex-1 bg-black/5 dark:bg-white/5" />
                  <div className="h-6 rounded flex-1 bg-black/5 dark:bg-white/5" />
                  <div className="h-6 rounded flex-1 bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            </div>
            {/* Category icon watermark */}
            <div className="absolute bottom-4 right-4 opacity-20 select-none pointer-events-none">
              <CategoryIcon className={`w-6 h-6 ${(CATEGORY_PLACEHOLDER[listing.category] ?? CATEGORY_PLACEHOLDER["other"]).icon}`} />
            </div>
            {showNewBadge && (
              <span className="absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-md">
                New
              </span>
            )}
            {multiple && (
              <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/90 text-white shadow-sm">
                {multiple}x rev
              </span>
            )}
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold leading-snug group-hover:underline line-clamp-2">
              {listing.title}
            </h2>
            <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[listing.category] ?? CATEGORY_STYLES["other"]}`}>
              <CategoryIcon className="h-3 w-3 shrink-0" />
              {CATEGORY_LABELS[listing.category] ?? listing.category}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {listing.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <DollarSign className="h-3 w-3 shrink-0" />
                Asking Price
              </p>
              <p className="font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(listing.askingPrice)}
              </p>
            </div>
            {listing.monthlyRevenue ? (
              <div>
                <p className="text-muted-foreground text-xs flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  Monthly Revenue
                </p>
                <p className="font-semibold">{formatCurrency(listing.monthlyRevenue)}</p>
              </div>
            ) : null}
            {listing.monthlyTraffic ? (
              <div>
                <p className="text-muted-foreground text-xs flex items-center gap-1">
                  <Eye className="h-3 w-3 shrink-0" />
                  Monthly Traffic
                </p>
                <p className="font-semibold">{formatNumber(listing.monthlyTraffic)}</p>
              </div>
            ) : null}
            <div>
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                Age
              </p>
              <p className="font-semibold">{age}</p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-border/50 flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-sm"
              style={{ background: getAvatarGradient(sellerUsername) }}
            >
              {sellerUsername[0].toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground flex-1 min-w-0">
              Listed by <span className="font-medium text-foreground">{sellerUsername}</span>
            </p>
            {dealTier && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${dealTier.bgCls} ${dealTier.textCls}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dealTier.dotCls}`} />
                {dealTier.label}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
