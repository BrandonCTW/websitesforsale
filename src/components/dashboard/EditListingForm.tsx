"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/dashboard/ImageUploader"
import { Listing } from "@/db/schema"

const CATEGORIES = [
  { value: "content-site", label: "Content Site" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "eCommerce" },
  { value: "tool-or-app", label: "Tool / App" },
  { value: "newsletter", label: "Newsletter" },
  { value: "community", label: "Community" },
  { value: "service-business", label: "Service Business" },
  { value: "other", label: "Other" },
]

export function EditListingForm({
  listing,
  initialImageUrls,
}: {
  listing: Listing
  initialImageUrls: string[]
}) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls)

  const [form, setForm] = useState({
    title: listing.title,
    url: listing.url,
    category: listing.category,
    askingPrice: String(listing.askingPrice),
    monthlyRevenue: listing.monthlyRevenue != null ? String(listing.monthlyRevenue) : "",
    monthlyProfit: listing.monthlyProfit != null ? String(listing.monthlyProfit) : "",
    monthlyTraffic: listing.monthlyTraffic != null ? String(listing.monthlyTraffic) : "",
    ageMonths: String(listing.ageMonths),
    description: listing.description,
    reasonForSelling: listing.reasonForSelling,
    includedAssets: listing.includedAssets ?? "",
    techStack: (listing.techStack ?? []).join(", "),
    monetization: (listing.monetization ?? []).join(", "),
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save() {
    setLoading(true)
    setError("")
    setSuccess(false)

    const res = await fetch(`/api/listings/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        url: form.url,
        category: form.category,
        askingPrice: parseInt(form.askingPrice),
        monthlyRevenue: form.monthlyRevenue ? parseInt(form.monthlyRevenue) : null,
        monthlyProfit: form.monthlyProfit ? parseInt(form.monthlyProfit) : null,
        monthlyTraffic: form.monthlyTraffic ? parseInt(form.monthlyTraffic) : null,
        ageMonths: parseInt(form.ageMonths),
        description: form.description,
        reasonForSelling: form.reasonForSelling,
        includedAssets: form.includedAssets || null,
        techStack: form.techStack ? form.techStack.split(",").map((s) => s.trim()).filter(Boolean) : [],
        monetization: form.monetization ? form.monetization.split(",").map((s) => s.trim()).filter(Boolean) : [],
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Failed to save.")
      setLoading(false)
      return
    }

    // Save images
    await fetch(`/api/listings/${listing.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: imageUrls }),
    })

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Basics */}
      <Section title="Basics">
        <Field label="Title" required>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Current URL" required>
          <Input value={form.url} onChange={(e) => set("url", e.target.value)} type="url" />
        </Field>
        <Field label="Category" required>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Asking price (USD)" required>
          <Input value={form.askingPrice} onChange={(e) => set("askingPrice", e.target.value)} type="number" min="1" />
        </Field>
      </Section>

      {/* Metrics */}
      <Section title="Metrics">
        <Field label="Monthly revenue (USD)">
          <Input value={form.monthlyRevenue} onChange={(e) => set("monthlyRevenue", e.target.value)} type="number" min="0" />
        </Field>
        <Field label="Monthly profit (USD)">
          <Input value={form.monthlyProfit} onChange={(e) => set("monthlyProfit", e.target.value)} type="number" min="0" />
        </Field>
        <Field label="Monthly pageviews">
          <Input value={form.monthlyTraffic} onChange={(e) => set("monthlyTraffic", e.target.value)} type="number" min="0" />
        </Field>
        <Field label="Age (months)" required>
          <Input value={form.ageMonths} onChange={(e) => set("ageMonths", e.target.value)} type="number" min="1" />
        </Field>
      </Section>

      {/* Details */}
      <Section title="Details">
        <Field label="Description" required>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={6} />
        </Field>
        <Field label="Reason for selling" required>
          <Textarea value={form.reasonForSelling} onChange={(e) => set("reasonForSelling", e.target.value)} rows={3} />
        </Field>
        <Field label="What's included">
          <Textarea value={form.includedAssets} onChange={(e) => set("includedAssets", e.target.value)} rows={3} />
        </Field>
        <Field label="Tech stack" hint="Comma-separated">
          <Input value={form.techStack} onChange={(e) => set("techStack", e.target.value)} />
        </Field>
        <Field label="Monetization" hint="Comma-separated">
          <Input value={form.monetization} onChange={(e) => set("monetization", e.target.value)} />
        </Field>
      </Section>

      {/* Images */}
      <Section title="Screenshots">
        <ImageUploader initialUrls={imageUrls} onChange={setImageUrls} />
      </Section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved successfully.</p>}

      <div className="flex gap-3">
        <Button onClick={save} disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/listings")}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground border-b pb-2">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, required, hint, children }: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  )
}
