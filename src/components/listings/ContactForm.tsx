"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShieldCheck, Send, MessageCircle, CheckCircle } from "lucide-react"

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
          <p className="font-semibold text-white flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Message sent!
          </p>
        </div>
        <div className="bg-card px-6 py-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">✓</div>
          <div>
            <p className="text-sm font-medium">Your message is on its way!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              The seller will reply directly to <span className="font-medium">{buyerEmail}</span>. Keep an eye on your inbox.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-lg rounded-2xl overflow-hidden border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 px-6 py-4">
        <p className="font-semibold text-white text-base flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Send a message to the seller
        </p>
        <p className="text-indigo-100 text-sm mt-0.5">
          No broker. Reply goes straight to your inbox.
        </p>
      </div>

      {/* Form body */}
      <form onSubmit={submit} className="bg-card px-6 py-5 space-y-4">
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
          <Label>Reply address</Label>
          <div className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 bg-muted/50">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-muted-foreground flex-1 truncate">{buyerEmail}</span>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">private</span>
          </div>
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

        <div className="flex items-center justify-between gap-4 pt-1">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
          >
            {status === "loading" ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send Message
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            Your email is never shared publicly.
          </p>
        </div>
      </form>
    </div>
  )
}
