"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Home, Settings, LogOut } from "lucide-react"

const TABS = [
  { label: "PLAY",        href: "/dashboard" },
  { label: "SUBJECTS",    href: "/dashboard/subjects" },
  { label: "LEADERBOARD", href: "/dashboard/leaderboard" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??"

  return (
    <div className="fixed inset-0 flex flex-col bg-zinc-950 overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="relative z-50 flex items-center h-12 px-4 shrink-0 border-b border-white/5 bg-zinc-950/80 backdrop-blur">
        {/* Left: icon buttons */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          <button
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/5 transition"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Center: tab navigation */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">
          {TABS.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-xs font-bold tracking-widest transition font-small ${
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-violet-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: player avatar + rank */}
        <div className="ml-auto flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-zinc-200 leading-none font-sub">{user?.username ?? "—"}</p>
            <p className="text-[10px] text-zinc-500 font-small mt-0.5">Rank #—</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center text-xs font-bold font-main">
            {initials}
          </div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>
    </div>
  )
}
