"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-20 right-6 z-40 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      {/* Pulsing glow ring */}
      <span className="animate-cta-ring absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 pointer-events-none" aria-hidden="true" />
      {/* Floating sparkle particles */}
      <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/80 blur-[0.5px] pointer-events-none" style={{ top: '-6px', left: '-2px', animationDuration: '2.8s', animationDelay: '0s' }} />
      <div className="animate-sparkle absolute w-px h-px rounded-full bg-emerald-300/75 pointer-events-none" style={{ bottom: '-5px', right: '-3px', animationDuration: '3.3s', animationDelay: '1.4s' }} />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className="relative overflow-hidden flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:from-indigo-600 hover:to-emerald-600 hover:shadow-xl hover:-translate-y-0.5"
      >
        {/* Shimmer sweep */}
        <span className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" aria-hidden="true" />
        <ChevronUp className="h-4 w-4 relative z-10" />
      </button>
    </div>
  )
}
