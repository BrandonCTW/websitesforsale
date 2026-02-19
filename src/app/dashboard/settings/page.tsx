"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      </div>

      <div className="flex gap-4 mb-6 border-b pb-4 text-sm">
        <Link href="/dashboard/listings" className="text-muted-foreground hover:text-foreground">Listings</Link>
        <Link href="/dashboard/inquiries" className="text-muted-foreground hover:text-foreground">Inquiries</Link>
        <Link href="/dashboard/settings" className="font-medium">Settings</Link>
      </div>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-base">Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="currentPw">Current password</Label>
              <Input
                id="currentPw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPw">New password</Label>
              <Input
                id="newPw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {status === "success" && (
              <p className="text-sm text-green-600">Password updated successfully.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Saving..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
