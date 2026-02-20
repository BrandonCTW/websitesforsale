"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, CheckCircle, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setError("")

    const res = await fetch("/api/auth/change-pw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPw, newPw }),
    })

    if (res.ok) {
      setStatus("success")
      setCurrentPw("")
      setNewPw("")
    } else {
      const data = await res.json()
      setError(data.error ?? "Failed to update password.")
      setStatus("error")
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Gradient hero header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-8 mb-6">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        {/* Animated orbs */}
        <div className="animate-orb-1 absolute -top-8 -right-8 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="animate-orb-2 absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        {/* Sparkle particles */}
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/70 blur-[0.5px] pointer-events-none" style={{ top: '18%', left: '7%', animationDuration: '3.3s', animationDelay: '0.2s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/60 pointer-events-none" style={{ top: '70%', left: '5%', animationDuration: '2.7s', animationDelay: '1.4s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/65 blur-[0.5px] pointer-events-none" style={{ top: '15%', right: '9%', animationDuration: '3.6s', animationDelay: '0.7s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-violet-200/75 pointer-events-none" style={{ top: '65%', right: '7%', animationDuration: '3.0s', animationDelay: '1.9s' }} />
        <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/20 blur-sm pointer-events-none" style={{ top: '40%', left: '48%', animationDuration: '4.2s', animationDelay: '0.8s' }} />

        <div className="relative mb-5">
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your account preferences and security</p>
        </div>

        {/* Nav tabs */}
        <div className="relative flex items-center gap-1 border-t border-white/10 pt-4">
          <Link href="/dashboard/listings" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Listings</Link>
          <Link href="/dashboard/inquiries" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Inquiries</Link>
          <Link href="/dashboard/settings" className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/15 text-white text-sm font-semibold transition-colors">Settings</Link>
        </div>
      </div>

      <div className="max-w-sm">
        {status === "success" ? (
          <div className="rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 overflow-hidden">
              {/* Orb blob */}
              <div className="animate-orb-1 absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              {/* Shimmer sweep */}
              <div className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {/* Sparkle particles */}
              <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-200/70 blur-[0.5px] pointer-events-none" style={{ top: '18%', right: '12%', animationDuration: '3.2s', animationDelay: '0s' }} />
              <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/65 pointer-events-none" style={{ top: '70%', left: '6%', animationDuration: '2.6s', animationDelay: '1.3s' }} />
              <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-teal-200/65 blur-[0.5px] pointer-events-none" style={{ top: '22%', left: '40%', animationDuration: '3.7s', animationDelay: '0.7s' }} />
              <p className="font-semibold text-white flex items-center gap-2 relative">
                <CheckCircle className="h-4 w-4" />
                Password updated
              </p>
            </div>
            <div className="bg-card px-6 py-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                ✓
              </div>
              <div>
                <p className="text-sm font-medium">Your password has been changed.</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use your new password next time you log in.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
            {/* Gradient header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 px-6 py-4 overflow-hidden">
              {/* Ambient orb blob */}
              <div className="animate-orb-1 absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              {/* Shimmer sweep */}
              <div className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {/* Sparkle particles */}
              <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-white/70 blur-[0.5px] pointer-events-none" style={{ top: '20%', left: '6%', animationDuration: '3.2s', animationDelay: '0s' }} />
              <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/80 pointer-events-none" style={{ top: '68%', left: '4%', animationDuration: '2.5s', animationDelay: '1.3s' }} />
              <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-200/70 blur-[0.5px] pointer-events-none" style={{ top: '22%', right: '10%', animationDuration: '3.8s', animationDelay: '0.6s' }} />
              <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/65 pointer-events-none" style={{ top: '65%', right: '8%', animationDuration: '2.7s', animationDelay: '1.9s' }} />
              <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/20 blur-sm pointer-events-none" style={{ top: '42%', left: '54%', animationDuration: '4.1s', animationDelay: '0.9s' }} />
              <p className="font-semibold text-white text-base flex items-center gap-2 relative">
                <Lock className="h-4 w-4" />
                Change password
              </p>
              <p className="text-indigo-100 text-sm mt-0.5 relative">
                Keep your account secure with a strong password
              </p>
            </div>

            {/* Form body */}
            <form onSubmit={submit} className="bg-card px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPw">Current password</Label>
                <Input
                  id="currentPw"
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPw">New password</Label>
                <Input
                  id="newPw"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="relative inline-block">
                <span className="animate-cta-ring absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 pointer-events-none" aria-hidden="true" />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="relative overflow-hidden inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
                >
                  <span className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" aria-hidden="true" />
                  {status === "loading" ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
                      <span className="relative z-10">Saving…</span>
                    </>
                  ) : (
                    <span className="relative z-10">Update password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
