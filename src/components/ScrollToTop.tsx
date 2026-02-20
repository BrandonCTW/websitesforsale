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
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-20 right-6 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:from-indigo-600 hover:to-emerald-600 hover:shadow-xl hover:-translate-y-0.5 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ChevronUp className="h-4 w-4" />
    </button>
  )
}
