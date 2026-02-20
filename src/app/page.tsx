import { db } from "@/db"
import { listings, listingImages, users } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { ListingCard } from "@/components/listings/ListingCard"
import { FilterBar } from "@/components/listings/FilterBar"
import Link from "next/link"
import { Search, ShieldCheck, MessageCircle, BadgePercent, Sparkles, ArrowRight, Handshake, FileText, Code2, ShoppingCart, Wrench, Mail, Users, Briefcase, LayoutGrid, type LucideIcon } from "lucide-react"

export const dynamic = "force-dynamic"

const CATEGORIES = [
  "content-site", "saas", "ecommerce", "tool-or-app",
  "newsletter", "community", "service-business", "other",
]

const CATEGORY_DISPLAY: {
  key: string
  label: string
  Icon: LucideIcon
  bg: string
  iconCls: string
  activeBorder: string
  hoverBorder: string
}[] = [
  { key: "content-site",     label: "Content Sites",   Icon: FileText,    bg: "from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/30",           iconCls: "text-sky-500 dark:text-sky-400",      activeBorder: "border-sky-400 dark:border-sky-600",     hoverBorder: "hover:border-sky-200 dark:hover:border-sky-800" },
  { key: "saas",             label: "SaaS",            Icon: Code2,       bg: "from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30", iconCls: "text-violet-500 dark:text-violet-400", activeBorder: "border-violet-400 dark:border-violet-600", hoverBorder: "hover:border-violet-200 dark:hover:border-violet-800" },
  { key: "ecommerce",        label: "eCommerce",       Icon: ShoppingCart, bg: "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30", iconCls: "text-orange-500 dark:text-orange-400", activeBorder: "border-orange-400 dark:border-orange-600", hoverBorder: "hover:border-orange-200 dark:hover:border-orange-800" },
  { key: "tool-or-app",      label: "Tools & Apps",    Icon: Wrench,      bg: "from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30",         iconCls: "text-teal-500 dark:text-teal-400",     activeBorder: "border-teal-400 dark:border-teal-600",    hoverBorder: "hover:border-teal-200 dark:hover:border-teal-800" },
  { key: "newsletter",       label: "Newsletters",     Icon: Mail,        bg: "from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/30",         iconCls: "text-rose-500 dark:text-rose-400",     activeBorder: "border-rose-400 dark:border-rose-600",    hoverBorder: "hover:border-rose-200 dark:hover:border-rose-800" },
  { key: "community",        label: "Community",       Icon: Users,       bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30", iconCls: "text-emerald-500 dark:text-emerald-400", activeBorder: "border-emerald-400 dark:border-emerald-600", hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-800" },
  { key: "service-business", label: "Service Biz",     Icon: Briefcase,   bg: "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30",     iconCls: "text-amber-500 dark:text-amber-400",   activeBorder: "border-amber-400 dark:border-amber-600",  hoverBorder: "hover:border-amber-200 dark:hover:border-amber-800" },
  { key: "other",            label: "Other",           Icon: LayoutGrid,  bg: "from-slate-50 to-slate-100 dark:from-slate-950/40 dark:to-slate-900/30",     iconCls: "text-slate-500 dark:text-slate-400",   activeBorder: "border-slate-400 dark:border-slate-500",  hoverBorder: "hover:border-slate-200 dark:hover:border-slate-700" },
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { category, minPrice, maxPrice, q } = params

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
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
              Websites for sale.{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                No middleman.
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-6">
              Browse profitable websites and apps. Contact sellers directly — no fees, no commissions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
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
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">How it works</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/60 dark:to-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center mb-3 shadow-sm">
              <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Step 1</p>
            <h3 className="font-semibold text-sm mb-1.5">Browse listings</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Filter by category, price, revenue, and traffic to find your next acquisition.</p>
          </div>
          <div className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/60 dark:to-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center mb-3 shadow-sm">
              <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Step 2</p>
            <h3 className="font-semibold text-sm mb-1.5">Contact the seller</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Reach out directly — no broker fees, no commissions, no middlemen.</p>
          </div>
          <div className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/60 dark:to-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center mb-3 shadow-sm">
              <Handshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-1">Step 3</p>
            <h3 className="font-semibold text-sm mb-1.5">Close the deal</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Negotiate and complete the transaction entirely on your own terms.</p>
          </div>
        </div>
      </div>

      {/* Sell Your Site section */}
      <div className="mb-10 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-emerald-950/20 overflow-hidden">
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
            <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-medium text-indigo-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" /> AI Generated
                  </p>
                  <h3 className="font-semibold text-sm leading-snug">Profitable Recipe Blog for Sale</h3>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">$12,000</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                A well-established food & recipe content site with 45k monthly readers. Monetized through display ads and Amazon affiliates with consistent passive income. Built on WordPress with a clean, fast theme. Ready for a new owner to grow.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">Content Site</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">WordPress</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">Display Ads</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">Affiliates</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex gap-4 text-[10px] text-muted-foreground">
                <span><span className="font-medium text-foreground">$420</span>/mo revenue</span>
                <span><span className="font-medium text-foreground">45k</span> pageviews</span>
                <span><span className="font-medium text-foreground">3 yrs</span> old</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Browse by category</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORY_DISPLAY.map(({ key, label, Icon, bg, iconCls, activeBorder, hoverBorder }) => {
            const isActive = category === key
            return (
              <Link
                key={key}
                href={isActive ? "/" : `/?category=${key}`}
                className={`group flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 bg-gradient-to-br ${bg} ${
                  isActive
                    ? `${activeBorder} shadow-sm ring-1 ring-current ring-opacity-20`
                    : `border-slate-100 dark:border-slate-800 ${hoverBorder} hover:shadow-sm`
                }`}
              >
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
          <p className="text-sm text-muted-foreground mt-6 mb-2">
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(({ listing, seller }, i) => (
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
      )}
    </div>
  )
}
