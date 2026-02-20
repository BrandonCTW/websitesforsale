"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LockKeyhole } from "lucide-react"

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
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
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
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-6">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />
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
