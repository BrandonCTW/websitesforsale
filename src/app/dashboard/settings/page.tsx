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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account preferences and security
        </p>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-4 text-sm">
        <Link href="/dashboard/listings" className="text-muted-foreground hover:text-foreground">Listings</Link>
        <Link href="/dashboard/inquiries" className="text-muted-foreground hover:text-foreground">Inquiries</Link>
        <Link href="/dashboard/settings" className="font-medium">Settings</Link>
      </div>

      <div className="max-w-sm">
        {status === "success" ? (
          <div className="rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
              <p className="font-semibold text-white flex items-center gap-2">
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
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 px-6 py-4">
              <p className="font-semibold text-white text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Change password
              </p>
              <p className="text-indigo-100 text-sm mt-0.5">
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

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
              >
                {status === "loading" ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Update password"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
