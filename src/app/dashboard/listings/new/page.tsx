import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { NewListingForm } from "@/components/dashboard/NewListingForm"
import { Sparkles } from "lucide-react"

export default async function NewListingPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Nav tabs */}
      <div className="flex gap-4 mb-8 border-b pb-4 text-sm">
        <Link href="/dashboard/listings" className="text-muted-foreground hover:text-foreground">Listings</Link>
        <Link href="/dashboard/inquiries" className="text-muted-foreground hover:text-foreground">Inquiries</Link>
        <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground">Settings</Link>
      </div>

      {/* Gradient hero header */}
      <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.30)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        <div className="animate-orb-1 absolute -top-8 -right-8 w-52 h-52 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="animate-orb-2 absolute -bottom-8 -left-8 w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="relative px-8 py-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium text-indigo-200 mb-4">
            <Sparkles className="h-3 w-3 text-indigo-300" />
            AI-powered listing generator
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            List your website —{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              free, no fees
            </span>
          </h1>
          <p className="text-slate-300 text-sm max-w-lg">
            Enter your URL and asking price. Our AI scrapes your site and writes the listing for you — title, description, tech stack, and more.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <NewListingForm />
      </div>
    </div>
  )
}
