"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export function FloatingContactButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const nearBottom = scrollY + winHeight > docHeight - 480
      setVisible(scrollY > 480 && !nearBottom)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="relative inline-block">
        {/* Pulsing glow ring */}
        <span className="animate-cta-ring absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 pointer-events-none" aria-hidden="true" />
        <a
          href="#contact"
          className="relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          {/* Shimmer sweep */}
          <span className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" aria-hidden="true" />
          {/* Live availability dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
          </span>
          <MessageCircle className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Contact Seller</span>
        </a>
      </div>
    </div>
  )
}
