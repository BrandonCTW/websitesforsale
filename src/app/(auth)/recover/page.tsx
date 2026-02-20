"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, CheckCircle2 } from "lucide-react"

const SPARKLES = [
  { top: "18%", left: "12%", dur: "3.1s", del: "0s" },
  { top: "72%", left: "28%", dur: "2.7s", del: "0.8s" },
  { top: "35%", left: "55%", dur: "3.8s", del: "0.3s" },
  { top: "60%", left: "80%", dur: "2.5s", del: "1.2s" },
  { top: "85%", left: "65%", dur: "4.1s", del: "0.5s" },
  { top: "20%", left: "88%", dur: "3.4s", del: "1.7s" },
  { top: "50%", left: "40%", dur: "2.9s", del: "0.9s" },
  { top: "10%", left: "70%", dur: "3.6s", del: "0.2s" },
]

export default function RecoverPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-orb-1" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl pointer-events-none animate-orb-1 [animation-delay:-4s]" />

      <div className="w-full max-w-sm relative">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              W
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              WebsitesForSale
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden border border-border/60 shadow-sm">
          {/* Gradient header */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />
            {/* Sparkle particles */}
            {SPARKLES.map((s, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/70 animate-sparkle blur-[0.5px] pointer-events-none"
                style={{ top: s.top, left: s.left, animationDuration: s.dur, animationDelay: s.del }}
              />
            ))}
            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <KeyRound className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h1 className="font-bold text-white">Reset your password</h1>
                <p className="text-slate-400 text-xs mt-0.5">We&apos;ll email you a reset link</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 bg-card">
            {sent ? (
              <div className="flex flex-col items-center text-center py-3 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Check your inbox</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    If an account exists for that email, a reset link is on its way.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
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
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link href="/login" className="font-medium text-foreground hover:underline">
                    Back to login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
