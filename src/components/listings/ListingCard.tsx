import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Listing } from "@/db/schema"
import { formatCurrency, formatNumber } from "@/lib/slug"

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

export function ListingCard({
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

  const showNewBadge = isNewListing(listing.createdAt)

  return (
    <Link href={`/listings/${listing.slug}`}>
      <Card className="h-full hover:shadow-xl hover:shadow-indigo-100/60 dark:hover:shadow-indigo-950/50 transition-all duration-300 cursor-pointer group hover:border-indigo-200/70 dark:hover:border-indigo-800/50">
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
          <div className="aspect-video rounded-t-lg bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12)_0%,_transparent_70%)]" />
            <span className="text-4xl opacity-20 relative select-none">🌐</span>
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
            <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[listing.category] ?? CATEGORY_STYLES["other"]}`}>
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
              <p className="text-muted-foreground text-xs">Asking Price</p>
              <p className="font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(listing.askingPrice)}
              </p>
            </div>
            {listing.monthlyRevenue ? (
              <div>
                <p className="text-muted-foreground text-xs">Monthly Revenue</p>
                <p className="font-semibold">{formatCurrency(listing.monthlyRevenue)}</p>
              </div>
            ) : null}
            {listing.monthlyTraffic ? (
              <div>
                <p className="text-muted-foreground text-xs">Monthly Traffic</p>
                <p className="font-semibold">{formatNumber(listing.monthlyTraffic)}</p>
              </div>
            ) : null}
            <div>
              <p className="text-muted-foreground text-xs">Age</p>
              <p className="font-semibold">{age}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Listed by <span className="font-medium">{sellerUsername}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
