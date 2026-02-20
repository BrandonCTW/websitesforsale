import { db } from "@/db"
import { listings, listingImages, users } from "@/db/schema"
import { eq, and, count } from "drizzle-orm"
import { ListingCard } from "@/components/listings/ListingCard"
import { FeaturedListingCard } from "@/components/listings/FeaturedListingCard"
import { FilterBar } from "@/components/listings/FilterBar"
import Link from "next/link"
import { Search, ShieldCheck, MessageCircle, BadgePercent, Sparkles, ArrowRight, Handshake, FileText, Code2, ShoppingCart, Wrench, Mail, Users, Briefcase, LayoutGrid, Check, X, type LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/slug"
import { CountUp } from "@/components/CountUp"

export const dynamic = "force-dynamic"

const CATEGORIES = [
  "content-site", "saas", "ecommerce", "tool-or-app",
  "newsletter", "community", "service-business", "other",
]

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price ↑", value: "price-asc" },
  { label: "Price ↓", value: "price-desc" },
  { label: "Revenue ↓", value: "revenue-desc" },
] as const

const CATEGORY_DISPLAY: {
  key: string
  label: string
  Icon: LucideIcon
  bg: string
  iconCls: string
  activeBorder: string
  hoverBorder: string
  hoverShadow: string
}[] = [
  { key: "content-site",     label: "Content Sites",   Icon: FileText,    bg: "from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/30",           iconCls: "text-sky-500 dark:text-sky-400",      activeBorder: "border-sky-400 dark:border-sky-600",     hoverBorder: "hover:border-sky-200 dark:hover:border-sky-800",         hoverShadow: "hover:shadow-sky-100/70 dark:hover:shadow-sky-950/60" },
  { key: "saas",             label: "SaaS",            Icon: Code2,       bg: "from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30", iconCls: "text-violet-500 dark:text-violet-400", activeBorder: "border-violet-400 dark:border-violet-600", hoverBorder: "hover:border-violet-200 dark:hover:border-violet-800", hoverShadow: "hover:shadow-violet-100/70 dark:hover:shadow-violet-950/60" },
  { key: "ecommerce",        label: "eCommerce",       Icon: ShoppingCart, bg: "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30", iconCls: "text-orange-500 dark:text-orange-400", activeBorder: "border-orange-400 dark:border-orange-600", hoverBorder: "hover:border-orange-200 dark:hover:border-orange-800", hoverShadow: "hover:shadow-orange-100/70 dark:hover:shadow-orange-950/60" },
  { key: "tool-or-app",      label: "Tools & Apps",    Icon: Wrench,      bg: "from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30",         iconCls: "text-teal-500 dark:text-teal-400",     activeBorder: "border-teal-400 dark:border-teal-600",    hoverBorder: "hover:border-teal-200 dark:hover:border-teal-800",       hoverShadow: "hover:shadow-teal-100/70 dark:hover:shadow-teal-950/60" },
  { key: "newsletter",       label: "Newsletters",     Icon: Mail,        bg: "from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/30",         iconCls: "text-rose-500 dark:text-rose-400",     activeBorder: "border-rose-400 dark:border-rose-600",    hoverBorder: "hover:border-rose-200 dark:hover:border-rose-800",       hoverShadow: "hover:shadow-rose-100/70 dark:hover:shadow-rose-950/60" },
  { key: "community",        label: "Community",       Icon: Users,       bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30", iconCls: "text-emerald-500 dark:text-emerald-400", activeBorder: "border-emerald-400 dark:border-emerald-600", hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-800", hoverShadow: "hover:shadow-emerald-100/70 dark:hover:shadow-emerald-950/60" },
  { key: "service-business", label: "Service Biz",     Icon: Briefcase,   bg: "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30",     iconCls: "text-amber-500 dark:text-amber-400",   activeBorder: "border-amber-400 dark:border-amber-600",  hoverBorder: "hover:border-amber-200 dark:hover:border-amber-800",     hoverShadow: "hover:shadow-amber-100/70 dark:hover:shadow-amber-950/60" },
  { key: "other",            label: "Other",           Icon: LayoutGrid,  bg: "from-slate-50 to-slate-100 dark:from-slate-950/40 dark:to-slate-900/30",     iconCls: "text-slate-500 dark:text-slate-400",   activeBorder: "border-slate-400 dark:border-slate-500",  hoverBorder: "hover:border-slate-200 dark:hover:border-slate-700",     hoverShadow: "hover:shadow-slate-200/70 dark:hover:shadow-slate-800/60" },
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { category, minPrice, maxPrice, q, sort } = params
  const sortParam = sort ?? "newest"

  const conditions: Parameters<typeof and>[0][] = [eq(listings.status, "active")]
  if (category) conditions.push(eq(listings.category, category))

  const rows = await db
    .select({
      listing: listings,
      seller: { username: users.username },
    })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(and(...conditions))
    .orderBy(listings.createdAt)

  const filtered = rows.filter(({ listing }) => {
    if (minPrice && listing.askingPrice < parseInt(minPrice)) return false
    if (maxPrice && listing.askingPrice > parseInt(maxPrice)) return false
    if (q) {
      const search = q.toLowerCase()
      if (
        !listing.title.toLowerCase().includes(search) &&
        !listing.description.toLowerCase().includes(search)
      ) return false
    }
    return true
  })

  const [{ totalListings }] = await db
    .select({ totalListings: count() })
    .from(listings)
    .where(eq(listings.status, "active"))

  const categoryCountRows = await db
    .select({ category: listings.category, total: count() })
    .from(listings)
    .where(eq(listings.status, "active"))
    .groupBy(listings.category)

  const categoryCountMap = Object.fromEntries(
    categoryCountRows.map(({ category, total }) => [category, total])
  )

  const sorted = [...filtered].sort((a, b) => {
    switch (sortParam) {
      case "price-asc":
        return a.listing.askingPrice - b.listing.askingPrice
      case "price-desc":
        return b.listing.askingPrice - a.listing.askingPrice
      case "revenue-desc":
        return (b.listing.monthlyRevenue ?? 0) - (a.listing.monthlyRevenue ?? 0)
      default: // newest
        return new Date(b.listing.createdAt).getTime() - new Date(a.listing.createdAt).getTime()
    }
  })

  const images = filtered.length
    ? await db.select().from(listingImages).where(eq(listingImages.displayOrder, 0))
    : []

  const imageMap = Object.fromEntries(images.map((img) => [img.listingId, img.url]))

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <div className="relative mb-8 py-14 px-6 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
          <div className="animate-orb-1 absolute -top-10 -right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="animate-orb-2 absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          {/* Sparkle particles */}
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/80 blur-[0.5px] pointer-events-none" style={{ top: '18%', left: '8%', animationDuration: '3.2s', animationDelay: '0s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/70 pointer-events-none" style={{ top: '68%', left: '6%', animationDuration: '2.5s', animationDelay: '1.1s' }} />
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/70 blur-[0.5px] pointer-events-none" style={{ top: '20%', right: '11%', animationDuration: '3.8s', animationDelay: '0.4s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/80 pointer-events-none" style={{ top: '58%', right: '9%', animationDuration: '2.8s', animationDelay: '1.8s' }} />
          <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/25 blur-sm pointer-events-none" style={{ top: '80%', left: '74%', animationDuration: '4.2s', animationDelay: '0.9s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-emerald-200/70 pointer-events-none" style={{ top: '44%', left: '54%', animationDuration: '3.0s', animationDelay: '2.2s' }} />
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-300/60 blur-[0.5px] pointer-events-none" style={{ top: '12%', left: '42%', animationDuration: '3.5s', animationDelay: '1.5s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/60 pointer-events-none" style={{ top: '30%', left: '88%', animationDuration: '2.6s', animationDelay: '2.8s' }} />
          <div className="relative">
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
              Websites for sale.{" "}
              <span className="animate-hero-gradient">
                No middleman.
              </span>
            </h1>
            <p className="animate-fade-in-up text-slate-300 text-lg max-w-xl mx-auto mb-6" style={{ animationDelay: "0.15s" }}>
              Browse profitable websites and apps. Contact sellers directly — no fees, no commissions.
            </p>
            <div className="animate-fade-in-up flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.28s" }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Zero broker fees
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <MessageCircle className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                Direct seller contact
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <BadgePercent className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                No commissions
              </span>
            </div>
            <div className="animate-fade-in-up mt-6 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.40s" }}>
              <div className="relative inline-block">
                <span className="animate-cta-ring absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 pointer-events-none" aria-hidden="true" />
                <Link
                  href="#listings"
                  className="relative overflow-hidden inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                >
                  <span className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" aria-hidden="true" />
                  <Search className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Browse Listings</span>
                </Link>
              </div>
              <Link
                href="/dashboard/listings/new"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-sm px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/30 hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4 text-indigo-300" />
                List Your Site Free
              </Link>
            </div>
            <div className="animate-fade-in-up mt-5 flex items-center justify-center gap-4 text-xs text-slate-400 flex-wrap" style={{ animationDelay: "0.52s" }}>
              <span className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span><CountUp target={totalListings} className="font-semibold text-slate-200" duration={1600} /> active listings</span>
              </span>
              <span className="text-white/20">·</span>
              <span><CountUp target={8} className="font-semibold text-slate-200" duration={900} /> categories</span>
              <span className="text-white/20">·</span>
              <span><span className="font-semibold text-slate-200">$0</span> in fees</span>
            </div>

            {/* Live listings ticker */}
            {rows.length >= 3 && (
              <div className="animate-fade-in-up mt-5 relative overflow-hidden rounded-lg bg-white/5 border border-white/10 py-2.5" style={{ animationDelay: "0.62s" }}>
                <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-slate-900/90 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-slate-900/90 to-transparent z-10 pointer-events-none" />
                <div className="animate-marquee flex gap-8 w-max hover:[animation-play-state:paused]">
                  {[...rows, ...rows].map(({ listing }, i) => (
                    <span key={i} className="inline-flex items-center gap-2 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 shrink-0" />
                      <span className="text-[11px] text-slate-300 font-medium max-w-[150px] truncate">{listing.title}</span>
                      <span className="text-[11px] font-bold text-emerald-400">{formatCurrency(listing.askingPrice)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-10 animate-on-scroll">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 animate-section-divider" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">How it works</span>
          <div className="h-px flex-1 animate-section-divider" style={{ animationDelay: "3.5s" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 sm:gap-2">
          <div className="relative flex flex-col items-center text-center p-5 rounded-xl bg-gradient-to-br from-indigo-50/60 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/50 border border-indigo-100 dark:border-indigo-900/40 overflow-hidden">
            <span className="absolute -bottom-3 -right-1 text-[80px] font-black text-indigo-100 dark:text-indigo-950/70 leading-none select-none pointer-events-none">1</span>
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 flex items-center justify-center mb-3 shadow-md shadow-indigo-200/60 dark:shadow-indigo-900/60 animate-icon-float" style={{ animationDelay: "0s" }}>
              <Search className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Step 1</p>
            <h3 className="font-semibold text-sm mb-1.5">Browse listings</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Filter by category, price, revenue, and traffic to find your next acquisition.</p>
          </div>
          <div className="hidden sm:flex items-center justify-center">
            <div className="flex items-center gap-0.5 animate-step-arrow">
              <div className="h-px w-5 animate-step-line" />
              <ArrowRight className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
            </div>
          </div>
          <div className="relative flex flex-col items-center text-center p-5 rounded-xl bg-gradient-to-br from-indigo-50/60 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/50 border border-indigo-100 dark:border-indigo-900/40 overflow-hidden">
            <span className="absolute -bottom-3 -right-1 text-[80px] font-black text-indigo-100 dark:text-indigo-950/70 leading-none select-none pointer-events-none">2</span>
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 flex items-center justify-center mb-3 shadow-md shadow-indigo-200/60 dark:shadow-indigo-900/60 animate-icon-float" style={{ animationDelay: "0.9s" }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Step 2</p>
            <h3 className="font-semibold text-sm mb-1.5">Contact the seller</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Reach out directly — no broker fees, no commissions, no middlemen.</p>
          </div>
          <div className="hidden sm:flex items-center justify-center">
            <div className="flex items-center gap-0.5 animate-step-arrow" style={{ animationDelay: "0.3s" }}>
              <div className="h-px w-5 animate-step-line" style={{ animationDelay: "0.3s" }} />
              <ArrowRight className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            </div>
          </div>
          <div className="relative flex flex-col items-center text-center p-5 rounded-xl bg-gradient-to-br from-emerald-50/60 to-slate-50 dark:from-emerald-950/30 dark:to-slate-900/50 border border-emerald-100 dark:border-emerald-900/40 overflow-hidden">
            <span className="absolute -bottom-3 -right-1 text-[80px] font-black text-emerald-100 dark:text-emerald-950/70 leading-none select-none pointer-events-none">3</span>
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500 flex items-center justify-center mb-3 shadow-md shadow-emerald-200/60 dark:shadow-emerald-900/60 animate-icon-float" style={{ animationDelay: "1.8s" }}>
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-1">Step 3</p>
            <h3 className="font-semibold text-sm mb-1.5">Close the deal</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Negotiate and complete the transaction entirely on your own terms.</p>
          </div>
        </div>
      </div>

      {/* Sell Your Site section */}
      <div className="mb-10 animate-on-scroll rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-emerald-950/20 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: copy + CTA */}
          <div className="p-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-4 w-fit">
              <Sparkles className="h-3 w-3" />
              AI-powered
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              List your site in 30 seconds —{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                AI writes the listing
              </span>
            </h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Enter your URL and asking price. Our AI scrapes your site and generates a polished, buyer-ready listing — title, description, tech stack, and more. Edit anything before publishing.
            </p>
            <Link
              href="/dashboard/listings/new"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all w-fit"
            >
              List Your Site
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: mock AI-generated listing card */}
          <div className="p-6 flex items-center justify-center bg-white/60 dark:bg-slate-900/40 border-t md:border-t-0 md:border-l border-indigo-100 dark:border-indigo-900/30">
            <div className="w-full max-w-sm space-y-2.5">
              {/* AI status indicator */}
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 pl-0.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                AI is analyzing your site&hellip;
              </div>
              {/* Card with shimmer */}
              <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4 space-y-3 overflow-hidden">
                {/* Shimmer sweep overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-400/[0.07] to-transparent animate-shimmer" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-indigo-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> AI Generated
                      <span className="animate-cursor inline-block w-[1.5px] h-3 bg-indigo-400 ml-0.5 align-middle" />
                    </p>
                    <h3 className="font-semibold text-sm leading-snug animate-ai-title-type">Profitable Recipe Blog for Sale</h3>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">$12,000</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 animate-ai-content-fade">
                  A well-established food & recipe content site with 45k monthly readers. Monetized through display ads and Amazon affiliates with consistent passive income. Built on WordPress with a clean, fast theme. Ready for a new owner to grow.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-900/40 px-2.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300 animate-ai-tag-pop" style={{ animationDelay: "0s" }}>Content Site</span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300 animate-ai-tag-pop" style={{ animationDelay: "0.18s" }}>WordPress</span>
                  <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300 animate-ai-tag-pop" style={{ animationDelay: "0.36s" }}>Display Ads</span>
                  <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/30 px-2.5 py-0.5 text-[10px] font-medium text-orange-700 dark:text-orange-300 animate-ai-tag-pop" style={{ animationDelay: "0.54s" }}>Affiliates</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex gap-4 text-[10px] text-muted-foreground animate-ai-content-fade" style={{ animationDelay: "0.2s" }}>
                  <span><span className="font-medium text-foreground">$420</span>/mo revenue</span>
                  <span><span className="font-medium text-foreground">45k</span> pageviews</span>
                  <span><span className="font-medium text-foreground">3 yrs</span> old</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broker vs Direct comparison */}
      <div className="mb-10 animate-on-scroll">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 animate-section-divider" style={{ animationDelay: "1.2s" }} />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">vs. traditional brokers</span>
          <div className="h-px flex-1 animate-section-divider" style={{ animationDelay: "4.7s" }} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* WebsitesForSale card */}
          <div className="animate-comparison-card-glow relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-emerald-500" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2)_0%,_transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 text-white text-sm font-bold shrink-0">W</span>
                <span className="font-bold text-white text-base">WebsitesForSale</span>
                <span className="ml-auto text-[10px] font-bold bg-emerald-400/15 text-emerald-400 border border-emerald-400/25 px-2.5 py-1 rounded-full tracking-wide">FREE</span>
              </div>
              <div className="space-y-3.5">
                {(
                  [
                    { label: "Commission fee", value: "0%" },
                    { label: "Listing fee", value: "Always free" },
                    { label: "Direct seller contact", value: true },
                    { label: "AI listing generation", value: true },
                    { label: "Time to list", value: "30 seconds" },
                  ] as { label: string; value: string | boolean }[]
                ).map(({ label, value }, i) => (
                  <div key={label} className="flex items-center justify-between gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span className="text-sm text-slate-300">{label}</span>
                    {typeof value === "boolean" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-semibold shrink-0">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-400/15 shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        Yes
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-emerald-400 shrink-0">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traditional broker card */}
          <div className="relative rounded-2xl overflow-hidden bg-muted/50 dark:bg-slate-900/40 border border-border/60 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-muted-foreground/15 text-muted-foreground text-sm font-bold shrink-0">B</span>
              <span className="font-bold text-muted-foreground text-base">Traditional Broker</span>
            </div>
            <div className="space-y-3.5">
              {(
                [
                  { label: "Commission fee", value: "10–15%" },
                  { label: "Listing fee", value: "$49–$299" },
                  { label: "Direct seller contact", value: false },
                  { label: "AI listing generation", value: false },
                  { label: "Time to list", value: "Days to weeks" },
                ] as { label: string; value: string | boolean }[]
              ).map(({ label, value }, i) => (
                <div key={label} className="flex items-center justify-between gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.08 + 0.1}s` }}>
                  <span className="text-sm text-muted-foreground">{label}</span>
                  {typeof value === "boolean" ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground/60 text-sm font-medium shrink-0">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-400/10 shrink-0">
                        <X className="w-3 h-3 text-red-400/80" />
                      </span>
                      No
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground/70 shrink-0 line-through decoration-muted-foreground/40">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="mb-10 animate-on-scroll">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px flex-1 animate-section-divider" style={{ animationDelay: "2.4s" }} />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Browse by category</span>
          <div className="h-px flex-1 animate-section-divider" style={{ animationDelay: "5.9s" }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORY_DISPLAY.map(({ key, label, Icon, bg, iconCls, activeBorder, hoverBorder, hoverShadow }, i) => {
            const isActive = category === key
            const listingCount = categoryCountMap[key] ?? 0
            return (
              <Link
                key={key}
                href={isActive ? "/" : `/?category=${key}`}
                className={`animate-fade-in-up group relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 bg-gradient-to-br ${bg} ${
                  isActive
                    ? `${activeBorder} shadow-sm ring-1 ring-current ring-opacity-20`
                    : `border-slate-100 dark:border-slate-800 ${hoverBorder} hover:shadow-md ${hoverShadow} hover:-translate-y-0.5`
                }`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {listingCount > 0 && (
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/30 text-current"
                      : "bg-white/70 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                  }`}>
                    {listingCount}
                  </span>
                )}
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-white/5 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
                  <Icon className={`w-5 h-5 ${iconCls}`} />
                </div>
                <span className="text-xs font-semibold text-center leading-tight">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <FilterBar categories={CATEGORIES} />

      {/* Budget range quick-filters */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Budget:</span>
        {(
          [
            { label: "Any",        min: undefined,  max: undefined  },
            { label: "Under $1k",  min: undefined,  max: "1000"     },
            { label: "$1k – $5k",  min: "1000",     max: "5000"     },
            { label: "$5k – $25k", min: "5000",     max: "25000"    },
            { label: "$25k+",      min: "25000",    max: undefined  },
          ] as { label: string; min?: string; max?: string }[]
        ).map(({ label, min, max }) => {
          const isActive =
            (min ?? "") === (minPrice ?? "") && (max ?? "") === (maxPrice ?? "")
          const urlParams = new URLSearchParams()
          if (category) urlParams.set("category", category)
          if (min)       urlParams.set("minPrice", min)
          if (max)       urlParams.set("maxPrice", max)
          if (q)         urlParams.set("q", q)
          const href = urlParams.size > 0 ? `/?${urlParams}` : "/"
          return (
            <Link
              key={label}
              href={href}
              className={`rounded-full text-xs font-medium px-3.5 py-1.5 border transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-emerald-600 text-white border-transparent shadow-sm"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-900/50"
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div id="listings" />
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 flex items-center justify-center mb-5 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
            <Search className="w-7 h-7 text-indigo-400 dark:text-indigo-500" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No listings found</h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Try adjusting your filters or search terms to find what you&apos;re looking for.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Browse all listings
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {sorted.length} listing{sorted.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1.5">Sort:</span>
              {SORT_OPTIONS.map(({ label, value }) => {
                const p = new URLSearchParams()
                if (category) p.set("category", category)
                if (minPrice) p.set("minPrice", minPrice)
                if (maxPrice) p.set("maxPrice", maxPrice)
                if (q) p.set("q", q)
                if (value !== "newest") p.set("sort", value)
                const isActive = sortParam === value
                return (
                  <Link
                    key={value}
                    href={p.size > 0 ? `/?${p}` : "/"}
                    className={`rounded-md text-xs font-medium px-2.5 py-1.5 border transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
          {(() => {
            const showSpotlight =
              sortParam === "newest" &&
              !category &&
              !minPrice &&
              !maxPrice &&
              !q &&
              sorted.length >= 3
            const spotlightItem = showSpotlight ? sorted[0] : null
            const gridItems = showSpotlight ? sorted.slice(1) : sorted
            return (
              <>
                {spotlightItem && (
                  <div className="mb-6">
                    <FeaturedListingCard
                      listing={spotlightItem.listing}
                      sellerUsername={spotlightItem.seller.username}
                      imageUrl={imageMap[spotlightItem.listing.id]}
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridItems.map(({ listing, seller }, i) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      sellerUsername={seller.username}
                      imageUrl={imageMap[listing.id]}
                      index={i}
                    />
                  ))}
                </div>
              </>
            )
          })()}
        </>
      )}
    </div>
  )
}
