"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "under_offer", label: "Under Offer" },
  { value: "sold", label: "Sold" },
  { value: "unpublished", label: "Unpublished" },
]

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

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Select value={currentStatus} onValueChange={updateStatus}>
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value} className="text-xs">
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Link href={`/dashboard/listings/${listingId}/edit`}>
        <Button variant="outline" size="sm" className="h-8 text-xs">Edit</Button>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs text-destructive hover:text-destructive"
        onClick={deleteListing}
      >
        Delete
      </Button>
    </div>
  )
}
