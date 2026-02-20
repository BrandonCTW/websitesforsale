"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Code2, ShoppingCart, Wrench, Mail, Users, Briefcase, LayoutGrid, type LucideIcon } from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  "content-site": "Content Site",
  "saas": "SaaS",
  "ecommerce": "eCommerce",
  "tool-or-app": "Tool / App",
  "newsletter": "Newsletter",
  "community": "Community",
  "service-business": "Service Business",
  "other": "Other",
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "content-site": FileText,
  "saas": Code2,
  "ecommerce": ShoppingCart,
  "tool-or-app": Wrench,
  "newsletter": Mail,
  "community": Users,
  "service-business": Briefcase,
  "other": LayoutGrid,
}

const CATEGORY_CHIP_STYLES: Record<string, { active: string; inactive: string; dot: string }> = {
  "content-site": {
    active: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-700",
    inactive: "hover:bg-sky-50 text-slate-600 border-border dark:hover:bg-sky-950/30 dark:text-slate-400",
    dot: "bg-sky-500",
  },
  "saas": {
    active: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/60 dark:text-violet-300 dark:border-violet-700",
    inactive: "hover:bg-violet-50 text-slate-600 border-border dark:hover:bg-violet-950/30 dark:text-slate-400",
    dot: "bg-violet-500",
  },
  "ecommerce": {
    active: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/60 dark:text-orange-300 dark:border-orange-700",
    inactive: "hover:bg-orange-50 text-slate-600 border-border dark:hover:bg-orange-950/30 dark:text-slate-400",
    dot: "bg-orange-500",
  },
  "tool-or-app": {
    active: "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/60 dark:text-teal-300 dark:border-teal-700",
    inactive: "hover:bg-teal-50 text-slate-600 border-border dark:hover:bg-teal-950/30 dark:text-slate-400",
    dot: "bg-teal-500",
  },
  "newsletter": {
    active: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-700",
    inactive: "hover:bg-rose-50 text-slate-600 border-border dark:hover:bg-rose-950/30 dark:text-slate-400",
    dot: "bg-rose-500",
  },
  "community": {
    active: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-700",
    inactive: "hover:bg-emerald-50 text-slate-600 border-border dark:hover:bg-emerald-950/30 dark:text-slate-400",
    dot: "bg-emerald-500",
  },
  "service-business": {
    active: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700",
    inactive: "hover:bg-amber-50 text-slate-600 border-border dark:hover:bg-amber-950/30 dark:text-slate-400",
    dot: "bg-amber-500",
  },
  "other": {
    active: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600",
    inactive: "hover:bg-slate-50 text-slate-600 border-border dark:hover:bg-slate-900/50 dark:text-slate-400",
    dot: "bg-slate-400",
  },
}

export function FilterBar({ categories }: { categories: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const activeCategory = searchParams.get("category") ?? ""

  function apply(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/?${params.toString()}`)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    apply("q", q)
  }

  function toggleCategory(c: string) {
    if (activeCategory === c) {
      apply("category", "")
    } else {
      apply("category", c)
    }
  }

  function reset() {
    setQ("")
    router.push("/")
  }

  const hasFilters = searchParams.size > 0

  return (
    <div className="space-y-3">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const styles = CATEGORY_CHIP_STYLES[c] ?? CATEGORY_CHIP_STYLES["other"]
          const isActive = activeCategory === c
          const Icon = CATEGORY_ICONS[c] ?? LayoutGrid
          return (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                isActive ? styles.active : styles.inactive
              }`}
            >
              <Icon className="h-3 w-3 shrink-0" />
              {CATEGORY_LABELS[c] ?? c}
            </button>
          )
        })}
      </div>

      {/* Search + price row */}
      <div className="flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search listings..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>

        <Select
          value={searchParams.get("maxPrice") ?? "all"}
          onValueChange={(v) => apply("maxPrice", v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Max price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any price</SelectItem>
            <SelectItem value="1000">Under $1,000</SelectItem>
            <SelectItem value="5000">Under $5,000</SelectItem>
            <SelectItem value="10000">Under $10,000</SelectItem>
            <SelectItem value="25000">Under $25,000</SelectItem>
            <SelectItem value="50000">Under $50,000</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
