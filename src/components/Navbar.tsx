"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface SessionUser {
  id: number
  username: string
  email: string
}

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <nav className={`sticky top-0 z-50 relative bg-background/80 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-md shadow-black/5 dark:shadow-black/20" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight group">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500 text-white text-xs font-bold shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
            W
          </span>
          <span className="animate-brand-gradient">
            WebsitesForSale
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard/listings" className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group flex items-center gap-2">
                {/* Gradient avatar chip */}
                <div className="relative flex-shrink-0">
                  <span className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/80 blur-[0.5px] pointer-events-none z-10" style={{ top: '-4px', left: '-3px', animationDuration: '3.1s', animationDelay: '0s' }} />
                  <span className="animate-sparkle absolute w-px h-px rounded-full bg-emerald-300/75 pointer-events-none z-10" style={{ bottom: '-3px', right: '-3px', animationDuration: '2.7s', animationDelay: '1.4s' }} />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-1 ring-white/20 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-indigo-400/30">
                    {user.username[0].toUpperCase()}
                  </div>
                </div>
                Dashboard
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Button size="sm" variant="outline" onClick={logout} className="transition-all duration-200 hover:border-rose-300 hover:text-rose-600 dark:hover:border-rose-700 dark:hover:text-rose-400">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group">
                <Button size="sm" variant="ghost">Log in</Button>
              </Link>
              <Link href="/register" className="group relative inline-block">
                <span className="animate-cta-ring absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 pointer-events-none" aria-hidden="true" />
                {/* Sparkle particles around the CTA */}
                <span className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/80 blur-[0.5px] pointer-events-none" style={{ top: '-4px', left: '-6px', animationDuration: '3.1s', animationDelay: '0s' }} aria-hidden="true" />
                <span className="animate-sparkle absolute w-px h-px rounded-full bg-emerald-300/75 pointer-events-none" style={{ bottom: '-3px', right: '-5px', animationDuration: '2.6s', animationDelay: '1.2s' }} aria-hidden="true" />
                <span className="animate-sparkle absolute w-px h-px rounded-full bg-white/65 pointer-events-none" style={{ top: '50%', right: '-8px', animationDuration: '3.4s', animationDelay: '0.7s' }} aria-hidden="true" />
                <Button size="sm" className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 border-0 text-white shadow-sm transition-shadow duration-200 hover:shadow-indigo-500/30 hover:shadow-md">
                  <span className="relative z-10">List your site</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px animate-nav-border" />
    </nav>
  )
}
