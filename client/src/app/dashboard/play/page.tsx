"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Globe, Clock, Check, Play, Loader2 } from "lucide-react"

interface SubjectMap {
  id: string
  name: string
  category: string
  waitTime: string
  bgGradient: string
  badgeColor: string
  badgeBg: string
  emblemIcon: React.ReactNode
  iconLetter: string
}

const SUBJECT_MAPS: SubjectMap[] = [
  // ── Row 1 (5 Maps) ──
  {
    id: "math",
    name: "Mathematics",
    category: "CALCULUS & ALGEBRA",
    waitTime: "01:40",
    bgGradient: "from-amber-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-amber-400 border-amber-400/40",
    badgeBg: "from-amber-500/20 to-amber-950/40",
    iconLetter: "∑",
    emblemIcon: (
      <svg className="w-12 h-12 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16l-8 8 8 8H4" />
        <path d="M12 12h4" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "physics",
    name: "Physics",
    category: "MECHANICS & QUANTUM",
    waitTime: "02:56",
    bgGradient: "from-cyan-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-cyan-400 border-cyan-400/40",
    badgeBg: "from-cyan-500/20 to-cyan-950/40",
    iconLetter: "⚛",
    emblemIcon: (
      <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "cs",
    name: "Computer Science",
    category: "ALGORITHMS & SYSTEMS",
    waitTime: "02:26",
    bgGradient: "from-violet-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-violet-400 border-violet-400/40",
    badgeBg: "from-violet-500/20 to-violet-950/40",
    iconLetter: "💻",
    emblemIcon: (
      <svg className="w-12 h-12 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 20h10" />
        <path d="M12 16v4" />
        <path d="M7 8l3 3-3 3" strokeWidth="2" />
        <path d="M12 14h4" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "chemistry",
    name: "Chemistry",
    category: "ORGANIC & MOLECULAR",
    waitTime: "02:30",
    bgGradient: "from-emerald-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-emerald-400 border-emerald-400/40",
    badgeBg: "from-emerald-500/20 to-emerald-950/40",
    iconLetter: "🧪",
    emblemIcon: (
      <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 2v7.31L4.68 18.2A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.72-2.8L14 9.31V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
        <circle cx="10" cy="18.5" r="0.8" fill="currentColor" />
        <circle cx="14" cy="18" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "biology",
    name: "Biology",
    category: "GENETICS & PHYSIOLOGY",
    waitTime: "01:51",
    bgGradient: "from-rose-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-rose-400 border-rose-400/40",
    badgeBg: "from-rose-500/20 to-rose-950/40",
    iconLetter: "🧬",
    emblemIcon: (
      <svg className="w-12 h-12 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4.5 9a7.5 7.5 0 0 0 15 0" />
        <path d="M4.5 15a7.5 7.5 0 0 1 15 0" />
        <path d="M7 6l10 12" />
        <path d="M17 6L7 18" />
      </svg>
    ),
  },

  // ── Row 2 (4 Maps) ──
  {
    id: "astronomy",
    name: "Astronomy",
    category: "ASTROPHYSICS & ORBITS",
    waitTime: "02:04",
    bgGradient: "from-blue-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-blue-400 border-blue-400/40",
    badgeBg: "from-blue-500/20 to-blue-950/40",
    iconLetter: "🪐",
    emblemIcon: (
      <svg className="w-12 h-12 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="6" />
        <ellipse cx="12" cy="12" rx="11" ry="3.5" transform="rotate(-25 12 12)" />
      </svg>
    ),
  },
  {
    id: "logic",
    name: "Logic & Discrete",
    category: "PROOF & SET THEORY",
    waitTime: "03:20",
    bgGradient: "from-teal-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-teal-400 border-teal-400/40",
    badgeBg: "from-teal-500/20 to-teal-950/40",
    iconLetter: "∧",
    emblemIcon: (
      <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12,3 22,21 2,21" />
        <circle cx="12" cy="15" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "algorithms",
    name: "Algorithms",
    category: "GRAPH THEORY & COMPLEXITY",
    waitTime: "01:50",
    bgGradient: "from-fuchsia-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-fuchsia-400 border-fuchsia-400/40",
    badgeBg: "from-fuchsia-500/20 to-fuchsia-950/40",
    iconLetter: "⇄",
    emblemIcon: (
      <svg className="w-12 h-12 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path d="M8.5 7.5l5 7" />
        <path d="M15.5 7.5l-5 7" />
        <path d="M9 6h6" />
      </svg>
    ),
  },
  {
    id: "history",
    name: "World History",
    category: "CIVILIZATIONS & ERAS",
    waitTime: "02:24",
    bgGradient: "from-stone-950/40 via-zinc-900/80 to-zinc-950",
    badgeColor: "text-orange-400 border-orange-400/40",
    badgeBg: "from-orange-500/20 to-stone-950/40",
    iconLetter: "🏛",
    emblemIcon: (
      <svg className="w-12 h-12 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 21h16" />
        <path d="M4 10h16" />
        <path d="M12 2L4 6v4h16V6l-8-4z" />
        <path d="M6 10v7" />
        <path d="M10 10v7" />
        <path d="M14 10v7" />
        <path d="M18 10v7" />
        <path d="M2 21h20" />
      </svg>
    ),
  },
]

const SUB_MODES = [
  "PREMIER",
  "COMPETITIVE",
  "WINGMAN",
  "CASUAL",
  "DEATHMATCH",
  "PRIVATE MATCHMAKING",
]

export default function PlayPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Track multi-selected maps/subjects (default: math, physics, cs selected)
  const [selectedMapIds, setSelectedMapIds] = useState<string[]>([
    "math",
    "physics",
    "cs",
  ])
  const [activeSubMode, setActiveSubMode] = useState("COMPETITIVE")
  const [isMatchmaking, setIsMatchmaking] = useState(false)
  const [queueTime, setQueueTime] = useState(0)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  useEffect(() => {
    if (!isMatchmaking) return
    const interval = setInterval(() => {
      setQueueTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isMatchmaking])

  const toggleMap = (id: string) => {
    setSelectedMapIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleStartMatchmaking = () => {
    if (selectedMapIds.length === 0) return
    setQueueTime(0)
    setIsMatchmaking(true)
  }

  const handleCancelMatchmaking = () => {
    setIsMatchmaking(false)
    setQueueTime(0)
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`
  }

  if (loading || !user) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* ── TOP: CS2 Mode Sub-Header (Sharp Edges) ─────────────────────────── */}
      <div className="shrink-0 flex flex-col items-center gap-1.5 pt-2 pb-1.5 px-4 sm:px-6">
        {/* Row 1: Primary Mode Buttons */}
        <div className="flex items-center gap-1.5">
          <button className="px-5 py-1 border border-cyan-400/80 bg-cyan-500/20 text-cyan-300 text-[11px] font-black tracking-widest uppercase font-small shadow-[0_0_12px_rgba(34,211,238,0.3)] cursor-pointer">
            MATCHMAKING
          </button>
          <button className="px-5 py-1 border border-white/10 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 text-[11px] font-black tracking-widest uppercase font-small transition cursor-pointer">
            PRACTICE
          </button>
          <button
            className="p-1 border border-white/10 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            title="Server Region: US East"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 2: CS2 Match Type Tabs */}
        <div className="flex items-center gap-4 sm:gap-7 overflow-x-auto no-scrollbar max-w-full pb-0.5">
          {SUB_MODES.map((mode) => {
            const isActive = activeSubMode === mode
            return (
              <button
                key={mode}
                onClick={() => setActiveSubMode(mode)}
                className={`relative py-0.5 text-[10px] font-black tracking-widest uppercase transition font-small cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {mode}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── CENTER: CS2 9-Map Grid — fills all remaining space ─────────────── */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 py-1 px-4 sm:px-6">
        {/* Row 1: 5 Map Cards — each row given flex-based height */}
        <div className="grid grid-cols-5 gap-2 w-full max-w-6xl flex-1 min-h-0">
          {SUBJECT_MAPS.slice(0, 5).map((subject) => {
            const isSelected = selectedMapIds.includes(subject.id)
            return (
              <MapCard
                key={subject.id}
                subject={subject}
                isSelected={isSelected}
                onToggle={() => toggleMap(subject.id)}
              />
            )
          })}
        </div>

        {/* Row 2: 4 Map Cards (Centered) */}
        <div className="grid grid-cols-4 gap-2 w-4/5 max-w-5xl flex-1 min-h-0">
          {SUBJECT_MAPS.slice(5, 9).map((subject) => {
            const isSelected = selectedMapIds.includes(subject.id)
            return (
              <MapCard
                key={subject.id}
                subject={subject}
                isSelected={isSelected}
                onToggle={() => toggleMap(subject.id)}
              />
            )
          })}
        </div>
      </div>

      {/* ── BOTTOM: CS2 Matchmaking Action Bar ── */}
      <div className={`relative shrink-0 w-full border-t transition-all duration-300 overflow-hidden ${
        isMatchmaking
          ? "border-emerald-500/60 bg-zinc-950/90 shadow-[0_-8px_30px_rgba(16,185,129,0.3)]"
          : "border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-[0_-4px_25px_rgba(0,0,0,0.5)]"
      }`}>
        {isMatchmaking && <MatrixRain />}

        <div className="relative z-10 w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 ${isMatchmaking ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)] animate-ping" : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"}`} />
              <span className="text-xs font-black text-white font-main uppercase tracking-widest">
                {isMatchmaking ? "CONFIRMING MATCHMAKING QUEUE" : `${selectedMapIds.length} ${selectedMapIds.length === 1 ? "Subject" : "Subjects"} Selected`}
              </span>
            </div>
            <span className="text-zinc-600 text-xs">|</span>
            <span className="text-xs text-zinc-300 font-sub hidden sm:inline">
              Est. wait: <span className="text-amber-300 font-mono font-bold">~01:45</span>
            </span>
          </div>

          {!isMatchmaking ? (
            <button
              onClick={handleStartMatchmaking}
              disabled={selectedMapIds.length === 0}
              className="px-10 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-black text-sm font-main tracking-widest uppercase border border-emerald-300/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_6px_20px_rgba(16,185,129,0.5)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-zinc-950 stroke-none" />
              <span>START MATCHMAKING</span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-sm font-black text-emerald-300 font-main tracking-widest uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                  SEARCHING... ({formatTime(queueTime)})
                </span>
              </div>
              <button
                onClick={handleCancelMatchmaking}
                className="px-5 py-2 border border-rose-500/50 bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 text-xs font-black font-main uppercase tracking-widest transition cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Matrix Rain Digital Animation Canvas for Active Queue
 */
function MatrixRain() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const characters = "0123456789ABCDEF∑⚛λπΩ≈≠√∫∆∇ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const fontSize = 13
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = "rgba(9, 9, 11, 0.22)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#34d399"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.96) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
    />
  )
}

/**
 * Single Map Card — Sharp edges, scales to fill available row height
 */
function MapCard({
  subject,
  isSelected,
  onToggle,
}: {
  subject: SubjectMap
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`group/card relative p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-200 ${
        isSelected
          ? "border-2 border-cyan-400 bg-cyan-950/20 shadow-[0_0_22px_rgba(34,211,238,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] brightness-110"
          : "border border-white/15 bg-black/40 hover:border-white/40 shadow-lg hover:brightness-105"
      }`}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${subject.bgGradient} opacity-90 -z-20`} />
      <div className="absolute inset-0 bg-black/40 -z-10" />
      <div className="absolute inset-0 backdrop-blur-sm -z-10" />

      {/* TOP: badge + checkbox */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="w-4 h-4 bg-amber-400 border border-amber-300 flex items-center justify-center text-zinc-950 font-black text-[9px]">
          <span className="leading-none">{subject.iconLetter}</span>
        </div>
        <div
          className={`w-4 h-4 border flex items-center justify-center transition-colors ${
            isSelected
              ? "border-cyan-400 bg-cyan-500 text-zinc-950 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
              : "border-white/30 bg-black/50 group-hover/card:border-white/60"
          }`}
        >
          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>

      {/* CENTER: Emblem */}
      <div className="relative z-10 flex flex-col items-center my-auto py-1">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 border-2 bg-gradient-to-b ${subject.badgeBg} ${subject.badgeColor} flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover/card:scale-105 transition-transform duration-200`}
        >
          <div className="[&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-9 sm:[&>svg]:h-9">
            {subject.emblemIcon}
          </div>
        </div>
        <div className="mt-1.5 px-2.5 py-px bg-black/70 border border-white/20 text-[9px] font-black text-zinc-400 font-mono tracking-wider">
          ?
        </div>
      </div>

      {/* BOTTOM: Name + wait time */}
      <div className="relative z-10 text-center pt-1.5 border-t border-white/10">
        <h3 className="text-[10px] sm:text-xs font-black text-white font-main tracking-wider truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] uppercase">
          {subject.name}
        </h3>
        <p className="text-[9px] text-zinc-400 font-small flex items-center justify-center gap-0.5 mt-0.5">
          <Clock className="w-2 h-2" />
          <span>{subject.waitTime}</span>
        </p>
      </div>
    </div>
  )
}

