import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ListingCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-video bg-muted animate-pulse" />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          {/* Title */}
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
          {/* Category badge */}
          <div className="h-5 w-16 bg-muted animate-pulse rounded-full shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-muted animate-pulse rounded w-full" />
          <div className="h-3.5 bg-muted animate-pulse rounded w-4/5" />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Seller */}
        <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
      </CardContent>
    </Card>
  )
}
