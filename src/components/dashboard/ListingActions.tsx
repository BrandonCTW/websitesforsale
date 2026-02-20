"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"

const STATUSES = [
  { value: "active",       label: "Active",       dot: "bg-emerald-500", dotPing: true  },
  { value: "under_offer",  label: "Under Offer",  dot: "bg-amber-500",   dotPing: false },
  { value: "sold",         label: "Sold",         dot: "bg-slate-400",   dotPing: false },
  { value: "unpublished",  label: "Unpublished",  dot: "bg-slate-300",   dotPing: false },
]

const STATUS_TRIGGER_STYLES: Record<string, string> = {
  active:      "border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30",
  under_offer: "border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30",
  sold:        "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40",
  unpublished: "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40",
}

export function ListingActions({
  listingId,
  currentStatus,
}: {
  listingId: number
  currentStatus: string
}) {
  const router = useRouter()

  async function updateStatus(status: string) {
    await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    router.refresh()
  }

  async function deleteListing() {
    if (!confirm("Delete this listing permanently?")) return
    await fetch(`/api/listings/${listingId}`, { method: "DELETE" })
    router.refresh()
  }

  const triggerStyle = STATUS_TRIGGER_STYLES[currentStatus] ?? STATUS_TRIGGER_STYLES.unpublished
  const currentStatusObj = STATUSES.find((s) => s.value === currentStatus)

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Select value={currentStatus} onValueChange={updateStatus}>
        <SelectTrigger className={`w-36 h-8 text-xs font-medium border transition-colors duration-200 ${triggerStyle}`}>
          <span className="flex items-center gap-1.5">
            {currentStatusObj && (
              <span className="relative flex items-center justify-center shrink-0 w-1.5 h-1.5">
                {currentStatusObj.dotPing && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatusObj.dot} opacity-75`} />
                )}
                <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${currentStatusObj.dot}`} />
              </span>
            )}
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value} className="text-xs">
              <span className="flex items-center gap-2">
                <span className={`inline-flex rounded-full w-1.5 h-1.5 shrink-0 ${s.dot}`} />
                {s.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Link href={`/dashboard/listings/${listingId}/edit`}>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs gap-1.5 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/60 transition-all duration-200"
        onClick={deleteListing}
      >
        <Trash2 className="h-3 w-3" />
        Delete
      </Button>
    </div>
  )
}
