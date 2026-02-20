import Link from "next/link"
import { ShieldCheck, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500 text-white text-xs font-bold shrink-0">
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
                <Link href="/" className="hover:text-white transition-colors">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link href="/?category=saas" className="hover:text-white transition-colors">
                  SaaS &amp; Apps
                </Link>
              </li>
              <li>
                <Link href="/?category=content-site" className="hover:text-white transition-colors">
                  Content Sites
                </Link>
              </li>
              <li>
                <Link href="/?category=ecommerce" className="hover:text-white transition-colors">
                  eCommerce
                </Link>
              </li>
            </ul>
          </div>

          {/* Sellers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  List Your Site
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Seller Dashboard
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
