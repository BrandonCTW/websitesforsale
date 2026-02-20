import { notFound } from "next/navigation"
import { db } from "@/db"
import { users, listings } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { ListingCard } from "@/components/listings/ListingCard"
import { formatCurrency } from "@/lib/slug"
import { LayoutGrid, ShieldCheck, Package, Layers, DollarSign, BarChart3 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const [seller] = await db
    .select({ id: users.id, username: users.username, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1)

  if (!seller) notFound()

  const sellerListings = await db
    .select()
    .from(listings)
    .where(and(eq(listings.sellerId, seller.id), eq(listings.status, "active")))
    .orderBy(listings.createdAt)

  const memberSince = new Date(seller.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const initial = seller.username[0].toUpperCase()

  const totalValue = sellerListings.reduce((sum, l) => sum + l.askingPrice, 0)
  const avgPrice = sellerListings.length > 0 ? Math.round(totalValue / sellerListings.length) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="mb-10 rounded-2xl overflow-hidden border border-border/60 shadow-sm">
        {/* Dark hero banner */}
        <div className="relative h-36 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          {/* Accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
          {/* Radial color overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.30)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.18)_0%,_transparent_60%)]" />
          {/* Animated orbs */}
          <div className="animate-orb-1 absolute -top-8 -right-8 w-52 h-52 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="animate-orb-2 absolute -bottom-8 -left-8 w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          {/* Sparkle particles */}
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/70 blur-[0.5px] pointer-events-none" style={{ top: '18%', left: '7%', animationDuration: '3.2s', animationDelay: '0s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/65 pointer-events-none" style={{ top: '62%', left: '5%', animationDuration: '2.5s', animationDelay: '1.1s' }} />
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/65 blur-[0.5px] pointer-events-none" style={{ top: '20%', right: '9%', animationDuration: '3.8s', animationDelay: '0.4s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/75 pointer-events-none" style={{ top: '58%', right: '7%', animationDuration: '2.8s', animationDelay: '1.8s' }} />
          <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/20 blur-sm pointer-events-none" style={{ top: '75%', left: '68%', animationDuration: '4.1s', animationDelay: '0.9s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-emerald-200/65 pointer-events-none" style={{ top: '35%', left: '50%', animationDuration: '3.0s', animationDelay: '2.3s' }} />
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-300/55 blur-[0.5px] pointer-events-none" style={{ top: '14%', left: '38%', animationDuration: '3.5s', animationDelay: '1.5s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/55 pointer-events-none" style={{ top: '80%', right: '22%', animationDuration: '2.6s', animationDelay: '2.8s' }} />
          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          {/* Trust badges overlaid on banner (bottom-right) */}
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
              <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
              Verified Seller
            </span>
            {sellerListings.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
                <Package className="h-3 w-3 text-indigo-400 shrink-0" />
                {sellerListings.length} listing{sellerListings.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        {/* Profile card body */}
        <div className="px-6 pb-6 bg-card">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-background shadow-lg shrink-0">
              {initial}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold">{seller.username}</h1>
              <p className="text-muted-foreground text-sm">Member since {memberSince}</p>
            </div>
          </div>

          {/* Stats grid — animated metric cards */}
          <div className={`mt-4 grid gap-3 ${sellerListings.length > 1 ? "grid-cols-1 sm:grid-cols-3" : sellerListings.length === 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-1 max-w-[180px]"}`}>
            {/* Active listings card */}
            <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/70 to-violet-50/50 dark:from-indigo-950/30 dark:to-violet-950/20 p-4 group hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-100/70 dark:hover:shadow-indigo-950/60 transition-all duration-200" style={{ animationDelay: "0ms" }}>
              <div className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
              <div className="animate-sparkle absolute w-1 h-1 rounded-full blur-[0.5px] pointer-events-none" style={{ top: '12%', right: '10%', animationDuration: '3.3s', animationDelay: '0s', backgroundColor: 'rgba(99,102,241,0.60)' }} />
              <div className="animate-sparkle absolute w-px h-px rounded-full pointer-events-none" style={{ bottom: '18%', left: '8%', animationDuration: '2.6s', animationDelay: '1.3s', backgroundColor: 'rgba(165,180,252,0.55)' }} />
              <div className="w-7 h-7 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-200">
                <Package className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs text-muted-foreground mb-0.5">Active listings</p>
              <p className="font-bold text-xl animate-price-gradient">{sellerListings.length}</p>
            </div>

            {/* Total portfolio value card */}
            {sellerListings.length > 0 && (
              <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 p-4 group hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-100/70 dark:hover:shadow-emerald-950/60 transition-all duration-200" style={{ animationDelay: "60ms" }}>
                <div className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
                <div className="animate-sparkle absolute w-1 h-1 rounded-full blur-[0.5px] pointer-events-none" style={{ top: '12%', right: '10%', animationDuration: '3.6s', animationDelay: '0.4s', backgroundColor: 'rgba(16,185,129,0.60)' }} />
                <div className="animate-sparkle absolute w-px h-px rounded-full pointer-events-none" style={{ bottom: '18%', left: '8%', animationDuration: '2.9s', animationDelay: '1.7s', backgroundColor: 'rgba(52,211,153,0.55)' }} />
                <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-200">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">Portfolio value</p>
                <p className="font-bold text-xl animate-revenue-gradient">{formatCurrency(totalValue)}</p>
              </div>
            )}

            {/* Avg price card */}
            {sellerListings.length > 1 && (
              <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-amber-200 dark:border-amber-800/60 bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 p-4 group hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-100/70 dark:hover:shadow-amber-950/60 transition-all duration-200" style={{ animationDelay: "120ms" }}>
                <div className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
                <div className="animate-sparkle absolute w-1 h-1 rounded-full blur-[0.5px] pointer-events-none" style={{ top: '12%', right: '10%', animationDuration: '3.4s', animationDelay: '0.8s', backgroundColor: 'rgba(245,158,11,0.60)' }} />
                <div className="animate-sparkle absolute w-px h-px rounded-full pointer-events-none" style={{ bottom: '18%', left: '8%', animationDuration: '2.7s', animationDelay: '2.1s', backgroundColor: 'rgba(251,191,36,0.55)' }} />
                <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-200">
                  <BarChart3 className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">Avg. listing price</p>
                <p className="font-bold text-xl animate-age-gradient">{formatCurrency(avgPrice)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {sellerListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 flex items-center justify-center mb-5 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
            <LayoutGrid className="w-7 h-7 text-indigo-400 dark:text-indigo-500" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No active listings</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            This seller doesn&apos;t have any active listings right now.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 animate-section-divider" />
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest animate-section-label">
              <Layers className="h-3 w-3 opacity-70" />
              {sellerListings.length} Active Listing{sellerListings.length !== 1 ? "s" : ""}
            </span>
            <div className="h-px flex-1 animate-section-divider" style={{ animationDelay: "3.5s" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerListings.map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                sellerUsername={seller.username}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
