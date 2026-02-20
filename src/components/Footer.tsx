import Link from "next/link"
import { ShieldCheck, MessageCircle, DollarSign, LayoutGrid, ArrowRightLeft } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-12">

        {/* Trust stats band */}
        <div className="animate-on-scroll grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 pb-10 border-b border-white/[0.06]">
          <div className="group flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 hover:border-white/[0.12] transition-all duration-200 cursor-default">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-200">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white leading-none">$0</p>
              <p className="text-xs text-slate-500 mt-0.5">in broker fees, ever</p>
            </div>
          </div>
          <div className="group flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 hover:border-white/[0.12] transition-all duration-200 cursor-default">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-200">
              <LayoutGrid className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white leading-none">8</p>
              <p className="text-xs text-slate-500 mt-0.5">website categories</p>
            </div>
          </div>
          <div className="group flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 hover:border-white/[0.12] transition-all duration-200 cursor-default">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:from-indigo-500/20 group-hover:to-emerald-500/20 transition-all duration-200">
              <ArrowRightLeft className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-snug">100% Direct</p>
              <p className="text-xs text-slate-500 mt-0.5">buyer meets seller</p>
            </div>
          </div>
        </div>

        <div className="animate-on-scroll grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="group flex items-center gap-2 font-bold text-lg tracking-tight">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500 text-white text-xs font-bold shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                W
              </span>
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                WebsitesForSale
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Buy and sell profitable websites directly. No broker fees. No commissions. Just deals.
            </p>
          </div>

          {/* Buyers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Buyers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="group relative inline-block hover:text-white transition-colors duration-200">
                  Browse Listings
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link href="/?category=saas" className="group relative inline-block hover:text-white transition-colors duration-200">
                  SaaS &amp; Apps
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link href="/?category=content-site" className="group relative inline-block hover:text-white transition-colors duration-200">
                  Content Sites
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link href="/?category=ecommerce" className="group relative inline-block hover:text-white transition-colors duration-200">
                  eCommerce
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Sellers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register" className="group relative inline-block hover:text-white transition-colors duration-200">
                  List Your Site
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="group relative inline-block hover:text-white transition-colors duration-200">
                  Seller Dashboard
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            </ul>
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                Zero broker fees
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <MessageCircle className="h-3 w-3 text-indigo-400 shrink-0" />
                Direct seller contact
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WebsitesForSale. All rights reserved.</p>
          <p>No commissions. No middlemen. Just deals.</p>
        </div>
      </div>
    </footer>
  )
}
