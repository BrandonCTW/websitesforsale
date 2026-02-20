"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/dashboard/ImageUploader"
import { Sparkles, Loader2, Check, Rocket, TrendingUp, FileText, ImageIcon, ArrowRight, ArrowLeft } from "lucide-react"

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
          <div className="relative rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 via-white to-indigo-50/40 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-indigo-950/20 p-5 overflow-hidden">
            {/* Orb */}
            <div className="animate-orb-1 absolute -top-6 -right-6 w-28 h-28 rounded-full bg-indigo-400/15 blur-2xl pointer-events-none" />
            {/* Sparkle particles */}
            <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-400/60 blur-[0.5px] pointer-events-none" style={{ top: '15%', left: '6%', animationDuration: '3.1s', animationDelay: '0s' }} />
            <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-300/70 pointer-events-none" style={{ top: '70%', left: '5%', animationDuration: '2.5s', animationDelay: '1.2s' }} />
            <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-400/55 blur-[0.5px] pointer-events-none" style={{ top: '20%', right: '8%', animationDuration: '3.6s', animationDelay: '0.6s' }} />
            <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/70 pointer-events-none" style={{ top: '65%', right: '6%', animationDuration: '2.8s', animationDelay: '1.9s' }} />
            {/* Shimmer sweep */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-400/[0.06] to-transparent animate-shimmer" />
            </div>
            <div className="relative flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">AI Listing Generator</span>
            </div>
            <p className="relative text-sm text-muted-foreground">
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
            <div className="relative inline-block group">
              <span className="animate-cta-ring absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 pointer-events-none" aria-hidden="true" />
              <Button
                onClick={generateWithAI}
                disabled={aiLoading}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white gap-2 border-0 shadow-sm"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full pointer-events-none" aria-hidden="true" />
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                    <span className="relative z-10">Generating listing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Generate with AI</span>
                    <ArrowRight className="h-4 w-4 relative z-10" />
                  </>
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => { setAiError(""); setStep(1) }}
              disabled={aiLoading}
              className="text-muted-foreground text-sm hover:text-foreground"
            >
              Fill in manually instead
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Metrics */}
      {step === 1 && (
        <div className="animate-fade-in-up space-y-4">
          <div className="relative rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            {/* Emerald left accent bar */}
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-xl" />
            {/* Section header */}
            <div className="relative pl-5 pr-4 pt-4 pb-3 border-b border-border/40 flex items-center gap-2.5 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400/[0.05] to-transparent animate-shimmer" />
              </div>
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="relative">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider leading-none mb-0.5">Step 2</p>
                <p className="text-sm font-semibold leading-none">Traffic &amp; Revenue</p>
              </div>
              <p className="relative ml-auto text-xs text-muted-foreground hidden sm:block">All optional — but help attract serious buyers</p>
            </div>
            <div className="p-5 space-y-4">
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
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep(0)} className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!form.url) { setError("Website URL is required."); return }
                if (!form.askingPrice) { setError("Asking price is required."); return }
                if (!form.ageMonths) { setError("Site age is required."); return }
                setError("")
                setStep(2)
              }}
              className="gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white border-0 shadow-sm"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="animate-fade-in-up space-y-4">
          <div className="relative rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            {/* Indigo left accent bar */}
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-l-xl" />
            {/* Section header */}
            <div className="relative pl-5 pr-4 pt-4 pb-3 border-b border-border/40 flex items-center gap-2.5 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-400/[0.05] to-transparent animate-shimmer" />
              </div>
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="relative">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider leading-none mb-0.5">Step 3</p>
                <p className="text-sm font-semibold leading-none">Listing Details</p>
              </div>
              <p className="relative ml-auto text-xs text-muted-foreground hidden sm:block">Title, description &amp; more</p>
            </div>
            <div className="p-5 space-y-4">
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
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep(1)} className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!form.title || !form.category || !form.description || !form.reasonForSelling) {
                  setError("Title, category, description and reason for selling are required.")
                  return
                }
                setError("")
                setStep(3)
              }}
              className="gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white border-0 shadow-sm"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Images */}
      {step === 3 && (
        <div className="animate-fade-in-up space-y-4">
          <div className="relative rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            {/* Sky left accent bar */}
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-sky-400 to-sky-600 rounded-l-xl" />
            {/* Section header */}
            <div className="relative pl-5 pr-4 pt-4 pb-3 border-b border-border/40 flex items-center gap-2.5 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-sky-400/[0.05] to-transparent animate-shimmer" />
              </div>
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-sky-400 flex items-center justify-center shrink-0 shadow-sm">
                <ImageIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="relative">
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider leading-none mb-0.5">Step 4</p>
                <p className="text-sm font-semibold leading-none">Screenshots</p>
              </div>
              <p className="relative ml-auto text-xs text-muted-foreground hidden sm:block">First image becomes your thumbnail</p>
            </div>
            <div className="p-5">
              <ImageUploader initialUrls={imageUrls} onChange={setImageUrls} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep(2)} className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => { setError(""); setStep(4) }}
              className="gap-1.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white border-0 shadow-sm"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div className="animate-fade-in-up space-y-6">
          <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
            {/* Gradient card header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-emerald-500" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2)_0%,_transparent_60%)]" />
              {/* Sparkle particles */}
              <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/60 blur-[0.5px] pointer-events-none" style={{ top: '20%', left: '12%', animationDuration: '3.2s', animationDelay: '0s' }} />
              <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/60 pointer-events-none" style={{ top: '70%', left: '8%', animationDuration: '2.5s', animationDelay: '1.1s' }} />
              <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/60 blur-[0.5px] pointer-events-none" style={{ top: '25%', right: '12%', animationDuration: '3.7s', animationDelay: '0.5s' }} />
              <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/70 pointer-events-none" style={{ top: '65%', right: '8%', animationDuration: '2.9s', animationDelay: '1.8s' }} />
              {/* Shimmer sweep */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shimmer" />
              </div>
              <div className="relative flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
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
            <Button variant="outline" size="sm" onClick={() => setStep(3)} className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <div className="relative group">
              <span className="animate-cta-ring absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 pointer-events-none" aria-hidden="true" />
              <Button
                onClick={publish}
                disabled={loading}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white border-0 gap-2 shadow-sm hover:shadow-indigo-500/20 hover:shadow-md transition-all"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full pointer-events-none" aria-hidden="true" />
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                    <span className="relative z-10">Publishing...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Publish listing</span>
                  </>
                )}
              </Button>
            </div>
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
