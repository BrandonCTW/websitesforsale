import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Listing } from "@/db/schema"
import { formatCurrency, formatNumber } from "@/lib/slug"

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

  return (
    <Link href={`/listings/${listing.slug}`}>
      <Card className="h-full hover:shadow-xl hover:shadow-indigo-100/60 dark:hover:shadow-indigo-950/50 transition-all duration-300 cursor-pointer group hover:border-indigo-200/70 dark:hover:border-indigo-800/50">
        {imageUrl ? (
          <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-t-lg bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12)_0%,_transparent_70%)]" />
            <span className="text-4xl opacity-20 relative select-none">🌐</span>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold leading-snug group-hover:underline line-clamp-2">
              {listing.title}
            </h2>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {CATEGORY_LABELS[listing.category] ?? listing.category}
            </Badge>
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
