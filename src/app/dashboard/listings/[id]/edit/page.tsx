import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { listings, listingImages } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { EditListingForm } from "@/components/dashboard/EditListingForm"
import { PencilLine } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { id } = await params

  const [listing] = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, parseInt(id)), eq(listings.sellerId, session.user.id)))
    .limit(1)

  if (!listing) notFound()

  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listing.id))
    .orderBy(listingImages.displayOrder)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Gradient hero header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-8 mb-8">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        {/* Animated orbs */}
        <div className="animate-orb-1 absolute -top-8 -right-8 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="animate-orb-2 absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        {/* Sparkle particles */}
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/70 blur-[0.5px] pointer-events-none" style={{ top: '18%', left: '6%', animationDuration: '3.2s', animationDelay: '0s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/60 pointer-events-none" style={{ top: '62%', left: '4%', animationDuration: '2.5s', animationDelay: '1.1s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/65 blur-[0.5px] pointer-events-none" style={{ top: '20%', right: '9%', animationDuration: '3.8s', animationDelay: '0.6s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/75 pointer-events-none" style={{ top: '58%', right: '7%', animationDuration: '2.7s', animationDelay: '1.8s' }} />
        <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-indigo-200/35 blur-sm pointer-events-none" style={{ top: '75%', left: '68%', animationDuration: '4.1s', animationDelay: '0.9s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/50 pointer-events-none" style={{ top: '38%', left: '50%', animationDuration: '2.9s', animationDelay: '2.2s' }} />

        <div className="relative mb-5">
          <div className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium text-indigo-200 mb-4" style={{ animationDelay: '0.05s' }}>
            <PencilLine className="h-3 w-3 text-indigo-300" />
            Edit listing
          </div>
          <h1 className="animate-fade-in-up text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1" style={{ animationDelay: '0.15s' }}>
            {listing.title}
          </h1>
          <p className="animate-fade-in-up text-slate-400 text-sm" style={{ animationDelay: '0.25s' }}>
            Update your listing details, photos, and asking price
          </p>
        </div>

        {/* Nav tabs */}
        <div className="relative flex items-center gap-1 border-t border-white/10 pt-4">
          <Link href="/dashboard/listings" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Listings</Link>
          <Link href="/dashboard/inquiries" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Inquiries</Link>
          <Link href="/dashboard/settings" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Settings</Link>
        </div>
      </div>

      <div className="max-w-2xl">
        <EditListingForm listing={listing} initialImageUrls={images.map((i) => i.url)} />
      </div>
    </div>
  )
}
