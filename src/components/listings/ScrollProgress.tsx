"use client"

import { useEffect, useState } from "react"

const SPARKLES = [
  { size: "w-1 h-1",   color: "bg-violet-400", dur: "2.8s", delay: "0s",    offset: "-top-2.5 -right-4" },
  { size: "w-px h-px", color: "bg-indigo-300", dur: "3.4s", delay: "0.7s",  offset: "top-1.5 -right-3" },
  { size: "w-1 h-1",   color: "bg-emerald-400",dur: "2.6s", delay: "1.2s",  offset: "-top-1 -right-5" },
]

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", update, { passive: true })
    update()
    return () => window.removeEventListener("scroll", update)
  }, [])

  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
      <div
        className="relative h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 overflow-visible"
        style={{ width: `${progress}%`, transition: "width 80ms linear" }}
      >
        {/* Shimmer sweep */}
        <div
          className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ backgroundSize: "200% 100%" }}
          aria-hidden="true"
        />

        {/* Glow bloom under the bar */}
        <div
          className="absolute inset-0 blur-[4px] bg-gradient-to-r from-indigo-500/60 via-violet-500/60 to-emerald-500/60"
          aria-hidden="true"
        />

        {/* Trailing orb cluster */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2" aria-hidden="true">
          {/* Outer halo ring */}
          <div className="animate-cta-ring absolute inset-0 w-3 h-3 rounded-full border border-violet-400/60" />
          {/* Core orb */}
          <div className="animate-scroll-tip relative w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_8px_2px_rgba(167,139,250,0.7)]" />
          {/* Sparkle particles */}
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className={`animate-sparkle absolute ${s.size} ${s.color} ${s.offset} rounded-full blur-[0.5px]`}
              style={{ animationDuration: s.dur, animationDelay: s.delay }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
