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
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500 text-white text-xs font-bold shrink-0">
            W
          </span>
          <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            WebsitesForSale
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard/listings" className="text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Button size="sm" variant="outline" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 border-0 text-white shadow-sm">List your site</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
