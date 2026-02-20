"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/dashboard/ImageUploader"
import { Sparkles, Loader2, Check, Rocket } from "lucide-react"

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

const STEPS = ["AI Generate", "Metrics", "Details", "Images", "Publish"]

export function NewListingForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")
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

  async function generateWithAI() {
    if (!form.url || !form.askingPrice) {
      setAiError("Please enter your website URL and asking price.")
      return
    }
    setAiError("")
    setAiLoading(true)

    try {
      const res = await fetch("/api/ai/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.url, askingPrice: parseInt(form.askingPrice) }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAiError(data.error ?? "AI generation failed. You can fill in the form manually instead.")
        return
      }

      setForm((f) => ({
        ...f,
        title: data.title ?? f.title,
        category: data.category ?? f.category,
        description: data.description ?? f.description,
        techStack: Array.isArray(data.techStack) ? data.techStack.join(", ") : f.techStack,
        monetization: Array.isArray(data.monetization) ? data.monetization.join(", ") : f.monetization,
        reasonForSelling: data.reasonForSelling ?? f.reasonForSelling,
        includedAssets: data.includedAssets ?? f.includedAssets,
      }))
      setError("")
      setStep(1)
    } catch {
      setAiError("Something went wrong. You can fill in the form manually instead.")
    } finally {
      setAiLoading(false)
    }
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
      <div className="space-y-3">
        {/* Progress bar */}
        <div className="relative h-1 bg-border/50 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
        {/* Step circles */}
        <div className="flex items-start justify-between">
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <div key={s} className="flex flex-col items-center gap-1.5 min-w-0">
                <div className="relative">
                  {active && (
                    <span className="absolute inset-0 rounded-full border-2 border-indigo-400/50 animate-ping" />
                  )}
                  <div className={`relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    done
                      ? "bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-sm shadow-indigo-200/60 dark:shadow-indigo-900/60"
                      : active
                        ? "border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-950 shadow-sm shadow-indigo-200/50"
                        : "border border-border bg-background text-muted-foreground"
                  }`}>
                    {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight transition-colors ${
                  done
                    ? "text-indigo-600 dark:text-indigo-400"
                    : active
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                }`}>{s}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 0: AI Generate */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-transparent p-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">AI Listing Generator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your site URL and asking price — AI will write your title, description, and details in seconds.
            </p>
          </div>

          <Field label="Website URL" required>
            <Input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://mysite.com"
              type="url"
              disabled={aiLoading}
            />
          </Field>

          <Field label="Asking price (USD)" required>
            <Input
              value={form.askingPrice}
              onChange={(e) => set("askingPrice", e.target.value)}
              placeholder="5000"
              type="number"
              min="1"
              disabled={aiLoading}
            />
          </Field>

          {aiError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive space-y-1">
              <p>{aiError}</p>
              <button
                className="underline text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setAiError("")
                  setStep(1)
                }}
              >
                Fill in manually instead →
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={generateWithAI}
              disabled={aiLoading}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white gap-2"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating listing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate with AI →
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => { setAiError(""); setStep(1) }}
              disabled={aiLoading}
              className="text-muted-foreground text-sm"
            >
              Fill in manually instead
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Metrics */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">All metrics are optional but help attract serious buyers.</p>

          {/* If coming from manual path, still need basics */}
          {!form.url && (
            <>
              <Field label="Website URL" required>
                <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://mysite.com" type="url" />
              </Field>
              <Field label="Asking price (USD)" required>
                <Input value={form.askingPrice} onChange={(e) => set("askingPrice", e.target.value)} placeholder="5000" type="number" min="1" />
              </Field>
            </>
          )}
          {form.url && !form.askingPrice && (
            <Field label="Asking price (USD)" required>
              <Input value={form.askingPrice} onChange={(e) => set("askingPrice", e.target.value)} placeholder="5000" type="number" min="1" />
            </Field>
          )}

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
              if (!form.url) { setError("Website URL is required."); return }
              if (!form.askingPrice) { setError("Asking price is required."); return }
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
          <Field label="Listing title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Profitable niche recipe blog for Sale" />
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
              if (!form.title || !form.category || !form.description || !form.reasonForSelling) {
                setError("Title, category, description and reason for selling are required.")
                return
              }
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
          <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
            {/* Gradient card header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-emerald-500" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2)_0%,_transparent_60%)]" />
              <div className="relative flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <Rocket className="w-3.5 h-3.5 text-white" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Review your listing</p>
                  <p className="text-[11px] text-slate-400">Looks good? Hit publish to go live.</p>
                </div>
              </div>
            </div>
            {/* Data rows */}
            <div className="divide-y divide-border/50 text-sm bg-card">
              <Row label="Title" value={form.title} />
              <Row label="URL" value={form.url} />
              <Row label="Category" value={form.category} />
              <Row label="Asking price" value={`$${parseInt(form.askingPrice).toLocaleString()}`} highlight />
              {form.monthlyRevenue && <Row label="Monthly revenue" value={`$${parseInt(form.monthlyRevenue).toLocaleString()}`} />}
              {form.monthlyProfit && <Row label="Monthly profit" value={`$${parseInt(form.monthlyProfit).toLocaleString()}`} />}
              {form.monthlyTraffic && <Row label="Monthly traffic" value={`${parseInt(form.monthlyTraffic).toLocaleString()} views`} />}
              <Row label="Age" value={`${form.ageMonths} months`} />
              {form.techStack && <Row label="Tech stack" value={form.techStack} />}
              {form.monetization && <Row label="Monetization" value={form.monetization} />}
              {imageUrls.length > 0 && <Row label="Images" value={`${imageUrls.length} attached`} />}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>← Back</Button>
            <Button
              onClick={publish}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white border-0 gap-2 shadow-sm hover:shadow-indigo-500/20 hover:shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Publish listing
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {error && step < 4 && <p className="text-sm text-destructive">{error}</p>}
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

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5">
      <span className="text-muted-foreground text-xs w-28 shrink-0">{label}</span>
      <span className={`font-medium text-sm min-w-0 break-words ${highlight ? "bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent font-bold" : ""}`}>{value}</span>
    </div>
  )
}
