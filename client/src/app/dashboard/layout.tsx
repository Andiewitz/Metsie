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
    <div className="fixed inset-0 flex flex-col bg-zinc-950 overflow-hidden select-none">
      {/* ── Top Header Navbar (CS2 style) ─────────────────────────────── */}
      <header className="relative z-50 flex items-center justify-between h-12 px-4 shrink-0 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        {/* Left: Quick Actions (Home, TV/Watch, Settings, Power) */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition"
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          <button
            className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition"
            title="Watch / Matches"
          >
            <Tv className="h-4 w-4" />
          </button>
          <Link
            href={pathname === "/dashboard/settings" ? "/dashboard" : "/dashboard/settings"}
            className={`p-2 rounded-md transition ${
              pathname === "/dashboard/settings"
                ? "text-violet-400 bg-white/10"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
            title="User Profile Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-zinc-400 hover:text-red-400 hover:bg-white/5 transition"
            title="Exit / Logout"
          >
            <Power className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Main Game Tabs (Centered relative to the entire screen) */}
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 h-12 z-50 flex items-center gap-6 pointer-events-auto">
          {TABS.map(({ label, href }) => {
            const isPlay = label === "PLAY"
            const isActive = isPlay && pathname === "/dashboard"

            return (
              <Link
                key={label}
                href={href}
                className={`relative py-1 text-xs font-bold tracking-widest transition font-small ${
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side spacer */}
        <div className="w-8" />
      </header>

      {/* ── Body: Main Canvas + Profiles Sidebar on the right ─────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
        <ProfileSidebar />
      </div>
    </div>
  )
}
