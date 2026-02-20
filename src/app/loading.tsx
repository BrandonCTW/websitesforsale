import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton"

export default function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero section — static, same as page.tsx */}
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
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                Zero broker fees
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 inline-block" />
                Direct seller contact
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                No commissions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[80, 56, 88, 72, 88, 96, 120, 64].map((w, i) => (
            <div
              key={i}
              className="h-7 animate-skeleton-shimmer rounded-full"
              style={{ width: `${w}px`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <div className="h-9 animate-skeleton-shimmer rounded-md flex-1 max-w-xs" />
          <div className="h-9 w-16 animate-skeleton-shimmer rounded-md" />
          <div className="h-9 w-40 animate-skeleton-shimmer rounded-md" />
        </div>
      </div>

      {/* Count skeleton */}
      <div className="mt-6 mb-2 h-4 w-28 animate-skeleton-shimmer rounded" />

      {/* Listing grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
