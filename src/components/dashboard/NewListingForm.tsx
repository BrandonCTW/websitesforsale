"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/dashboard/ImageUploader"

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

const STEPS = ["Basics", "Metrics", "Details", "Images", "Publish"]

export function NewListingForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const [form, setForm] = useState({
    title: "",
    url: "",
    category: "",
    askingPrice: "",
    monthlyRevenue: "",
    monthlyProfit: "",
    monthlyTraffic: "",
    ageMonths: "",
    description: "",
    reasonForSelling: "",
    includedAssets: "",
    techStack: "",
    monetization: "",
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function publish() {
    setLoading(true)
    setError("")

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        askingPrice: parseInt(form.askingPrice),
        monthlyRevenue: form.monthlyRevenue ? parseInt(form.monthlyRevenue) : null,
        monthlyProfit: form.monthlyProfit ? parseInt(form.monthlyProfit) : null,
        monthlyTraffic: form.monthlyTraffic ? parseInt(form.monthlyTraffic) : null,
        ageMonths: parseInt(form.ageMonths),
        techStack: form.techStack ? form.techStack.split(",").map((s) => s.trim()).filter(Boolean) : [],
        monetization: form.monetization ? form.monetization.split(",").map((s) => s.trim()).filter(Boolean) : [],
      }),
    })

    if (res.ok) {
      const listing = await res.json()
      // Save images if any were uploaded
      if (imageUrls.length > 0) {
        await fetch(`/api/listings/${listing.id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: imageUrls }),
        })
      }
      router.push(`/listings/${listing.slug}`)
    } else {
      const data = await res.json()
      setError(data.error ?? "Failed to create listing.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
              ${i < step ? "bg-primary text-primary-foreground" : i === step ? "border-2 border-primary text-primary" : "border text-muted-foreground"}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-sm ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
      </div>

      {/* Step 0: Basics */}
      {step === 0 && (
        <div className="space-y-4">
          <Field label="Listing title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Profitable niche recipe blog" />
          </Field>
          <Field label="Current URL" required>
            <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://mysite.com" type="url" />
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Asking price (USD)" required>
            <Input value={form.askingPrice} onChange={(e) => set("askingPrice", e.target.value)} placeholder="5000" type="number" min="1" />
          </Field>
          <Button
            onClick={() => {
              if (!form.title || !form.url || !form.category || !form.askingPrice) {
                setError("Please fill in all required fields.")
                return
              }
              setError("")
              setStep(1)
            }}
          >
            Next →
          </Button>
        </div>
      )}

      {/* Step 1: Metrics */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">All metrics are optional but help attract serious buyers.</p>
          <Field label="Monthly revenue (USD, avg last 3 months)">
            <Input value={form.monthlyRevenue} onChange={(e) => set("monthlyRevenue", e.target.value)} placeholder="500" type="number" min="0" />
          </Field>
          <Field label="Monthly profit (USD, after expenses)">
            <Input value={form.monthlyProfit} onChange={(e) => set("monthlyProfit", e.target.value)} placeholder="300" type="number" min="0" />
          </Field>
          <Field label="Monthly pageviews">
            <Input value={form.monthlyTraffic} onChange={(e) => set("monthlyTraffic", e.target.value)} placeholder="10000" type="number" min="0" />
          </Field>
          <Field label="Site age (months)" required>
            <Input value={form.ageMonths} onChange={(e) => set("ageMonths", e.target.value)} placeholder="24" type="number" min="1" />
          </Field>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(0)}>← Back</Button>
            <Button onClick={() => {
              if (!form.ageMonths) { setError("Site age is required."); return }
              setError("")
              setStep(2)
            }}>Next →</Button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-4">
          <Field label="Description" required hint="Describe what the site does, its history, and why it's a good buy.">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={6} placeholder="This is a content site about..." />
          </Field>
          <Field label="Reason for selling" required>
            <Textarea value={form.reasonForSelling} onChange={(e) => set("reasonForSelling", e.target.value)} rows={3} placeholder="I'm selling because..." />
          </Field>
          <Field label="What's included" hint="Domain, codebase, social accounts, email list, etc.">
            <Textarea value={form.includedAssets} onChange={(e) => set("includedAssets", e.target.value)} rows={3} placeholder="Includes domain, WordPress install, 2k email subscribers..." />
          </Field>
          <Field label="Tech stack" hint="Comma-separated, e.g. WordPress, PHP, MySQL">
            <Input value={form.techStack} onChange={(e) => set("techStack", e.target.value)} placeholder="WordPress, PHP, MySQL" />
          </Field>
          <Field label="Monetization" hint="Comma-separated, e.g. AdSense, Affiliates, SaaS">
            <Input value={form.monetization} onChange={(e) => set("monetization", e.target.value)} placeholder="AdSense, Amazon Affiliates" />
          </Field>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
            <Button onClick={() => {
              if (!form.description || !form.reasonForSelling) { setError("Description and reason for selling are required."); return }
              setError("")
              setStep(3)
            }}>Next →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Images */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add up to 6 screenshots. The first image is used as the listing thumbnail.
          </p>
          <ImageUploader initialUrls={imageUrls} onChange={setImageUrls} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
            <Button onClick={() => { setError(""); setStep(4) }}>Next →</Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="rounded-lg border p-5 space-y-3 text-sm">
            <h3 className="font-semibold text-base">Review your listing</h3>
            <Row label="Title" value={form.title} />
            <Row label="URL" value={form.url} />
            <Row label="Category" value={form.category} />
            <Row label="Asking price" value={`$${parseInt(form.askingPrice).toLocaleString()}`} />
            {form.monthlyRevenue && <Row label="Monthly revenue" value={`$${parseInt(form.monthlyRevenue).toLocaleString()}`} />}
            {form.monthlyProfit && <Row label="Monthly profit" value={`$${parseInt(form.monthlyProfit).toLocaleString()}`} />}
            {form.monthlyTraffic && <Row label="Monthly traffic" value={`${parseInt(form.monthlyTraffic).toLocaleString()} views`} />}
            <Row label="Age" value={`${form.ageMonths} months`} />
            {form.techStack && <Row label="Tech stack" value={form.techStack} />}
            {form.monetization && <Row label="Monetization" value={form.monetization} />}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {imageUrls.length > 0 && (
            <p className="text-sm text-muted-foreground">{imageUrls.length} image{imageUrls.length !== 1 ? "s" : ""} attached</p>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>← Back</Button>
            <Button onClick={publish} disabled={loading}>
              {loading ? "Publishing..." : "Publish listing"}
            </Button>
          </div>
        </div>
      )}

      {error && step < 3 && <p className="text-sm text-destructive">{error}</p>}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
