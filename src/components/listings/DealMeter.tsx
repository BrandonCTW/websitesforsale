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

function getMarkerGlowClass(multiple: number): string {
  if (multiple < 20) return "animate-marker-glow-emerald"
  if (multiple < 30) return "animate-marker-glow-amber"
  if (multiple < 42) return "animate-marker-glow-orange"
  return "animate-marker-glow-red"
}

function getAccentBar(multiple: number): string {
  if (multiple < 20) return "from-emerald-400 to-emerald-500"
  if (multiple < 30) return "from-amber-400 to-amber-500"
  if (multiple < 42) return "from-orange-400 to-orange-500"
  return "from-red-400 to-red-500"
}

function getRadialGlow(multiple: number): string {
  if (multiple < 20) return "rgba(52,211,153,0.10)"
  if (multiple < 30) return "rgba(251,191,36,0.10)"
  if (multiple < 42) return "rgba(249,115,22,0.10)"
  return "rgba(239,68,68,0.10)"
}

function getShimmerColor(multiple: number): string {
  if (multiple < 20) return "via-emerald-400/[0.05]"
  if (multiple < 30) return "via-amber-400/[0.05]"
  if (multiple < 42) return "via-orange-400/[0.05]"
  return "via-red-400/[0.05]"
}

function getHoverBorder(multiple: number): string {
  if (multiple < 20) return "hover:border-emerald-200 dark:hover:border-emerald-800/60"
  if (multiple < 30) return "hover:border-amber-200 dark:hover:border-amber-800/60"
  if (multiple < 42) return "hover:border-orange-200 dark:hover:border-orange-800/60"
  return "hover:border-red-200 dark:hover:border-red-800/60"
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
  const markerGlowClass = getMarkerGlowClass(multiple)
  const accentBar = getAccentBar(multiple)
  const radialGlow = getRadialGlow(multiple)
  const shimmerColor = getShimmerColor(multiple)
  const hoverBorder = getHoverBorder(multiple)

  const ticks = [
    { pct: (10 / SCALE_MAX) * 100, label: "10x" },
    { pct: (20 / SCALE_MAX) * 100, label: "20x" },
    { pct: (30 / SCALE_MAX) * 100, label: "30x" },
    { pct: (42 / SCALE_MAX) * 100, label: "42x" },
  ]

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 px-5 py-5 hover:shadow-sm ${hoverBorder}`}
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease, border-color 0.2s, box-shadow 0.2s" }}
    >
      {/* Color-coded left accent bar */}
      <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b ${accentBar} opacity-70`} />
      {/* Faint radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${radialGlow} 0%, transparent 60%)` }} />
      {/* Shimmer sweep */}
      <div className={`absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent ${shimmerColor} to-transparent animate-shimmer pointer-events-none`} style={{ animationDelay: "1.2s" }} />

      <div className="relative">
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
          <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-400 to-red-500 shadow-inner overflow-hidden relative">
            <div className="animate-deal-bar-shimmer absolute inset-y-0 w-[12%] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
          </div>

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
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-[2.5px] shadow-md transition-all duration-700 ease-out ${markerBorder} ${markerGlowClass}`}
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
    </div>
  )
}
