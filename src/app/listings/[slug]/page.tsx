import { notFound } from "next/navigation"
import { db } from "@/db"
import { listings, listingImages, users } from "@/db/schema"
import { eq, ne, and, count } from "drizzle-orm"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatNumber } from "@/lib/slug"
import { ContactForm } from "@/components/listings/ContactForm"
import { ImageGallery } from "@/components/listings/ImageGallery"
import { ListingCard } from "@/components/listings/ListingCard"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import { Globe, Info, MessageSquare, Package, DollarSign, TrendingUp, Wallet, Eye, Clock, Layers, ArrowRight, HelpCircle } from "lucide-react"
import { FloatingContactButton } from "@/components/listings/FloatingContactButton"
import { ScrollProgress } from "@/components/listings/ScrollProgress"
import { DealMeter } from "@/components/listings/DealMeter"
import { ReturnsCalculator } from "@/components/listings/ReturnsCalculator"
import { MetricBox } from "@/components/listings/MetricBox"

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

const TECH_BADGE_COLORS: Record<string, string> = {
  "wordpress":    "bg-blue-100   text-blue-700   border-blue-200   dark:bg-blue-900/30   dark:text-blue-300   dark:border-blue-800",
  "react":        "bg-cyan-100   text-cyan-700   border-cyan-200   dark:bg-cyan-900/30   dark:text-cyan-300   dark:border-cyan-800",
  "next.js":      "bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600",
  "nextjs":       "bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600",
  "node.js":      "bg-green-100  text-green-700  border-green-200  dark:bg-green-900/30  dark:text-green-300  dark:border-green-800",
  "nodejs":       "bg-green-100  text-green-700  border-green-200  dark:bg-green-900/30  dark:text-green-300  dark:border-green-800",
  "python":       "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  "django":       "bg-teal-100   text-teal-700   border-teal-200   dark:bg-teal-900/30   dark:text-teal-300   dark:border-teal-800",
  "shopify":      "bg-teal-100   text-teal-700   border-teal-200   dark:bg-teal-900/30   dark:text-teal-300   dark:border-teal-800",
  "vue":          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  "vue.js":       "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  "nuxt":         "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  "nuxt.js":      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  "tailwind":     "bg-sky-100    text-sky-700    border-sky-200    dark:bg-sky-900/30    dark:text-sky-300    dark:border-sky-800",
  "tailwindcss":  "bg-sky-100    text-sky-700    border-sky-200    dark:bg-sky-900/30    dark:text-sky-300    dark:border-sky-800",
  "php":          "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  "laravel":      "bg-rose-100   text-rose-700   border-rose-200   dark:bg-rose-900/30   dark:text-rose-300   dark:border-rose-800",
  "typescript":   "bg-blue-100   text-blue-700   border-blue-200   dark:bg-blue-900/30   dark:text-blue-300   dark:border-blue-800",
  "javascript":   "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  "ruby on rails":"bg-red-100    text-red-700    border-red-200    dark:bg-red-900/30    dark:text-red-300    dark:border-red-800",
  "rails":        "bg-red-100    text-red-700    border-red-200    dark:bg-red-900/30    dark:text-red-300    dark:border-red-800",
  "svelte":       "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  "sveltekit":    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  "flutter":      "bg-sky-100    text-sky-700    border-sky-200    dark:bg-sky-900/30    dark:text-sky-300    dark:border-sky-800",
  "woocommerce":  "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  "ghost":        "bg-slate-100  text-slate-700  border-slate-200  dark:bg-slate-800     dark:text-slate-300  dark:border-slate-700",
  "webflow":      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "aws":          "bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-900/30  dark:text-amber-300  dark:border-amber-800",
  "supabase":     "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
}

