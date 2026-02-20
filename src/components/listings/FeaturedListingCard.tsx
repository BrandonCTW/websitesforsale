import Link from "next/link"
import { Listing } from "@/db/schema"
import { formatCurrency, formatNumber } from "@/lib/slug"
import {
  TrendingUp,
  Eye,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Code2,
  ShoppingCart,
  Wrench,
  Mail,
  Users,
  Briefcase,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react"

function getAvatarGradient(username: string): string {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  const hue2 = (hue + 40) % 360
  return `linear-gradient(135deg, hsl(${hue}, 65%, 50%), hsl(${hue2}, 70%, 55%))`
}

const CATEGORY_LABELS: Record<string, string> = {
  "content-site": "Content Site",
  saas: "SaaS",
  ecommerce: "eCommerce",
  "tool-or-app": "Tool / App",
  newsletter: "Newsletter",
  community: "Community",
  "service-business": "Service Business",
  other: "Other",
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "content-site": FileText,
  saas: Code2,
  ecommerce: ShoppingCart,
  "tool-or-app": Wrench,
  newsletter: Mail,
  community: Users,
  "service-business": Briefcase,
  other: LayoutGrid,
}

const CATEGORY_STYLES: Record<string, string> = {
  "content-site": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  saas: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  ecommerce: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "tool-or-app": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  newsletter: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  community: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "service-business": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  other: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
}

const CATEGORY_ACCENT: Record<string, string> = {
  "content-site": "from-sky-400 to-sky-500",
  saas: "from-violet-400 to-violet-500",
  ecommerce: "from-orange-400 to-orange-500",
  "tool-or-app": "from-teal-400 to-teal-500",
  newsletter: "from-rose-400 to-rose-500",
  community: "from-emerald-400 to-emerald-500",
  "service-business": "from-amber-400 to-amber-500",
  other: "from-slate-400 to-slate-500",
}

const CATEGORY_PLACEHOLDER: Record<string, { bg: string; radial: string; icon: string }> = {
  "content-site": {
    bg: "from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/30",
    radial: "rgba(14,165,233,0.14)",
    icon: "text-sky-400 dark:text-sky-700",
  },
  saas: {
    bg: "from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30",
    radial: "rgba(139,92,246,0.14)",
    icon: "text-violet-400 dark:text-violet-700",
  },
  ecommerce: {
    bg: "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30",
    radial: "rgba(249,115,22,0.14)",
    icon: "text-orange-400 dark:text-orange-700",
  },
  "tool-or-app": {
    bg: "from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30",
    radial: "rgba(20,184,166,0.14)",
    icon: "text-teal-400 dark:text-teal-700",
  },
  newsletter: {
    bg: "from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/30",
    radial: "rgba(244,63,94,0.14)",
    icon: "text-rose-400 dark:text-rose-700",
  },
  community: {
    bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30",
    radial: "rgba(16,185,129,0.14)",
    icon: "text-emerald-400 dark:text-emerald-700",
  },
  "service-business": {
    bg: "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30",
    radial: "rgba(245,158,11,0.14)",
    icon: "text-amber-400 dark:text-amber-700",
  },
  other: {
    bg: "from-slate-50 to-slate-100 dark:from-slate-950/40 dark:to-slate-900/30",
    radial: "rgba(100,116,139,0.12)",
    icon: "text-slate-400 dark:text-slate-600",
  },
}

const DEAL_TIERS = [
  {
    maxMultiple: 20,
    label: "Great Deal",
    dotCls: "bg-emerald-400",
    textCls: "text-emerald-700 dark:text-emerald-300",
    bgCls: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    maxMultiple: 30,
    label: "Fair Value",
    dotCls: "bg-amber-400",
    textCls: "text-amber-700 dark:text-amber-300",
    bgCls: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    maxMultiple: 42,
    label: "Premium",
    dotCls: "bg-orange-400",
    textCls: "text-orange-700 dark:text-orange-300",
    bgCls: "bg-orange-50 dark:bg-orange-950/40",
  },
  {
    maxMultiple: Infinity,
    label: "Expensive",
    dotCls: "bg-red-400",
    textCls: "text-red-700 dark:text-red-300",
    bgCls: "bg-red-50 dark:bg-red-950/40",
  },
] as const

function getDealTier(multiple: number) {
  return DEAL_TIERS.find((t) => multiple < t.maxMultiple) ?? DEAL_TIERS[DEAL_TIERS.length - 1]
}

export function FeaturedListingCard({
  listing,
  sellerUsername,
  imageUrl,
}: {
  listing: Listing
  sellerUsername: string
  imageUrl?: string
}) {
  const age =
    listing.ageMonths >= 12
      ? `${Math.floor(listing.ageMonths / 12)}y ${listing.ageMonths % 12}mo`
      : `${listing.ageMonths}mo`

  const multiple =
    listing.monthlyRevenue && listing.monthlyRevenue > 0
      ? (listing.askingPrice / listing.monthlyRevenue).toFixed(1)
      : null

  const CategoryIcon = CATEGORY_ICONS[listing.category] ?? LayoutGrid
  const dealTier = multiple ? getDealTier(parseFloat(multiple)) : null
  const placeholder = CATEGORY_PLACEHOLDER[listing.category] ?? CATEGORY_PLACEHOLDER["other"]
  const accent = CATEGORY_ACCENT[listing.category] ?? CATEGORY_ACCENT["other"]

  return (
    <Link href={`/listings/${listing.slug}`} className="block group animate-fade-in-up">
      <div className="group relative rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-featured-border">
        {/* Shine sweep overlay */}
        <div className="card-shine absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none z-30" />
        {/* Top category accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r ${accent}`} />

        {/* Spotlight badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800/60 rounded-full px-2.5 py-1 shadow-sm">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Spotlight
          </span>
        </div>

        <div className="grid md:grid-cols-[44%_1fr] pt-[3px]">
          {/* Left: Image / Mockup */}
          <div
            className={`relative bg-gradient-to-br ${placeholder.bg} overflow-hidden`}
            style={{ minHeight: "240px" }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at top right, ${placeholder.radial} 0%, transparent 65%)`,
                  }}
                />
                {/* Larger, more detailed website mockup */}
                <div className="absolute inset-5 rounded-xl bg-white/60 dark:bg-slate-900/50 shadow-md border border-white/70 dark:border-white/10 flex flex-col overflow-hidden backdrop-blur-sm">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-white/70 dark:bg-slate-800/60 border-b border-black/5 dark:border-white/5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-300/80 dark:bg-red-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80 dark:bg-amber-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-300/80 dark:bg-emerald-500/50" />
                    <div className="flex-1 mx-2 h-3.5 rounded-full bg-black/6 dark:bg-white/8 flex items-center px-2 gap-1.5">
                      <CategoryIcon
                        className={`w-2 h-2 shrink-0 ${placeholder.icon} opacity-60`}
                      />
                      <div className="h-1.5 w-16 rounded-full bg-black/10 dark:bg-white/10" />
                    </div>
                    <div className="w-5 h-3 rounded bg-black/5 dark:bg-white/5" />
                  </div>
                  {/* Page content mockup */}
                  <div className="flex-1 p-3 space-y-2 relative overflow-hidden">
                    {/* Scan line */}
                    <div className="animate-mockup-scan" style={{ animationDelay: '0.6s' }} />
                    {/* Hero banner */}
                    <div
                      className={`h-9 rounded-lg bg-gradient-to-r ${accent} opacity-25`}
                    />
                    {/* Headline rows */}
                    <div className="space-y-1.5 pt-0.5">
                      <div className="h-3 rounded w-3/4 bg-black/8 dark:bg-white/8" />
                      <div className="h-2.5 rounded w-1/2 bg-black/5 dark:bg-white/5" />
                    </div>
                    {/* Card grid */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <div className="h-10 rounded-lg bg-black/5 dark:bg-white/5" />
                      <div className="h-10 rounded-lg bg-black/5 dark:bg-white/5" />
                      <div className="h-10 rounded-lg bg-black/5 dark:bg-white/5" />
                    </div>
                    {/* Content rows */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 rounded w-full bg-black/5 dark:bg-white/5" />
                      <div className="h-2 rounded w-5/6 bg-black/5 dark:bg-white/5" />
                      <div className="h-2 rounded w-2/3 bg-black/4 dark:bg-white/4" />
                    </div>
                  </div>
                </div>
                {/* Category watermark */}
                <div className="absolute bottom-5 right-5 opacity-15 select-none pointer-events-none">
                  <CategoryIcon className={`w-10 h-10 ${placeholder.icon}`} />
                </div>
              </>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-6 flex flex-col gap-4 justify-between">
            <div className="space-y-3">
              {/* Category + deal tier badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLES[listing.category] ?? CATEGORY_STYLES["other"]}`}
                >
                  <CategoryIcon className="h-3.5 w-3.5" />
                  {CATEGORY_LABELS[listing.category] ?? listing.category}
                </span>
                {dealTier && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${dealTier.bgCls} ${dealTier.textCls}`}
                  >
                    <span className="relative flex items-center justify-center w-1.5 h-1.5">
                      {dealTier.label === "Great Deal" && (
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dealTier.dotCls} opacity-75`} />
                      )}
                      <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${dealTier.dotCls}`} />
                    </span>
                    {dealTier.label}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {listing.title}
              </h2>

              {/* Price */}
              <div>
                <p className="text-2xl font-bold animate-price-gradient">
                  {formatCurrency(listing.askingPrice)}
                </p>
                {multiple && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {multiple}x revenue multiple
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {listing.description}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap gap-2">
                {listing.monthlyRevenue && (
                  <div className="animate-chip-glow chip-glow-emerald rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-3 py-2" style={{ animationDelay: '0s' }}>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-0.5 font-medium">
                      <TrendingUp className="h-3 w-3" /> Revenue
                    </p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(listing.monthlyRevenue)}
                      <span className="text-xs font-normal text-emerald-600/70 dark:text-emerald-400/70">/mo</span>
                    </p>
                  </div>
                )}
                {listing.monthlyTraffic && (
                  <div className="animate-chip-glow chip-glow-sky rounded-lg bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 px-3 py-2" style={{ animationDelay: '0.67s' }}>
                    <p className="text-[10px] text-sky-600 dark:text-sky-400 flex items-center gap-1 mb-0.5 font-medium">
                      <Eye className="h-3 w-3" /> Traffic
                    </p>
                    <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">
                      {formatNumber(listing.monthlyTraffic)}
                      <span className="text-xs font-normal text-sky-600/70 dark:text-sky-400/70">/mo</span>
                    </p>
                  </div>
                )}
                <div className="animate-chip-glow chip-glow-amber rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 px-3 py-2" style={{ animationDelay: '1.33s' }}>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-0.5 font-medium">
                    <Clock className="h-3 w-3" /> Age
                  </p>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{age}</p>
                </div>
              </div>
            </div>

            {/* Footer: seller + CTA */}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  style={{ background: getAvatarGradient(sellerUsername) }}
                >
                  {sellerUsername[0].toUpperCase()}
                </div>
                <p className="text-xs text-muted-foreground">
                  by <span className="font-medium text-foreground">{sellerUsername}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 group-hover:from-indigo-700 group-hover:to-indigo-600 text-white text-xs font-semibold px-4 py-2 shadow-sm transition-all">
                View Listing
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
