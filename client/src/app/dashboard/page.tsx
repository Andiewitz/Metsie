"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { GlassPanel } from "@/components/GlassPanel"
import { Play, Swords, Flame, Trophy, Sparkles, CheckCircle2, Shield, Zap } from "lucide-react"

interface GameMode {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  tag: string
  badgeColor: string
}

const GAME_MODES: GameMode[] = [
  {
    id: "ranked",
    title: "Ranked Competitive",
    subtitle: "3v3 Rapid Trivia Clash — ELO at stake",
    icon: <Trophy className="w-5 h-5 text-amber-300" />,
    tag: "POPULAR",
    badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
  },
  {
    id: "duel",
    title: "1v1 Deathmatch",
    subtitle: "High-stakes speed duel — First to 10 points",
    icon: <Swords className="w-5 h-5 text-rose-400" />,
    tag: "HARDCORE",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    id: "gauntlet",
    title: "Solo Gauntlet",
    subtitle: "Endless time-trial run — Beat the clock",
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
    tag: "WARMUP",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
]

const SUBJECTS = [
  { id: "math", name: "Mathematics", icon: "🧮" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "cs", name: "CS & Code", icon: "💻" },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [selectedMode, setSelectedMode] = useState("ranked")
  const [isSearching, setIsSearching] = useState(false)
  const [searchTime, setSearchTime] = useState(0)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  useEffect(() => {
    if (!isSearching) return

    const interval = setInterval(() => {
      setSearchTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSearching])

  const handleStartSearch = () => {
    setSearchTime(0)
    setIsSearching(true)
  }

  const handleCancelSearch = () => {
    setIsSearching(false)
    setSearchTime(0)
  }

  if (loading || !user) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
      </div>
    )
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-y-auto no-scrollbar">
      {/* ── TOP BAR INFO: Season & Player Stats ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Season pill */}
        <GlassPanel className="px-4 py-2 flex items-center gap-3 rounded-2xl" refractScale={1.03}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_8px_rgba(251,191,36,1)]" />
            <span className="text-xs font-black tracking-wider text-white uppercase font-main">
              Season 1 Live
            </span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-xs text-amber-200/90 font-bold font-sub">
            Sunset Arena Map
          </span>
        </GlassPanel>

        {/* Player competitive rank pill */}
        <GlassPanel className="px-5 py-2 flex items-center gap-4 rounded-2xl" refractScale={1.03} glow>
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <div>
              <p className="text-[10px] text-zinc-300 font-bold font-small uppercase tracking-widest leading-none">
                Competitive Rank
              </p>
              <p className="text-xs font-black text-white font-main mt-0.5">
                {user.profile?.role || "Gold III — 1,450 ELO"}
              </p>
            </div>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-rose-300 font-extrabold text-xs font-main">
            <Flame className="w-4 h-4 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span>3 Win Streak</span>
          </div>
        </GlassPanel>
      </div>

      {/* ── CENTER: Primary Matchmaking Glass Slab ── */}
      <div className="my-auto py-6 flex items-center justify-center">
        <GlassPanel
          className="w-full max-w-2xl p-6 sm:p-8 rounded-[32px] border border-white/30"
          refractScale={1.05}
          filterId="glass-refract-panel"
          glow
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase text-amber-300 tracking-wider font-small">
                <Sparkles className="w-3 h-3" />
                Battle Lobby
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-main tracking-tight mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Select Game Mode
              </h1>
            </div>

            {/* Subject indicators */}
            <div className="hidden sm:flex items-center gap-2">
              {SUBJECTS.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/30 border border-white/15 text-xs text-zinc-200 font-bold font-small shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                  title={sub.name}
                >
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
            {GAME_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`relative p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer overflow-hidden border ${
                    isSelected
                      ? "border-amber-300/80 bg-white/15 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.8),0_0_25px_rgba(251,191,36,0.3)] scale-[1.02]"
                      : "border-white/15 bg-black/25 hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-white/10 border border-white/20 shadow-sm">
                      {mode.icon}
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${mode.badgeColor} font-small`}
                    >
                      {mode.tag}
                    </span>
                  </div>

                  <p className="text-sm font-black text-white font-main leading-tight drop-shadow-sm">
                    {mode.title}
                  </p>
                  <p className="text-[11px] text-zinc-300/90 font-sub mt-1 leading-snug line-clamp-2">
                    {mode.subtitle}
                  </p>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Big Glass Matchmaking Action CTA */}
          <div className="pt-2">
            {!isSearching ? (
              <button
                onClick={handleStartSearch}
                className="w-full group/play relative py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-amber-500/90 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-lg font-main tracking-wider uppercase border border-amber-200/80 shadow-[inset_0_2px_2px_rgba(255,255,255,0.8),0_10px_35px_rgba(245,158,11,0.5)] hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),0_15px_45px_rgba(245,158,11,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-zinc-950 stroke-none group-hover/play:scale-110 transition-transform" />
                <span>FIND MATCH</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                  <div>
                    <p className="text-xs font-black text-white font-main uppercase tracking-wider">
                      Searching for Opponents...
                    </p>
                    <p className="text-[11px] text-amber-300 font-mono font-bold">
                      Queue Time: {formatTime(searchTime)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCancelSearch}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-300 hover:border-rose-400/40 border border-white/20 text-xs font-black font-main uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </GlassPanel>
      </div>

      {/* ── BOTTOM BAR: Active Queue Status & Leaderboard Preview ── */}
      <div className="flex items-center justify-between gap-4 text-xs font-sub text-zinc-300">
        <GlassPanel className="px-4 py-2.5 rounded-2xl flex items-center gap-3" refractScale={1.02}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
          <span className="font-bold text-white drop-shadow-sm font-sub">
            Matchmaking Server: <span className="text-amber-300 font-mono">1,248 Players Active</span>
          </span>
        </GlassPanel>

        <GlassPanel className="hidden sm:flex px-4 py-2.5 rounded-2xl items-center gap-4" refractScale={1.02}>
          <span className="font-extrabold text-amber-200 uppercase tracking-wider text-[10px] font-small">
            Daily Leaderboard #1:
          </span>
          <span className="font-black text-white font-main">K3v1n (2,410 ELO)</span>
        </GlassPanel>
      </div>
    </div>
  )
}
