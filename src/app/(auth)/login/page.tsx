"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, MessageCircle, BarChart2, LogIn } from "lucide-react"

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/dashboard/listings"
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pw }),
    })

    if (res.ok) {
      router.push(next)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? "Login failed.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        {/* Animated floating orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none animate-orb-1" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-orb-2" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none animate-orb-1 [animation-delay:-3s]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none animate-orb-2 [animation-delay:-6s]" />
        {/* Sparkle particles */}
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/75 blur-[0.5px] pointer-events-none" style={{ top: '12%', left: '8%', animationDuration: '3.3s', animationDelay: '0s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/65 pointer-events-none" style={{ top: '62%', left: '5%', animationDuration: '2.6s', animationDelay: '1.3s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/70 blur-[0.5px] pointer-events-none" style={{ top: '18%', right: '10%', animationDuration: '3.9s', animationDelay: '0.6s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/80 pointer-events-none" style={{ top: '55%', right: '8%', animationDuration: '2.8s', animationDelay: '1.9s' }} />
        <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/20 blur-sm pointer-events-none" style={{ top: '78%', left: '72%', animationDuration: '4.2s', animationDelay: '0.9s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-emerald-200/70 pointer-events-none" style={{ top: '38%', left: '55%', animationDuration: '3.1s', animationDelay: '2.4s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-300/60 blur-[0.5px] pointer-events-none" style={{ top: '88%', left: '32%', animationDuration: '3.6s', animationDelay: '1.6s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/55 pointer-events-none" style={{ top: '28%', left: '88%', animationDuration: '2.7s', animationDelay: '3.0s' }} />

        <div className="relative">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            WebsitesForSale
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-3">
              Buy and sell websites{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                directly.
              </span>
            </h2>
            <p className="text-slate-400 text-base">
              No broker fees. No commissions. Connect with sellers and buyers directly.
            </p>
          </div>

          <div className="space-y-3">
            <div className="group flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 group-hover:scale-110 transition-all duration-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-slate-300 text-sm">Zero broker fees or commissions</span>
            </div>
            <div className="group flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/25 group-hover:scale-110 transition-all duration-200">
                <MessageCircle className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="text-slate-300 text-sm">Direct contact with sellers</span>
            </div>
            <div className="group flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 group-hover:scale-110 transition-all duration-200">
                <BarChart2 className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-slate-300 text-sm">Verified listings with real metrics</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} WebsitesForSale. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent lg:hidden">
              WebsitesForSale
            </Link>
            <h1 className="text-2xl font-bold mt-6 lg:mt-0">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Log in to your account to continue</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pw">Password</Label>
                <Link href="/recover" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <div className="relative">
              <span className="animate-cta-ring absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 pointer-events-none" aria-hidden="true" />
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-indigo-500/30 hover:shadow-md"
              >
                <span className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" aria-hidden="true" />
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
                    <span className="relative z-10">Logging in…</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Log in</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            No account?{" "}
            <Link href="/register" className="font-medium text-foreground hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
