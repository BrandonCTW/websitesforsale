"use client"

import { useState } from "react"
import { TrendingUp, DollarSign, Calendar, Zap } from "lucide-react"

const SCENARIOS = [
  { label: "Flat",       growth: 0,  colorIdx: 0 },
  { label: "Steady",     growth: 10, colorIdx: 1 },
  { label: "Growth",     growth: 20, colorIdx: 2 },
  { label: "Aggressive", growth: 35, colorIdx: 3 },
] as const

const SCENARIO_STYLES = [
  { active: "bg-slate-700 text-white border-slate-600",       dot: "bg-slate-400",  bar: "bg-slate-400",   text: "text-slate-700 dark:text-slate-300",      gradient: "text-slate-700 dark:text-slate-300" },
  { active: "bg-emerald-600 text-white border-emerald-500",   dot: "bg-emerald-400", bar: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400",  gradient: "animate-revenue-gradient" },
  { active: "bg-indigo-600 text-white border-indigo-500",     dot: "bg-indigo-400",  bar: "bg-indigo-500",  text: "text-indigo-700 dark:text-indigo-400",    gradient: "animate-price-gradient" },
  { active: "bg-violet-600 text-white border-violet-500",     dot: "bg-violet-400",  bar: "bg-violet-500",  text: "text-violet-700 dark:text-violet-400",    gradient: "animate-violet-gradient" },
]

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}k`
  return `$${Math.round(n)}`
}

export function ReturnsCalculator({
  askingPrice,
  monthlyRevenue,
  monthlyProfit,
}: {
  askingPrice: number
  monthlyRevenue: number
  monthlyProfit?: number | null
}) {
  const [scenarioIdx, setScenarioIdx] = useState(1)
  const scenario = SCENARIOS[scenarioIdx]
  const styles = SCENARIO_STYLES[scenarioIdx]

  // Profit margin: use actual profit if available, otherwise 40% estimate
  const profitMargin = monthlyProfit && monthlyProfit > 0
    ? monthlyProfit / monthlyRevenue
    : 0.40

  // Year-by-year revenue & profit
  const years = [1, 2, 3].map((yr) => {
    const multiplier = Math.pow(1 + scenario.growth / 100, yr)
    const rev = monthlyRevenue * 12 * multiplier
    const profit = rev * profitMargin
    return { yr, rev, profit }
  })

  const cumulativeProfit = years.reduce((s, y) => s + y.profit, 0)
  const roi = ((cumulativeProfit - askingPrice) / askingPrice) * 100
  const paybackMonths = Math.ceil(askingPrice / (monthlyRevenue * profitMargin * Math.pow(1 + scenario.growth / 100, 0.5)))

  // Bar chart: scale to tallest bar
  const maxProfit = Math.max(...years.map((y) => y.profit))

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
          <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">3-Year Returns Calculator</h3>
          <p className="text-xs text-muted-foreground">Projected profit at different growth rates</p>
        </div>
        {!monthlyProfit && (
          <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            ~40% margin estimate
          </span>
        )}
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Growth scenario selector */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
            Annual Growth Scenario
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SCENARIOS.map((s, i) => {
              const st = SCENARIO_STYLES[i]
              const isActive = i === scenarioIdx
              return (
                <button
                  key={s.label}
                  onClick={() => setScenarioIdx(i)}
                  className={`flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl border text-center transition-all duration-200 ${
                    isActive
                      ? st.active + " shadow-sm"
                      : "border-border/60 hover:border-border text-muted-foreground hover:text-foreground bg-muted/30"
                  }`}
                >
                  <span className="text-[11px] font-bold">{s.label}</span>
                  <span className={`text-[10px] font-medium ${isActive ? "opacity-80" : "opacity-60"}`}>
                    +{s.growth}%/yr
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bar chart */}
        <div>
          <div className="flex items-end gap-3 h-24">
            {years.map((y) => {
              const heightPct = maxProfit > 0 ? (y.profit / maxProfit) * 100 : 0
              return (
                <div key={y.yr} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className={`text-[10px] font-bold ${styles.gradient}`}>{fmt(y.profit)}</span>
                  <div className="w-full flex items-end" style={{ height: "56px" }}>
                    <div
                      className={`w-full rounded-t-md ${styles.bar} opacity-80 transition-all duration-500`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">Yr {y.yr}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="rounded-xl bg-muted/40 border border-border/40 px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">3-yr Profit</span>
            </div>
            <p className={`text-base font-bold ${styles.gradient}`}>{fmt(cumulativeProfit)}</p>
          </div>

          <div className="rounded-xl bg-muted/40 border border-border/40 px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">ROI</span>
            </div>
            <p className={`text-base font-bold ${roi >= 0 ? styles.gradient : "text-red-600 dark:text-red-400"}`}>
              {roi >= 0 ? "+" : ""}{roi.toFixed(0)}%
            </p>
          </div>

          <div className="rounded-xl bg-muted/40 border border-border/40 px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Payback</span>
            </div>
            <p className={`text-base font-bold ${styles.gradient}`}>{paybackMonths}mo</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          Projections are estimates for planning purposes only. Actual results depend on business performance.
        </p>
      </div>
    </div>
  )
}
