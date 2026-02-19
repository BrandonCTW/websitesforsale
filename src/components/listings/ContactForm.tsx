"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm({
  listingId,
  listingTitle,
  buyerEmail,
}: {
  listingId: number
  listingTitle: string
  buyerEmail: string
}) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, buyerName: name, buyerEmail, message, honeypot }),
    })

    if (res.ok) {
      setStatus("success")
    } else {
      const data = await res.json()
      setErrorMsg(data.error ?? "Something went wrong.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="relative max-w-lg rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
          <p className="font-semibold text-white">Message sent!</p>
        </div>
        <div className="bg-card px-6 py-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">✓</div>
          <p className="text-sm text-muted-foreground">
            The seller will reply directly to your email. Keep an eye on your inbox.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-1">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Jane Smith"
        />
      </div>

      <div className="space-y-1">
        <Label>Replies will go to</Label>
        <p className="text-sm border rounded-md px-3 py-2 bg-muted text-muted-foreground">{buyerEmail}</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder={`Hi, I'm interested in ${listingTitle}. Can you tell me more about...`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      <p className="text-xs text-muted-foreground">
        The seller will reply to your email directly. Your email is not shared publicly.
      </p>
    </form>
  )
}
