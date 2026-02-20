import { notFound } from "next/navigation"
import { db } from "@/db"
import { listings, listingImages, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatNumber } from "@/lib/slug"
import { ContactForm } from "@/components/listings/ContactForm"
import { getSession } from "@/lib/auth"
import Link from "next/link"

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

  const age =
    listing.ageMonths >= 12
      ? `${Math.floor(listing.ageMonths / 12)} yr ${listing.ageMonths % 12} mo`
      : `${listing.ageMonths} mo`

  const memberSince = new Date(seller.createdAt).getFullYear()

  const now = new Date()
  const createdAt = new Date(listing.createdAt)
  const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  const listedAgo = daysDiff === 0 ? "today" : daysDiff === 1 ? "yesterday" : `${daysDiff}d ago`

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.22)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.13)_0%,_transparent_60%)]" />
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
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <img
              key={img.id}
              src={img.url}
              alt={`Screenshot ${i + 1}`}
              className={`rounded-lg object-cover w-full ${i === 0 && images.length > 1 ? "col-span-2 aspect-video" : "aspect-video"}`}
            />
          ))}
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricBox label="Asking Price" value={formatCurrency(listing.askingPrice)} color="indigo" />
        {listing.monthlyRevenue != null && (
          <MetricBox label="Monthly Revenue" value={formatCurrency(listing.monthlyRevenue)} color="emerald" />
        )}
        {listing.monthlyProfit != null && (
          <MetricBox label="Monthly Profit" value={formatCurrency(listing.monthlyProfit)} color="teal" />
        )}
        {listing.monthlyTraffic != null && (
          <MetricBox label="Monthly Traffic" value={formatNumber(listing.monthlyTraffic) + " views"} color="sky" />
        )}
        <MetricBox label="Age" value={age} color="amber" />
        {listing.monthlyRevenue && listing.askingPrice ? (
          <MetricBox
            label="Multiple"
            value={`${(listing.askingPrice / listing.monthlyRevenue).toFixed(1)}x monthly`}
            color="violet"
          />
        ) : null}
      </div>

      <Separator />

      {/* Live URL */}
      <div>
        <h2 className="font-semibold mb-1">Live Site</h2>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {listing.url}
        </a>
      </div>

      {/* Description */}
      <div>
        <h2 className="font-semibold mb-2">About This Site</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
      </div>

      {/* Reason for selling */}
      <div>
        <h2 className="font-semibold mb-2">Reason for Selling</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{listing.reasonForSelling}</p>
      </div>

      {/* Included assets */}
      {listing.includedAssets && (
        <div>
          <h2 className="font-semibold mb-2">What&apos;s Included</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{listing.includedAssets}</p>
        </div>
      )}

      {/* Tags */}
      {(listing.techStack?.length || listing.monetization?.length) ? (
        <div className="space-y-3">
          {listing.techStack?.length ? (
            <div>
              <h2 className="font-semibold mb-2">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {listing.techStack.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
            </div>
          ) : null}
          {listing.monetization?.length ? (
            <div>
              <h2 className="font-semibold mb-2">Monetization</h2>
              <div className="flex flex-wrap gap-2">
                {listing.monetization.map((m) => (
                  <Badge key={m} variant="outline">{m}</Badge>
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
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {listing.faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <p className="font-medium mb-1">{faq.q}</p>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Contact form */}
      {listing.status === "active" ? (
        <div>
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

type MetricColor = "indigo" | "emerald" | "teal" | "sky" | "amber" | "violet"

const METRIC_COLOR_STYLES: Record<MetricColor, { border: string; bg: string; value: string }> = {
  indigo: {
    border: "border-indigo-200 dark:border-indigo-800/60",
    bg: "bg-gradient-to-br from-indigo-50/70 to-emerald-50/50 dark:from-indigo-950/30 dark:to-emerald-950/20",
    value: "bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-800/60",
    bg: "bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20",
    value: "text-emerald-700 dark:text-emerald-400",
  },
  teal: {
    border: "border-teal-200 dark:border-teal-800/60",
    bg: "bg-gradient-to-br from-teal-50/70 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/20",
    value: "text-teal-700 dark:text-teal-400",
  },
  sky: {
    border: "border-sky-200 dark:border-sky-800/60",
    bg: "bg-gradient-to-br from-sky-50/70 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/20",
    value: "text-sky-700 dark:text-sky-400",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-800/60",
    bg: "bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20",
    value: "text-amber-700 dark:text-amber-400",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-800/60",
    bg: "bg-gradient-to-br from-violet-50/70 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/20",
    value: "text-violet-700 dark:text-violet-400",
  },
}

function MetricBox({ label, value, color = "indigo" }: { label: string; value: string; color?: MetricColor }) {
  const styles = METRIC_COLOR_STYLES[color]
  return (
    <div className={`rounded-lg border p-4 ${styles.border} ${styles.bg}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-semibold text-lg ${styles.value}`}>{value}</p>
    </div>
  )
}
