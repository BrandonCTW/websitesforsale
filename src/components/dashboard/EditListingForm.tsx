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
import { CheckCircle2, AlertCircle, Save } from "lucide-react"

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

// Per-section accent colors
const SECTION_STYLES: Record<string, {
  bar: string
  label: string
  shimmer: string
  bg: string
}> = {
  basics: {
    bar: "bg-gradient-to-b from-indigo-400 to-violet-500",
    label: "text-indigo-600 dark:text-indigo-400",
    shimmer: "via-indigo-200/30",
    bg: "bg-indigo-50/40 dark:bg-indigo-950/20",
  },
  metrics: {
    bar: "bg-gradient-to-b from-emerald-400 to-teal-500",
    label: "text-emerald-600 dark:text-emerald-400",
    shimmer: "via-emerald-200/30",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
  },
  details: {
    bar: "bg-gradient-to-b from-amber-400 to-orange-500",
    label: "text-amber-600 dark:text-amber-400",
    shimmer: "via-amber-200/30",
    bg: "bg-amber-50/40 dark:bg-amber-950/20",
  },
  screenshots: {
    bar: "bg-gradient-to-b from-sky-400 to-cyan-500",
    label: "text-sky-600 dark:text-sky-400",
    shimmer: "via-sky-200/30",
    bg: "bg-sky-50/40 dark:bg-sky-950/20",
  },
}

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
    techStack: Array.isArray(listing.techStack) ? listing.techStack.join(", ") : (listing.techStack ?? ""),
    monetization: Array.isArray(listing.monetization) ? listing.monetization.join(", ") : (listing.monetization ?? ""),
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
    <div className="space-y-4">
      <Section title="Basics" sectionKey="basics" index={0}>
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

      <Section title="Metrics" sectionKey="metrics" index={1}>
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

      <Section title="Details" sectionKey="details" index={2}>
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

      <Section title="Screenshots" sectionKey="screenshots" index={3}>
        <ImageUploader initialUrls={imageUrls} onChange={setImageUrls} />
      </Section>

      {/* Feedback banners */}
      {error && (
        <div className="animate-fade-in-up flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="animate-fade-in-up flex items-center gap-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Changes saved successfully.</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Gradient save button with shimmer */}
        <button
          onClick={save}
          disabled={loading}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Shine sweep on hover */}
          <div className="card-shine absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          <Save className="w-4 h-4 relative z-10" />
          <span className="relative z-10">{loading ? "Saving…" : "Save changes"}</span>
        </button>
        <Button variant="outline" onClick={() => router.push("/dashboard/listings")}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function Section({
  title,
  sectionKey,
  index,
  children,
}: {
  title: string
  sectionKey: string
  index: number
  children: React.ReactNode
}) {
  const styles = SECTION_STYLES[sectionKey] ?? SECTION_STYLES.basics
  return (
    <div
      className="animate-fade-in-up group relative rounded-xl border border-border/60 overflow-hidden"
      style={{ animationDelay: `${index * 0.09}s` }}
    >
      {/* Colored left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${styles.bar}`} />

      {/* Section header */}
      <div className={`relative flex items-center gap-2 px-5 pt-4 pb-3 ${styles.bg} border-b border-border/50 overflow-hidden`}>
        {/* Shimmer sweep */}
        <div className={`animate-shimmer absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent ${styles.shimmer} to-transparent pointer-events-none`} />
        <h2 className={`relative font-semibold text-xs uppercase tracking-widest ${styles.label}`}>{title}</h2>
      </div>

      {/* Fields */}
      <div className="space-y-4 px-5 py-4 pl-6">
        {children}
      </div>
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
