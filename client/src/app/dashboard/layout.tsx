"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Home, Tv, Settings, Power } from "lucide-react"
import { ProfileSidebar } from "@/components/ProfileSidebar"

import { avatars } from "@/components/ui/avatar-picker"

const TABS = [
  { label: "INVENTORY", href: "#" },
  { label: "LOADOUT",   href: "#" },
  { label: "PLAY",      href: "/dashboard/play" },
  { label: "STORE",     href: "#" },
  { label: "NEWS",      href: "#" },
]

function HeaderAvatar() {
  const [avatarId, setAvatarId] = React.useState(1)

  React.useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem("metsie_avatar_id")
      if (saved) setAvatarId(Number(saved))
    }
    sync()
    window.addEventListener("metsie_avatar_changed", sync)
    return () => window.removeEventListener("metsie_avatar_changed", sync)
  }, [])

  const found = avatars.find((a) => a.id === avatarId) || avatars[0]
  return found.svg
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none bg-zinc-950">
      {/* ── Fullscreen Background (Sunset Hills PNG) ── */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-30"
        style={{ backgroundImage: "url('/background.png')" }}
      />

      {/* ── Subtle Atmospheric Sunset Depth Gradient ── */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/35 pointer-events-none -z-20" />

      {/* ── Top Header Navbar (Frosted Glass Bar) ─────────────────────────── */}
      <header className="relative z-50 flex items-center justify-between h-12 px-4 shrink-0 backdrop-blur-xl bg-zinc-950/60 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        {/* Left: Quick Actions (Home -> Main Dashboard, Watch, Settings, Power) */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className={`p-2 rounded-xl border transition ${
              pathname === "/dashboard"
                ? "border-amber-400/50 bg-amber-400/15 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                : "border-white/10 bg-white/[0.05] hover:bg-white/15 text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            }`}
            title="Main Dashboard"
          >
            <Home className="h-4 w-4" />
          </Link>
          <button
            className="p-2 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/15 text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition cursor-pointer"
            title="Watch / Matches"
          >
            <Tv className="h-4 w-4" />
          </button>
          <Link
            href={pathname === "/dashboard/settings" ? "/dashboard" : "/dashboard/settings"}
            className={`p-2 rounded-xl border transition ${
              pathname === "/dashboard/settings"
                ? "border-violet-400/60 bg-violet-500/25 text-violet-200 shadow-[0_0_16px_rgba(167,139,250,0.4)]"
                : "border-white/10 bg-white/[0.05] hover:bg-white/15 text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            }`}
            title="User Profile Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-red-500/20 text-zinc-300 hover:text-red-400 hover:border-red-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition cursor-pointer"
            title="Exit / Logout"
          >
            <Power className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Main Game Tabs (Centered relative to the entire screen) */}
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 h-12 z-50 flex items-center gap-7 pointer-events-auto">
          {TABS.map(({ label, href }) => {
            const isPlay = label === "PLAY"
            const isActive = isPlay ? pathname === "/dashboard/play" : pathname === href

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

        {/* Right side: User Profile Avatar aligned with header height */}
        <div className="flex items-center">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/10 border border-white/10 transition group/user"
            title="Profile Settings"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-300/80 bg-black/40 flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.3)] group-hover/user:scale-105 group-hover/user:border-amber-200 transition [&>svg]:w-full [&>svg]:h-full">
                <HeaderAvatar />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black/80 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            </div>
            {user && (
              <span className="hidden sm:inline-block text-xs font-black text-white font-main pr-1.5 drop-shadow-sm">
                {user.profile?.full_name || user.username}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* ── Body: Main Canvas + Frosted Glass Profile Sidebar on the right ── */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
        <ProfileSidebar />
      </div>
    </div>
  )
}
