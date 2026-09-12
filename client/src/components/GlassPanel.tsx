"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  refractScale?: number
  filterId?: string
  sheen?: boolean
  glow?: boolean
}

export function GlassPanel({
  children,
  className,
  refractScale = 1.04,
  filterId = "glass-refract-panel",
  sheen = true,
  glow = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "border border-white/25",
        "shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_0_rgba(0,0,0,0.4),inset_0_0_30px_rgba(255,255,255,0.04),0_20px_50px_-10px_rgba(0,0,0,0.5)]",
        glow && "shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,0.6),0_0_35px_rgba(251,146,60,0.2),0_20px_50px_-10px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {/* ── Refractive Lens Layer (Bends and magnifies background pixels) ── */}
      <div
        className="absolute inset-[-16px] bg-cover bg-center bg-fixed pointer-events-none -z-20 will-change-transform"
        style={{
          backgroundImage: "url('/background.png')",
          transform: `scale(${refractScale})`,
          filter: `contrast(115%) brightness(108%) saturate(125%) url(#${filterId})`,
        }}
      />

      {/* ── Optical Glass Substrate Tint (Clear, non-blurry crystalline depth) ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.09] via-white/[0.02] to-black/[0.22] pointer-events-none -z-10" />

      {/* ── Specular Glass Sheen (Angled surface light reflection) ── */}
      {sheen && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.18] via-white/[0.03] via-35% to-transparent pointer-events-none -z-10" />
      )}

      {/* ── Inner Bevel Perimeter Ring ── */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none -z-10 ring-1 ring-inset ring-white/20" />

      {/* ── Panel Content ── */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
