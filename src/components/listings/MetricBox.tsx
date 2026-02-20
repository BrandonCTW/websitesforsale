"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export type MetricColor = "indigo" | "emerald" | "teal" | "sky" | "amber" | "violet"

const METRIC_COLOR_STYLES: Record<MetricColor, { border: string; bg: string; value: string; icon: string }> = {
  indigo: {
    border: "border-indigo-200 dark:border-indigo-800/60",
    bg: "bg-gradient-to-br from-indigo-50/70 to-emerald-50/50 dark:from-indigo-950/30 dark:to-emerald-950/20",
    value: "animate-price-gradient",
    icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-800/60",
    bg: "bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20",
    value: "animate-revenue-gradient",
    icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
  },
  teal: {
    border: "border-teal-200 dark:border-teal-800/60",
    bg: "bg-gradient-to-br from-teal-50/70 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/20",
    value: "animate-teal-gradient",
    icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400",
  },
  sky: {
    border: "border-sky-200 dark:border-sky-800/60",
    bg: "bg-gradient-to-br from-sky-50/70 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/20",
    value: "animate-traffic-gradient",
    icon: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-800/60",
    bg: "bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20",
    value: "animate-age-gradient",
    icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-800/60",
    bg: "bg-gradient-to-br from-violet-50/70 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/20",
    value: "animate-violet-gradient",
    icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
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

  return (
    <div
      ref={ref}
      className={`rounded-lg border p-4 animate-fade-in-up ${styles.border} ${styles.bg}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {Icon && (
        <div className={`w-7 h-7 rounded-md flex items-center justify-center mb-2.5 ${styles.icon}`}>
          <Icon className="h-3.5 w-3.5" />
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
