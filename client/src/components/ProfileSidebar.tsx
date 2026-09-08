"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Wifi } from "lucide-react"
import { avatars } from "@/components/ui/avatar-picker"

interface PlayerProfile {
  id: string
  name: string
  avatarId: number
  status: "in-game" | "online" | "away"
  activity: string
  rank: string
  color: string
}

const MOCK_PLAYERS: PlayerProfile[] = [
  { id: "1", name: "K3v1n", avatarId: 2, status: "in-game", activity: "Math Blitz · R4", rank: "Diamond", color: "bg-emerald-400" },
  { id: "2", name: "Nova_X", avatarId: 4, status: "in-game", activity: "Science Sprint", rank: "Master", color: "bg-emerald-400" },
  { id: "3", name: "ByteCoder", avatarId: 3, status: "online", activity: "In Lobby", rank: "Platinum", color: "bg-blue-400" },
  { id: "4", name: "Aria_99", avatarId: 1, status: "online", activity: "Main Menu", rank: "Gold", color: "bg-blue-400" },
  { id: "5", name: "ZeroCool", avatarId: 2, status: "away", activity: "AFK", rank: "Silver", color: "bg-zinc-400" },
  { id: "6", name: "Ph4ntom", avatarId: 4, status: "in-game", activity: "Algorithms", rank: "Challenger", color: "bg-emerald-400" },
  { id: "7", name: "Viper", avatarId: 3, status: "online", activity: "In Lobby", rank: "Gold", color: "bg-blue-400" },
  { id: "8", name: "Echo", avatarId: 1, status: "away", activity: "Away", rank: "Bronze", color: "bg-zinc-400" },
]

export function ProfileSidebar() {
  const { user } = useAuth()
  const [userAvatarId, setUserAvatarId] = useState(1)

  useEffect(() => {
    const syncAvatar = () => {
      const saved = localStorage.getItem("metsie_avatar_id")
      if (saved) {
        setUserAvatarId(Number(saved))
      }
    }
    syncAvatar()
    window.addEventListener("metsie_avatar_changed", syncAvatar)
    return () => window.removeEventListener("metsie_avatar_changed", syncAvatar)
  }, [])

  const getAvatarSvg = (avatarId: number) => {
    const found = avatars.find((a) => a.id === avatarId) || avatars[0]
    return found.svg
  }

  return (
    <aside className="group/sidebar w-16 hover:w-64 transition-all duration-300 ease-in-out shrink-0 border-l border-white/5 bg-zinc-950/80 hover:bg-zinc-950/95 backdrop-blur-md flex flex-col py-3 px-2 z-40 select-none overflow-hidden">
      {/* ── TOP: Player's profile (slightly larger, at the very top) ── */}
      {user && (
        <div className="shrink-0 mb-3">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-white/5 transition group/user"
            title="Profile Settings"
          >
            {/* Slightly larger circular avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-violet-400/80 bg-zinc-900 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover/user:scale-105 group-hover/user:border-violet-300 transition [&>svg]:w-full [&>svg]:h-full">
                {getAvatarSvg(userAvatarId)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-zinc-950" />
            </div>

            {/* Revealed on hover */}
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 min-w-0 overflow-hidden whitespace-nowrap">
              <p className="text-xs font-bold text-white truncate font-main leading-tight">
                {user.profile?.full_name || user.username}
              </p>
              <p className="text-[10px] text-emerald-400 font-small font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                In Lobby
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Subtle top divider */}
      <div className="w-full h-px bg-white/5 mb-2 shrink-0" />

      {/* ── SPACER: Pushes the online players list to the bottom ── */}
      <div className="flex-1" />

      {/* ── BOTTOM: Players Online List ── */}
      <div className="mt-auto flex flex-col gap-1.5 shrink-0">
        {/* Section title (revealed on hover) */}
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 px-1 mb-1 whitespace-nowrap overflow-hidden">
          <span className="text-[10px] font-bold text-zinc-500 font-small tracking-wider uppercase">
            Players Online ({MOCK_PLAYERS.length})
          </span>
        </div>

        {/* List of players */}
        <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto no-scrollbar">
          {MOCK_PLAYERS.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition cursor-pointer"
            >
              {/* Circular preset avatar */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center transition [&>svg]:w-full [&>svg]:h-full">
                  {getAvatarSvg(player.avatarId)}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${player.color}`}
                />
              </div>

              {/* Revealed on hover */}
              <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 min-w-0 overflow-hidden whitespace-nowrap flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-semibold text-zinc-200 truncate font-sub">{player.name}</span>
                  <span className="text-[9px] text-zinc-500 font-small shrink-0">{player.rank}</span>
                </div>
                <p className="text-[10px] text-emerald-400/90 font-small truncate">{player.activity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom ping/server status */}
        <div className="pt-2 mt-1 border-t border-white/5 flex items-center gap-2.5 px-1.5 text-zinc-500">
          <Wifi className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span className="text-[10px] text-zinc-500 font-mono opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            18ms · US East
          </span>
        </div>
      </div>
    </aside>
  )
}
