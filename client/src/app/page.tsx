"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

const SUBJECTS = [
  { emoji: "🧮", label: "Mathematics", color: "from-violet-500/20 to-violet-500/5 border-violet-500/30", tag: "violet" },
  { emoji: "🔬", label: "Science",     color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",     tag: "cyan" },
  { emoji: "💻", label: "CS & Code",   color: "from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/30", tag: "fuchsia" },
]

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative max-w-3xl w-full text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wide font-small">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
          Season 1 is live — climb the leaderboard
        </div>

        {/* Hero */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight font-main">
          Learn fast.{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Compete harder.
          </span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed font-sub">
          Answer questions in Math, Science, and CS before the clock runs out.
          Every second counts. Every answer earns you rank.
        </p>

        {/* CTA */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {loading ? (
            <div className="h-11 w-36 bg-zinc-800 animate-pulse rounded-xl" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm transition shadow-lg shadow-violet-500/25 font-main"
            >
              Play Now →
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm transition shadow-lg shadow-violet-500/25 font-main"
              >
                Join Free →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white font-semibold text-sm transition font-sub"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {SUBJECTS.map(({ emoji, label, color }) => (
            <div
              key={label}
              className={`p-5 rounded-2xl border bg-gradient-to-b ${color} text-left space-y-2`}
            >
              <span className="text-3xl">{emoji}</span>
              <p className="text-white font-bold text-sm font-main">{label}</p>
              <p className="text-zinc-400 text-xs font-small">Race against the clock to answer before time runs out.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
