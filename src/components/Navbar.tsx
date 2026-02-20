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
    <nav className={`sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-md shadow-black/5 dark:shadow-black/20" : ""}`}>
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
              <Link href="/dashboard/listings" className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group">
                Dashboard
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Button size="sm" variant="outline" onClick={logout} className="transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group">
                <Button size="sm" variant="ghost">Log in</Button>
              </Link>
              <Link href="/register" className="group">
                <Button size="sm" className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 border-0 text-white shadow-sm transition-shadow duration-200 hover:shadow-indigo-500/30 hover:shadow-md">
                  <span className="relative z-10">List your site</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
