import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { inquiries, listings } from "@/db/schema"
import { eq } from "drizzle-orm"
import { timeAgo } from "@/lib/slug"
import { MessageCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function InquiriesPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const rows = await db
    .select({
      inquiry: inquiries,
      listing: { title: listings.title, slug: listings.slug },
    })
    .from(inquiries)
    .innerJoin(listings, eq(inquiries.listingId, listings.id))
    .where(eq(listings.sellerId, session.user.id))
    .orderBy(inquiries.createdAt)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Gradient hero header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-8 mb-6">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500" />
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        {/* Animated orbs */}
        <div className="animate-orb-1 absolute -top-8 -right-8 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="animate-orb-2 absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        {/* Sparkle particles */}
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/70 blur-[0.5px] pointer-events-none" style={{ top: '16%', left: '6%', animationDuration: '3.4s', animationDelay: '0.3s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/60 pointer-events-none" style={{ top: '68%', left: '4%', animationDuration: '2.5s', animationDelay: '1.5s' }} />
        <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-300/65 blur-[0.5px] pointer-events-none" style={{ top: '20%', right: '7%', animationDuration: '3.7s', animationDelay: '0.6s' }} />
        <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/75 pointer-events-none" style={{ top: '62%', right: '5%', animationDuration: '2.9s', animationDelay: '2.0s' }} />
        <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/20 blur-sm pointer-events-none" style={{ top: '45%', left: '52%', animationDuration: '4.3s', animationDelay: '1.1s' }} />

        <div className="relative flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 className="text-xl font-bold text-white">Inquiries</h1>
            <p className="text-slate-400 text-sm mt-0.5">Messages from interested buyers — reply directly to their email</p>
          </div>
          {rows.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300">
                {rows.length} total
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                {new Set(rows.map(({ inquiry }) => inquiry.buyerEmail)).size} unique buyers
              </span>
            </div>
          )}
        </div>

        {/* Nav tabs */}
        <div className="relative flex items-center gap-1 border-t border-white/10 pt-4">
          <Link href="/dashboard/listings" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Listings</Link>
          <Link href="/dashboard/inquiries" className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/15 text-white text-sm font-semibold transition-colors">Inquiries</Link>
          <Link href="/dashboard/settings" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Settings</Link>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="relative text-center py-20 rounded-2xl border border-border/40 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950/50 dark:to-indigo-950/20 overflow-hidden">
          {/* Ambient orb blobs */}
          <div className="animate-orb-1 absolute -top-10 -right-10 w-52 h-52 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="animate-orb-2 absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />
          {/* Sparkle particles */}
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/65 blur-[0.5px] pointer-events-none" style={{ top: '14%', left: '8%', animationDuration: '3.3s', animationDelay: '0s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-violet-200/70 pointer-events-none" style={{ top: '70%', left: '6%', animationDuration: '2.6s', animationDelay: '1.3s' }} />
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-violet-300/60 blur-[0.5px] pointer-events-none" style={{ top: '18%', right: '10%', animationDuration: '3.9s', animationDelay: '0.7s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/75 pointer-events-none" style={{ top: '65%', right: '8%', animationDuration: '2.5s', animationDelay: '2.0s' }} />
          <div className="animate-sparkle absolute w-1.5 h-1.5 rounded-full bg-white/25 blur-sm pointer-events-none" style={{ top: '40%', left: '76%', animationDuration: '4.1s', animationDelay: '0.9s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-violet-200/65 pointer-events-none" style={{ top: '28%', left: '18%', animationDuration: '3.0s', animationDelay: '2.4s' }} />
          <div className="relative">
            {/* Floating animated icon */}
            <div className="animate-icon-float relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50">
              <div className="animate-shimmer absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <MessageCircle className="h-7 w-7 text-white relative z-10" />
            </div>
            <p className="animate-fade-in-up font-semibold text-lg mb-2" style={{ animationDelay: '0.1s' }}>No inquiries yet</p>
            <p className="animate-fade-in-up text-muted-foreground text-sm mb-2 max-w-xs mx-auto" style={{ animationDelay: '0.2s' }}>
              When buyers contact you through your listings, their messages will appear here.
            </p>
            <p className="animate-fade-in-up text-muted-foreground text-sm" style={{ animationDelay: '0.28s' }}>
              <Link href="/dashboard/listings" className="underline hover:text-foreground">
                Make sure your listings are active
              </Link>{" "}
              to start receiving inquiries.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ inquiry, listing }, index) => {
            const initials = inquiry.buyerName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()

            return (
              <div
                key={inquiry.id}
                className="group relative rounded-xl border border-l-4 border-l-indigo-400 bg-card p-5 transition-all duration-200 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 hover:shadow-md animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                {/* Shine sweep on hover */}
                <div className="card-shine absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none z-10" />
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Avatar */}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm transition-transform duration-200 group-hover:scale-110">
                    {initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <p className="font-semibold text-base leading-tight">{inquiry.buyerName}</p>
                        <a
                          href={`mailto:${inquiry.buyerEmail}`}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {inquiry.buyerEmail}
                        </a>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground mb-0.5">{timeAgo(new Date(inquiry.createdAt))}</p>
                        <Link
                          href={`/listings/${listing.slug}`}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground whitespace-pre-wrap border-t pt-3 mb-3">
                      {inquiry.message}
                    </p>

                    <a
                      href={`mailto:${inquiry.buyerEmail}?subject=Re: ${encodeURIComponent(listing.title)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-medium px-3 py-1.5 shadow-sm transition-all"
                    >
                      Reply via email →
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
