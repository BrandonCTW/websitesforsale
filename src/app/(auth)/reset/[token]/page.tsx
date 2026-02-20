"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LockKeyhole } from "lucide-react"

const SPARKLES = [
  { top: "15%", left: "10%", dur: "3.3s", del: "0s" },
  { top: "70%", left: "22%", dur: "2.8s", del: "0.6s" },
  { top: "40%", left: "58%", dur: "3.6s", del: "0.4s" },
  { top: "55%", left: "82%", dur: "2.6s", del: "1.1s" },
  { top: "80%", left: "68%", dur: "4.3s", del: "0.7s" },
  { top: "25%", left: "85%", dur: "3.1s", del: "1.5s" },
  { top: "45%", left: "38%", dur: "2.9s", del: "1.0s" },
  { top: "8%",  left: "72%", dur: "3.8s", del: "0.2s" },
]

export default function ResetPage() {
  const router = useRouter()
  const { token } = useParams<{ token: string }>()
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPw: pw }),
    })

    if (res.ok) {
      router.push("/login?reset=1")
    } else {
      const data = await res.json()
      setError(data.error ?? "Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-orb-2" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-orb-1" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none animate-orb-2 [animation-delay:-5s]" />

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
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <LockKeyhole className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h1 className="font-bold text-white">Set a new password</h1>
                <p className="text-slate-400 text-xs mt-0.5">Choose something you haven&apos;t used before</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 bg-card">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="pw">New password</Label>
                <Input
                  id="pw"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                  placeholder="min 8 characters"
                />
              </div>
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-sm"
                disabled={loading}
              >
                {loading ? "Saving..." : "Set new password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
