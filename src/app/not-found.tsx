import Link from "next/link"
import { Search, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-lg text-center relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)] pointer-events-none" />
        {/* Animated orbs */}
        <div className="animate-orb-1 absolute -top-10 -right-10 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="animate-orb-2 absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        {/* Sparkle particles */}
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/80 blur-[0.5px] pointer-events-none" style={{ top: '12%', left: '8%', animationDuration: '3.2s', animationDelay: '0s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/65 pointer-events-none" style={{ top: '65%', left: '5%', animationDuration: '2.5s', animationDelay: '1.1s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/70 blur-[0.5px] pointer-events-none" style={{ top: '14%', right: '9%', animationDuration: '3.9s', animationDelay: '0.4s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/75 pointer-events-none" style={{ top: '60%', right: '7%', animationDuration: '2.8s', animationDelay: '1.8s' }} />
        <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/20 blur-sm pointer-events-none" style={{ top: '80%', left: '70%', animationDuration: '4.1s', animationDelay: '0.9s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-emerald-200/65 pointer-events-none" style={{ top: '34%', left: '52%', animationDuration: '3.0s', animationDelay: '2.3s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-300/55 blur-[0.5px] pointer-events-none" style={{ top: '88%', left: '36%', animationDuration: '3.5s', animationDelay: '1.6s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/55 pointer-events-none" style={{ top: '22%', left: '84%', animationDuration: '2.6s', animationDelay: '2.9s' }} />

        <div className="relative">
          {/* 404 badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 px-3 py-1 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6">
            404 · Not Found
          </div>

          {/* Floating animated icon */}
          <div className="animate-fade-in-up animate-icon-float relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30" style={{ animationDelay: '0.05s' }}>
            <div className="animate-shimmer absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            <Search className="w-9 h-9 text-white relative z-10" />
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up text-3xl font-bold text-white mb-3" style={{ animationDelay: '0.1s' }}>
            Page Not Found
          </h1>
          <p className="animate-fade-in-up text-slate-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ animationDelay: '0.2s' }}>
            This listing may have been sold or removed. Browse other profitable websites for sale below.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: '0.3s' }}>
            <div className="relative inline-block">
              <span className="animate-cta-ring absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 pointer-events-none" aria-hidden="true" />
              <Link
                href="/"
                className="relative overflow-hidden inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" aria-hidden="true" />
                <Search className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Browse Listings</span>
              </Link>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:border-white/30 hover:-translate-y-0.5"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
