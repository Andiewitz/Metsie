"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Zap, Trophy, Flame, BookOpen } from "lucide-react"

const SUBJECTS = [
  {
    emoji: "🧮",
    label: "Mathematics",
    description: "Algebra, calculus, geometry & more",
    difficulty: "Medium",
    diffColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    href: "#",
    gradient: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-500/20 hover:border-violet-500/40",
  },
  {
    emoji: "🔬",
    label: "Science",
    description: "Physics, chemistry, biology",
    difficulty: "Hard",
    diffColor: "text-red-400 bg-red-500/10 border-red-500/20",
    href: "#",
    gradient: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
  },
  {
    emoji: "💻",
    label: "CS & Code",
    description: "Algorithms, data structures, theory",
    difficulty: "Hard",
    diffColor: "text-red-400 bg-red-500/10 border-red-500/20",
    href: "#",
    gradient: "from-fuchsia-500/10 to-fuchsia-500/5",
    border: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
  },
]

const STATS = [
  { icon: Trophy,   label: "Rank",   value: "#—",   sub: "not yet ranked",    color: "text-amber-400" },
  { icon: Flame,    label: "Streak", value: "0",    sub: "days in a row",     color: "text-orange-400" },
  { icon: Zap,      label: "Score",  value: "0",    sub: "total points",      color: "text-violet-400" },
  { icon: BookOpen, label: "Games",  value: "0",    sub: "matches played",    color: "text-cyan-400" },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-main">
            Hey, {user.profile?.full_name?.split(" ")[0] || user.username} 👋
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5 font-sub">
            Pick a subject and beat the clock.
          </p>
        </div>
        {!user.profile?.is_onboarded && (
          <Button asChild size="sm" variant="secondary">
            <Link href="/account-setup">Complete Profile</Link>
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, label, value, sub, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-zinc-800 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white font-main">{value}</p>
                <p className="text-[11px] text-zinc-500 font-small">{sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Subject cards */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 mb-3 font-small uppercase tracking-wider">Choose a Subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SUBJECTS.map(({ emoji, label, description, difficulty, diffColor, href, gradient, border }) => (
            <Link key={label} href={href}>
              <Card className={`group cursor-pointer transition-all duration-200 bg-gradient-to-b ${gradient} ${border} hover:scale-[1.02]`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{emoji}</span>
                    <Badge className={`text-[10px] border font-small ${diffColor}`} variant="outline">
                      {difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-extrabold text-white font-main">{label}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-zinc-400 font-small">{description}</p>
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-violet-400 group-hover:underline font-sub">
                      Play now →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
