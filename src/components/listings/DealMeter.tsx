"use client"

import { useEffect, useState } from "react"

interface DealMeterProps {
  multiple: number
}

const SCALE_MAX = 60

function getLabel(multiple: number): { text: string; color: string } {
  if (multiple < 20) return { text: "Great Deal", color: "text-emerald-600 dark:text-emerald-400" }
  if (multiple < 30) return { text: "Fair Value", color: "text-amber-600 dark:text-amber-400" }
  if (multiple < 42) return { text: "Premium", color: "text-orange-600 dark:text-orange-400" }
  return { text: "Expensive", color: "text-red-600 dark:text-red-400" }
}

function getMarkerColor(multiple: number): string {
  if (multiple < 20) return "border-emerald-500 shadow-emerald-200 dark:shadow-emerald-900"
  if (multiple < 30) return "border-amber-500 shadow-amber-200 dark:shadow-amber-900"
  if (multiple < 42) return "border-orange-500 shadow-orange-200 dark:shadow-orange-900"
  return "border-red-500 shadow-red-200 dark:shadow-red-900"
}

export function DealMeter({ multiple }: DealMeterProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(t)
  }, [])

  const clampedMultiple = Math.min(multiple, SCALE_MAX)
  const position = (clampedMultiple / SCALE_MAX) * 100
  const label = getLabel(multiple)
  const markerBorder = getMarkerColor(multiple)

  const ticks = [
    { pct: (10 / SCALE_MAX) * 100, label: "10x" },
    { pct: (20 / SCALE_MAX) * 100, label: "20x" },
    { pct: (30 / SCALE_MAX) * 100, label: "30x" },
    { pct: (42 / SCALE_MAX) * 100, label: "42x" },
  ]

  return (
    <div
      className="rounded-xl border border-border/60 bg-muted/20 px-5 py-5 transition-opacity duration-500"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-sm">Revenue Multiple</h2>
        <span className={`text-sm font-bold ${label.color}`}>{label.text}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Asking price vs. monthly revenue — typical online businesses sell for{" "}
        <span className="font-medium text-foreground">20–30x</span> monthly.
      </p>

      {/* Bar */}
      <div className="relative">
        <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-400 to-red-500 shadow-inner" />

        {/* Tick marks */}
        {ticks.map(({ pct, label: tickLabel }) => (
          <div
            key={tickLabel}
            className="absolute top-0 flex flex-col items-center pointer-events-none"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-px h-3 bg-white/40" />
            <span className="mt-1.5 text-[9px] text-muted-foreground">{tickLabel}</span>
          </div>
        ))}

        {/* Marker */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-[2.5px] shadow-md transition-all duration-700 ease-out ${markerBorder}`}
          style={{
            left: mounted ? `${position}%` : "0%",
          }}
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-20" />
        </div>
      </div>

      {/* Bottom labels */}
      <div className="mt-5 flex justify-between text-[10px] text-muted-foreground select-none">
        <span className="text-emerald-600 dark:text-emerald-500 font-medium">Undervalued</span>
        <span>Fair</span>
        <span className="text-orange-600 dark:text-orange-500 font-medium">Premium</span>
      </div>

      {/* Current value callout */}
      <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">This listing</span>
        <span className="text-sm font-bold">
          <span className={label.color}>{multiple.toFixed(1)}x</span>
          <span className="text-muted-foreground font-normal text-xs ml-1">monthly revenue</span>
        </span>
      </div>
    </div>
  )
}