const MONETIZATION_BADGE_COLORS: Record<string, string> = {
  "display ads":          "bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-900/30  dark:text-amber-300  dark:border-amber-800",
  "adsense":              "bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-900/30  dark:text-amber-300  dark:border-amber-800",
  "google adsense":       "bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-900/30  dark:text-amber-300  dark:border-amber-800",
  "affiliate marketing":  "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  "affiliates":           "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  "amazon associates":    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  "subscriptions":        "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  "saas":                 "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  "ecommerce":            "bg-teal-100   text-teal-700   border-teal-200   dark:bg-teal-900/30   dark:text-teal-300   dark:border-teal-800",
  "sponsored content":    "bg-rose-100   text-rose-700   border-rose-200   dark:bg-rose-900/30   dark:text-rose-300   dark:border-rose-800",
  "sponsorships":         "bg-rose-100   text-rose-700   border-rose-200   dark:bg-rose-900/30   dark:text-rose-300   dark:border-rose-800",
  "digital products":     "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "info products":        "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "consulting":           "bg-sky-100    text-sky-700    border-sky-200    dark:bg-sky-900/30    dark:text-sky-300    dark:border-sky-800",
  "services":             "bg-sky-100    text-sky-700    border-sky-200    dark:bg-sky-900/30    dark:text-sky-300    dark:border-sky-800",
  "lead generation":      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  "leads":                "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  "marketplace":          "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  "newsletter":           "bg-pink-100   text-pink-700   border-pink-200   dark:bg-pink-900/30   dark:text-pink-300   dark:border-pink-800",
  "email list":           "bg-pink-100   text-pink-700   border-pink-200   dark:bg-pink-900/30   dark:text-pink-300   dark:border-pink-800",
}

const DEFAULT_BADGE_STYLE = "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"

const CATEGORY_HEADER_RADIAL: Record<string, { top: string; bottom: string }> = {
  "content-site":     { top: "rgba(14,165,233,0.28)",  bottom: "rgba(2,132,199,0.14)" },
  "saas":             { top: "rgba(139,92,246,0.28)",  bottom: "rgba(109,40,217,0.14)" },
  "ecommerce":        { top: "rgba(249,115,22,0.28)",  bottom: "rgba(234,88,12,0.14)" },
  "tool-or-app":      { top: "rgba(20,184,166,0.28)",  bottom: "rgba(15,118,110,0.14)" },
  "newsletter":       { top: "rgba(244,63,94,0.28)",   bottom: "rgba(225,29,72,0.14)" },
  "community":        { top: "rgba(16,185,129,0.28)",  bottom: "rgba(5,150,105,0.14)" },
  "service-business": { top: "rgba(245,158,11,0.28)",  bottom: "rgba(217,119,6,0.14)" },
  "other":            { top: "rgba(99,102,241,0.22)",  bottom: "rgba(16,185,129,0.13)" },
}

const CATEGORY_ACCENT_BAR: Record<string, string> = {
  "content-site":     "from-sky-400 to-sky-500",
  "saas":             "from-violet-400 to-violet-500",
  "ecommerce":        "from-orange-400 to-orange-500",
  "tool-or-app":      "from-teal-400 to-teal-500",
  "newsletter":       "from-rose-400 to-rose-500",
  "community":        "from-emerald-400 to-emerald-500",
  "service-business": "from-amber-400 to-amber-500",
  "other":            "from-slate-400 to-slate-500",
}

