"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Users, Wifi } from "lucide-react"
import { avatars } from "@/components/ui/avatar-picker"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PlayerProfile {
  id: string
  name: string
  avatarId: number
  status: "in-game" | "online" | "away"
  activity?: string
  rank?: string
  color: string
}

const MOCK_PLAYERS: PlayerProfile[] = [
  { id: "1", name: "K3v1n", avatarId: 2, status: "in-game", activity: "Math Blitz - Round 4", rank: "Diamond", color: "bg-emerald-400" },
  { id: "2", name: "Nova_X", avatarId: 4, status: "in-game", activity: "Science Sprint", rank: "Master", color: "bg-emerald-400" },
  { id: "3", name: "ByteCoder", avatarId: 3, status: "online", activity: "In Lobby", rank: "Platinum", color: "bg-blue-400" },
  { id: "4", name: "Aria_99", avatarId: 1, status: "online", activity: "Main Menu", rank: "Gold", color: "bg-blue-400" },
  { id: "5", name: "ZeroCool", avatarId: 2, status: "away", activity: "AFK", rank: "Silver", color: "bg-zinc-400" },
  { id: "6", name: "Ph4ntom", avatarId: 4, status: "in-game", activity: "CS Algorithms", rank: "Challenger", color: "bg-emerald-400" },
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
    <aside className="w-14 shrink-0 border-l border-white/5 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center py-2.5 z-40 select-none">
      <TooltipProvider delayDuration={100}>
        {/* Top: Friends header icon with counter badge */}
        <div className="relative mb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center justify-center w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition">
                <Users className="h-4 w-4" />
                <span className="text-[9px] font-bold text-emerald-400 leading-none mt-0.5 font-small">
                  {MOCK_PLAYERS.filter((p) => p.status !== "away").length + 1}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-sub text-xs">
              Friends & Players ({MOCK_PLAYERS.length + 1} total)
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-8 h-px bg-white/10 mb-2" />

        {/* Scrollable list of profile avatars */}
        <div className="flex-1 w-full flex flex-col items-center gap-2.5 overflow-y-auto no-scrollbar py-1">
          {/* Current User */}
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/settings" className="relative group cursor-pointer block">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet-400/70 bg-zinc-900 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 group-hover:border-violet-300 transition [&>svg]:w-full [&>svg]:h-full">
                    {getAvatarSvg(userAvatarId)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-sub space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span>{user.profile?.full_name || user.username}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">● In Lobby</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-small">{user.email}</p>
                <p className="text-[10px] text-violet-400 font-small">Click to edit profile & avatar</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Player avatars */}
          {MOCK_PLAYERS.map((player) => (
            <Tooltip key={player.id}>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center group-hover:border-zinc-400 group-hover:scale-105 transition [&>svg]:w-full [&>svg]:h-full">
                    {getAvatarSvg(player.avatarId)}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${player.color}`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-sub space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-white text-xs">{player.name}</span>
                  <span className="text-[10px] text-zinc-400 font-small font-medium">{player.rank}</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-small">{player.activity}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="w-8 h-px bg-white/10 my-2" />

        {/* Bottom utility icons: Antenna (ping/server) and Audio */}
        <div className="flex flex-col items-center gap-1.5 text-zinc-500">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center justify-center w-8 h-8 rounded-full text-zinc-500 hover:text-zinc-300 transition">
                <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[8px] text-zinc-500 font-mono leading-none mt-0.5">18ms</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-small text-xs">
              Server Ping: 18ms (Optimal)
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  )
}
