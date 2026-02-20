"use client"

import { useEffect, useState } from "react"

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
        className="relative h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500"
        style={{ width: `${progress}%`, transition: "width 80ms linear" }}
      >
        {/* Glowing trailing orb */}
        <div
          className="animate-scroll-tip absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-400"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
