"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function FilterBar({ categories }: { categories: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get("q") ?? "")

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

  function reset() {
    setQ("")
    router.push("/")
  }

  const hasFilters = searchParams.size > 0

  return (
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
        value={searchParams.get("category") ?? "all"}
        onValueChange={(v) => apply("category", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {CATEGORY_LABELS[c] ?? c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
  )
}
