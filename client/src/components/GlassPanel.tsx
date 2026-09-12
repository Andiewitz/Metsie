"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  sheen?: boolean
  glow?: boolean
}

export function GlassPanel({
  children,
  className,
  sheen = true,
  glow = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "backdrop-blur-xl bg-zinc-950/50",
        "border border-white/15",
        "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.25),0_20px_50px_-10px_rgba(0,0,0,0.5)]",
        glow && "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_0_30px_rgba(251,146,60,0.15),0_20px_50px_-10px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {/* ── Subtle Specular Sheen ── */}
      {sheen && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/20 pointer-events-none -z-10" />
      )}

      {/* ── Content ── */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
