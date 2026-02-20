"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export type MetricColor = "indigo" | "emerald" | "teal" | "sky" | "amber" | "violet"

const METRIC_COLOR_STYLES: Record<MetricColor, { border: string; bg: string; value: string; icon: string; sparkle: [string, string] }> = {
  indigo: {
    border: "border-indigo-200 dark:border-indigo-800/60",
    bg: "bg-gradient-to-br from-indigo-50/70 to-emerald-50/50 dark:from-indigo-950/30 dark:to-emerald-950/20",
    value: "animate-price-gradient",
    icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
    sparkle: ["rgba(99,102,241,0.60)", "rgba(165,180,252,0.55)"],
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-800/60",
    bg: "bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20",
    value: "animate-revenue-gradient",
    icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
    sparkle: ["rgba(16,185,129,0.60)", "rgba(52,211,153,0.55)"],
  },
  teal: {
    border: "border-teal-200 dark:border-teal-800/60",
    bg: "bg-gradient-to-br from-teal-50/70 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/20",
    value: "animate-teal-gradient",
    icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400",
    sparkle: ["rgba(20,184,166,0.60)", "rgba(45,212,191,0.55)"],
  },
  sky: {
    border: "border-sky-200 dark:border-sky-800/60",
    bg: "bg-gradient-to-br from-sky-50/70 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/20",
    value: "animate-traffic-gradient",
    icon: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
    sparkle: ["rgba(14,165,233,0.60)", "rgba(56,189,248,0.55)"],
  },
  amber: {
    border: "border-amber-200 dark:border-amber-800/60",
    bg: "bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20",
    value: "animate-age-gradient",
    icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
    sparkle: ["rgba(245,158,11,0.60)", "rgba(251,191,36,0.55)"],
  },
  violet: {
    border: "border-violet-200 dark:border-violet-800/60",
    bg: "bg-gradient-to-br from-violet-50/70 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/20",
    value: "animate-violet-gradient",
    icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
    sparkle: ["rgba(139,92,246,0.60)", "rgba(167,139,250,0.55)"],
  },
}

function AnimatedValue({
  target,
  duration = 1200,
  prefix,
  suffix,
}: {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    startRef.current = null
    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(easeOutExpo(progress) * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return (
    <span>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export function MetricBox({
  label,
  value,
  rawValue,
  prefix,
  suffix,
  color = "indigo",
  icon: Icon,
  index = 0,
}: {
  label: string
  value: string
  rawValue?: number
  prefix?: string
  suffix?: string
  color?: MetricColor
  icon?: LucideIcon
  index?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const styles = METRIC_COLOR_STYLES[color]
  const spDelay = (index * 0.43) % 2.5

  return (
    <div
      ref={ref}
      className={`relative rounded-lg border p-4 animate-fade-in-up overflow-hidden ${styles.border} ${styles.bg}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Shimmer sweep */}
      <div className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
      {/* Sparkle particles */}
      <div className="animate-sparkle absolute w-1 h-1 rounded-full blur-[0.5px] pointer-events-none" style={{ top: '12%', right: '10%', animationDuration: '3.3s', animationDelay: `${spDelay}s`, backgroundColor: styles.sparkle[0] }} />
      <div className="animate-sparkle absolute w-px h-px rounded-full pointer-events-none" style={{ bottom: '18%', left: '8%', animationDuration: '2.6s', animationDelay: `${(spDelay + 1.3) % 2.7}s`, backgroundColor: styles.sparkle[1] }} />
      <div className="animate-sparkle absolute w-px h-px rounded-full pointer-events-none" style={{ top: '55%', right: '7%', animationDuration: '3.8s', animationDelay: `${(spDelay + 0.8) % 3.2}s`, backgroundColor: styles.sparkle[0] }} />
      {Icon && (
        <div className={`relative w-7 h-7 rounded-md flex items-center justify-center mb-2.5 ${styles.icon}`}>
          <Icon className="h-3.5 w-3.5 relative z-10" />
        </div>
      )}
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-semibold text-lg ${styles.value}`}>
        {visible && rawValue != null ? (
          <AnimatedValue target={rawValue} prefix={prefix} suffix={suffix} />
        ) : (
          value
        )}
      </p>
    </div>
  )
}
