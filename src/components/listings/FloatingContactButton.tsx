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
      <a
        href="#contact"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
      >
        <MessageCircle className="h-4 w-4" />
        Contact Seller
      </a>
    </div>
  )
}
