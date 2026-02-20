import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ListingCardSkeleton() {
  return (
    <div className="relative">
      {/* Category accent top bar — muted shimmer, mirrors real card structure */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl z-10 animate-skeleton-shimmer" />

      <Card className="h-full overflow-hidden">
        {/* Image placeholder with browser chrome mockup */}
        <div className="aspect-video relative overflow-hidden animate-skeleton-shimmer">
          {/* Shimmer sweep overlay */}
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.18] dark:via-white/[0.06] to-transparent animate-shimmer pointer-events-none" />
          {/* Browser chrome frame */}
          <div className="absolute inset-3 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex flex-col overflow-hidden border border-black/[0.04] dark:border-white/[0.06]">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/[0.04] dark:bg-white/[0.04] border-b border-black/[0.04] dark:border-white/[0.04] shrink-0">
              <span className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
              <span className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
              <span className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="flex-1 h-1.5 rounded-full bg-black/[0.07] dark:bg-white/[0.07] mx-1" />
            </div>
            <div className="flex-1 p-2 space-y-1.5">
              <div className="h-4 rounded-md bg-black/[0.07] dark:bg-white/[0.07]" />
              <div className="flex gap-1.5">
                <div className="h-2.5 rounded flex-1 bg-black/[0.05] dark:bg-white/[0.05]" />
                <div className="h-2.5 rounded w-12 bg-black/[0.04] dark:bg-white/[0.04]" />
              </div>
              <div className="h-2.5 rounded w-4/5 bg-black/[0.05] dark:bg-white/[0.05]" />
              <div className="flex gap-1 pt-0.5">
                <div className="h-5 rounded flex-1 bg-black/[0.04] dark:bg-white/[0.04]" />
                <div className="h-5 rounded flex-1 bg-black/[0.04] dark:bg-white/[0.04]" />
                <div className="h-5 rounded flex-1 bg-black/[0.04] dark:bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1.5">
              <div className="h-4 animate-skeleton-shimmer rounded w-3/4" />
              <div className="h-4 animate-skeleton-shimmer rounded w-1/2" />
            </div>
            <div className="h-5 w-16 animate-skeleton-shimmer rounded-full shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <div className="h-3.5 animate-skeleton-shimmer rounded w-full" />
            <div className="h-3.5 animate-skeleton-shimmer rounded w-4/5" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 animate-skeleton-shimmer rounded w-2/3" />
                <div className="h-4 animate-skeleton-shimmer rounded w-1/2" />
              </div>
            ))}
          </div>

          <div className="pt-2.5 border-t border-border/50 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full animate-skeleton-shimmer shrink-0" />
            <div className="h-3 animate-skeleton-shimmer rounded flex-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
