"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Home, Tv, Settings, Power } from "lucide-react"
import { ProfileSidebar } from "@/components/ProfileSidebar"

const TABS = [
  { label: "INVENTORY", href: "#" },
  { label: "LOADOUT",   href: "#" },
  { label: "PLAY",      href: "/dashboard" },
  { label: "STORE",     href: "#" },
  { label: "NEWS",      href: "#" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none bg-zinc-950">
      {/* ── Global SVG Optical Displacement Filters (Bends pixels like real glass) ── */}
      <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none opacity-0 select-none -z-50" aria-hidden="true">
        <defs>
          {/* Main glass panel optical refraction (undulating light bending) */}
          <filter id="glass-refract-panel" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Subtle bar refraction for headers and narrow slabs */}
          <filter id="glass-refract-bar" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      {/* ── Fullscreen Real World Background (Sunset Hills PNG) ── */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{ backgroundImage: "url('/background.png')" }}
      />

      {/* ── Subtle Atmospheric Sunset Depth Gradient ── */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/35 pointer-events-none -z-20" />

      {/* ── Top Header Navbar (Real Glass Bar) ─────────────────────────── */}
      <header className="relative z-50 flex items-center justify-between h-12 px-4 shrink-0 overflow-hidden border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        {/* Refractive background slice: bends the sky behind the bar */}
        <div className="real-glass-refractor-bar" />
        <div className="real-glass-tint" />
        <div className="real-glass-sheen" />

        {/* Left: Quick Actions (Home, Watch, Settings, Power) */}
        <div className="relative z-10 flex items-center gap-1.5">
          <Link
            href="/"
            className="p-2 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/20 text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition"
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          <button
            className="p-2 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/20 text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition cursor-pointer"
            title="Watch / Matches"
          >
            <Tv className="h-4 w-4" />
          </button>
          <Link
            href={pathname === "/dashboard/settings" ? "/dashboard" : "/dashboard/settings"}
            className={`p-2 rounded-xl border transition ${
              pathname === "/dashboard/settings"
                ? "border-violet-400/60 bg-violet-500/25 text-violet-200 shadow-[0_0_16px_rgba(167,139,250,0.4)]"
                : "border-white/10 bg-white/[0.06] hover:bg-white/20 text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
            }`}
            title="User Profile Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-red-500/20 text-zinc-300 hover:text-red-400 hover:border-red-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition cursor-pointer"
            title="Exit / Logout"
          >
            <Power className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Main Game Tabs (Centered relative to the entire screen) */}
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 h-12 z-50 flex items-center gap-7 pointer-events-auto">
          {TABS.map(({ label, href }) => {
            const isPlay = label === "PLAY"
            const isActive = isPlay && pathname === "/dashboard"

            return (
              <Link
                key={label}
                href={href}
                className={`relative py-1 text-xs font-black tracking-widest transition font-small ${
                  isActive
                    ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                    : "text-zinc-300/80 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300 via-50% to-transparent shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side spacer */}
        <div className="w-8 relative z-10" />
      </header>

      {/* ── Body: Main Canvas + Real Glass Profile Sidebar on the right ── */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
        <ProfileSidebar />
      </div>
    </div>
  )
}