function getTagStyle(value: string, colorMap: Record<string, string>): string {
  return colorMap[value.toLowerCase().trim()] ?? DEFAULT_BADGE_STYLE
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const session = await getSession()

  const [row] = await db
    .select({ listing: listings, seller: { username: users.username, createdAt: users.createdAt } })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(eq(listings.slug, slug))
    .limit(1)

  if (!row) notFound()

  const { listing, seller } = row

  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listing.id))
    .orderBy(listingImages.displayOrder)

  const relatedRows = await db
    .select({
      listing: listings,
      seller: { username: users.username },
    })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(and(
      eq(listings.status, "active"),
      eq(listings.category, listing.category),
      ne(listings.id, listing.id),
    ))
    .limit(3)

  const relatedImages = relatedRows.length
    ? await db.select().from(listingImages).where(eq(listingImages.displayOrder, 0))
    : []
  const relatedImageMap = Object.fromEntries(relatedImages.map((img) => [img.listingId, img.url]))

  const [{ sellerListingCount }] = await db
    .select({ sellerListingCount: count() })
    .from(listings)
    .where(and(eq(listings.sellerId, listing.sellerId), eq(listings.status, "active")))

  const sellerJoinDate = new Date(seller.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  const age =
    listing.ageMonths >= 12
      ? `${Math.floor(listing.ageMonths / 12)} yr ${listing.ageMonths % 12} mo`
      : `${listing.ageMonths} mo`

  const memberSince = new Date(seller.createdAt).getFullYear()

  const now = new Date()
  const createdAt = new Date(listing.createdAt)
  const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  const listedAgo = daysDiff === 0 ? "today" : daysDiff === 1 ? "yesterday" : `${daysDiff}d ago`

  const headerRadial = CATEGORY_HEADER_RADIAL[listing.category] ?? CATEGORY_HEADER_RADIAL["other"]
  const accentBar = CATEGORY_ACCENT_BAR[listing.category] ?? CATEGORY_ACCENT_BAR["other"]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <ScrollProgress />
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10">
        {/* Category accent top bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accentBar}`} />
        {/* Category-tinted radial gradients */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top right, ${headerRadial.top} 0%, transparent 60%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom left, ${headerRadial.bottom} 0%, transparent 60%)` }} />
        {/* Animated floating orbs */}
        <div className="animate-orb-1 absolute -top-10 -right-10 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="animate-orb-2 absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="relative space-y-4">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-slate-200 backdrop-blur-sm">
              {CATEGORY_LABELS[listing.category] ?? listing.category}
            </span>
            {listing.status !== "active" && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                listing.status === "sold"
                  ? "bg-red-500/20 border border-red-500/30 text-red-300"
                  : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
              }`}>
                {listing.status === "under_offer" ? "Under Offer" : "Sold"}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-400">
              Listed {listedAgo}
            </span>
          </div>
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">{listing.title}</h1>
          {/* Price row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              {formatCurrency(listing.askingPrice)}
            </span>
            {listing.monthlyRevenue && listing.monthlyRevenue > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                {(listing.askingPrice / listing.monthlyRevenue).toFixed(1)}x revenue
              </span>
            )}
          </div>
          {/* Seller */}
          <p className="text-slate-400 text-sm">
            Listed by{" "}
            <Link href={`/seller/${seller.username}`} className="text-slate-300 hover:text-white transition-colors hover:underline underline-offset-2">
              {seller.username}
            </Link>
            {" "}· Member since {memberSince}
          </p>
        </div>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <ImageGallery images={images} />
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricBox label="Asking Price" value={formatCurrency(listing.askingPrice)} rawValue={listing.askingPrice} prefix="$" color="indigo" icon={DollarSign} index={0} />
        {listing.monthlyRevenue != null && (
          <MetricBox label="Monthly Revenue" value={formatCurrency(listing.monthlyRevenue)} rawValue={listing.monthlyRevenue} prefix="$" color="emerald" icon={TrendingUp} index={1} />
        )}
        {listing.monthlyProfit != null && (
          <MetricBox label="Monthly Profit" value={formatCurrency(listing.monthlyProfit)} rawValue={listing.monthlyProfit} prefix="$" color="teal" icon={Wallet} index={2} />
        )}
        {listing.monthlyTraffic != null && (
          <MetricBox label="Monthly Traffic" value={formatNumber(listing.monthlyTraffic) + " views"} rawValue={listing.monthlyTraffic} suffix=" views" color="sky" icon={Eye} index={3} />
        )}
        <MetricBox label="Age" value={age} color="amber" icon={Clock} index={4} />
        {listing.monthlyRevenue && listing.askingPrice ? (
          <MetricBox
            label="Multiple"
            value={`${(listing.askingPrice / listing.monthlyRevenue).toFixed(1)}x monthly`}
            color="violet"
            icon={Layers}
            index={5}
          />
        ) : null}
      </div>

      {/* Deal Meter */}
      {listing.monthlyRevenue != null && listing.monthlyRevenue > 0 && (
        <DealMeter multiple={listing.askingPrice / listing.monthlyRevenue} />
      )}

      {/* Returns Calculator */}
      {listing.monthlyRevenue != null && listing.monthlyRevenue > 0 && (
        <ReturnsCalculator
          askingPrice={listing.askingPrice}
          monthlyRevenue={listing.monthlyRevenue}
          monthlyProfit={listing.monthlyProfit}
        />
      )}

      <Separator />

      {/* Live URL */}
      <div className="rounded-xl border border-border/60 bg-muted/30 px-5 py-4 flex items-center gap-3">
        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
          <Globe className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Live Site</p>
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 dark:text-sky-400 hover:underline break-all text-sm font-medium"
          >
            {listing.url}
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-border/60 bg-muted/20 px-5 py-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-md bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <Info className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="font-semibold">About This Site</h2>
        </div>
        <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{listing.description}</p>
      </div>

      {/* Reason for selling */}
      <div className="rounded-xl border border-border/60 bg-muted/20 px-5 py-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-md bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <MessageSquare className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="font-semibold">Reason for Selling</h2>
        </div>
        <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{listing.reasonForSelling}</p>
      </div>

      {/* Included assets */}
      {listing.includedAssets && (
        <div className="rounded-xl border border-border/60 bg-muted/20 px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-md bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Package className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="font-semibold">What&apos;s Included</h2>
          </div>
          <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{listing.includedAssets}</p>
        </div>
      )}

      {/* Tags */}
      {(listing.techStack?.length || listing.monetization?.length) ? (
        <div className="space-y-4">
          {listing.techStack?.length ? (
            <div>
              <h2 className="font-semibold mb-2.5 text-sm uppercase tracking-wide text-muted-foreground">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {listing.techStack.map((t) => (
                  <span
                    key={t}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${getTagStyle(t, TECH_BADGE_COLORS)}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {listing.monetization?.length ? (
            <div>
              <h2 className="font-semibold mb-2.5 text-sm uppercase tracking-wide text-muted-foreground">Monetization</h2>
              <div className="flex flex-wrap gap-2">
                {listing.monetization.map((m) => (
                  <span
                    key={m}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${getTagStyle(m, MONETIZATION_BADGE_COLORS)}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* FAQs */}
      {listing.faqs && listing.faqs.length > 0 && (
        <>
          <Separator />
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {listing.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border/60 overflow-hidden">
                  <div className="flex items-start gap-3 px-5 py-4 bg-muted/30">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold mt-0.5 shadow-sm">
                      {i + 1}
                    </div>
                    <p className="font-semibold text-sm leading-snug pt-0.5">{faq.q}</p>
                  </div>
                  <div className="px-5 py-4 border-t border-border/40 bg-background/60 pl-14">
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Related listings */}
      {relatedRows.length > 0 && (
        <>
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold">More {CATEGORY_LABELS[listing.category] ?? "Listings"} for Sale</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Similar listings you might be interested in</p>
              </div>
              <Link
                href={`/?category=${listing.category}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedRows.map(({ listing: related, seller: relatedSeller }, i) => (
                <ListingCard
                  key={related.id}
                  listing={related}
                  sellerUsername={relatedSeller.username}
                  imageUrl={relatedImageMap[related.id]}
                  index={i}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Seller card */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="relative h-12 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-end gap-3 -mt-6 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold ring-2 ring-background shrink-0">
              {seller.username[0].toUpperCase()}
            </div>
            <div className="pb-0.5">
              <Link
                href={`/seller/${seller.username}`}
                className="font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {seller.username}
              </Link>
              <p className="text-xs text-muted-foreground">Member since {sellerJoinDate}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{sellerListingCount}</span>{" "}
              active listing{sellerListingCount !== 1 ? "s" : ""}
            </p>
            <Link
              href={`/seller/${seller.username}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View profile
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contact form */}
      {listing.status === "active" && <FloatingContactButton />}
      {listing.status === "active" ? (
        <div id="contact">
          <h2 className="text-xl font-semibold mb-4">Contact the Seller</h2>
          {session ? (
            <ContactForm
              listingId={listing.id}
              listingTitle={listing.title}
              buyerEmail={session.user.email}
            />
          ) : (
            <div className="relative max-w-lg rounded-2xl overflow-hidden border border-indigo-100 dark:border-indigo-900/50 shadow-lg">
              {/* Gradient header strip */}
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 px-6 py-4">
                <p className="font-semibold text-white text-base">Contact this seller — it&apos;s free</p>
                <p className="text-indigo-100 text-sm mt-0.5">No broker fees. No commissions. Direct contact.</p>
              </div>
              {/* Body */}
              <div className="bg-card px-6 py-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">✓</div>
                  <div>
                    <p className="text-sm font-medium">Reply goes straight to your inbox</p>
                    <p className="text-xs text-muted-foreground mt-0.5">The seller emails you directly — no middleman reads your messages.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">✓</div>
                  <div>
                    <p className="text-sm font-medium">Your email stays private</p>
                    <p className="text-xs text-muted-foreground mt-0.5">We never share your address publicly or sell it to third parties.</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Link
                    href={`/register?next=/listings/${listing.slug}`}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
                  >
                    Create free account
                  </Link>
                  <Link
                    href={`/login?next=/listings/${listing.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          This listing is no longer accepting inquiries.
        </p>
      )}
    </div>
  )
}

