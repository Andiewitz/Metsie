"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Zap, Trophy, Flame, BookOpen } from "lucide-react"

const SUBJECTS = [
  {
    emoji: "🧮",
    label: "Mathematics",
    sub: "Algebra · Calculus · Geometry",
    difficulty: "Medium",
    diffColor: "text-amber-400",
    bg: "from-violet-600/20 via-violet-600/5 to-transparent",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
    href: "#",
  },
  {
    emoji: "🔬",
    label: "Science",
    sub: "Physics · Chemistry · Biology",
    difficulty: "Hard",
    diffColor: "text-red-400",
    bg: "from-cyan-600/20 via-cyan-600/5 to-transparent",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
    href: "#",
  },
  {
    emoji: "💻",
    label: "CS & Code",
    sub: "Algorithms · Theory · Systems",
    difficulty: "Hard",
    diffColor: "text-red-400",
    bg: "from-fuchsia-600/20 via-fuchsia-600/5 to-transparent",
    border: "border-fuchsia-500/30",
    glow: "shadow-fuchsia-500/20",
    href: "#",
  },
]

const HUD_STATS = [
  { icon: Trophy,   value: "#—",  label: "Rank",   color: "text-amber-400" },
  { icon: Flame,    value: "0",   label: "Streak", color: "text-orange-400" },
  { icon: Zap,      value: "0",   label: "Score",  color: "text-violet-400" },
  { icon: BookOpen, value: "0",   label: "Games",  color: "text-cyan-400" },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Full-screen ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-violet-700/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-fuchsia-700/8 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-cyan-700/6 blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ── HUD Stats — top corners ─────────────────────────────────────── */}
      <div className="relative z-10 flex justify-between items-start px-8 pt-6 pointer-events-none">
        <div className="flex gap-4">
          {HUD_STATS.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-lg font-extrabold text-white font-main leading-none">{value}</span>
              <span className="text-[10px] text-zinc-500 font-small uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* Player greeting top-right */}
        <div className="text-right">
          <p className="text-xs text-zinc-500 font-small">Welcome back</p>
          <p className="text-sm font-bold text-white font-main">
            {user.profile?.full_name?.split(" ")[0] || user.username}
          </p>
          {!user.profile?.is_onboarded && (
            <Link
              href="/account-setup"
              className="text-[10px] text-violet-400 hover:text-violet-300 font-small underline"
            >
              Complete profile →
            </Link>
          )}
        </div>
      </div>

      {/* ── Main: Subject pick ──────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center">
          <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase font-small mb-2">Choose a subject</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-main">
            Pick your battleground
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full max-w-3xl">
          {SUBJECTS.map(({ emoji, label, sub, difficulty, diffColor, bg, border, glow, href }) => (
            <Link
              key={label}
              href={href}
              className={`
                group flex-1 relative overflow-hidden rounded-2xl border ${border}
                bg-gradient-to-b ${bg} backdrop-blur
                shadow-xl ${glow}
                hover:scale-[1.03] hover:shadow-2xl
                transition-all duration-200
                p-6 flex flex-col gap-3 cursor-pointer
              `}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{emoji}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider font-small ${diffColor}`}>
                  {difficulty}
                </span>
              </div>
              <div>
                <p className="text-base font-extrabold text-white font-main">{label}</p>
                <p className="text-xs text-zinc-400 font-small mt-0.5">{sub}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-small">~60 sec / question</span>
                <span className="text-xs font-bold text-violet-400 group-hover:text-violet-300 font-sub transition">
                  Play →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
