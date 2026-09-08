"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Users, Wifi } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PlayerProfile {
  id: string
  name: string
  avatar: string
  status: "in-game" | "online" | "away"
  activity?: string
  rank?: string
  color: string
}

const MOCK_PLAYERS: PlayerProfile[] = [
  { id: "1", name: "K3v1n", avatar: "⚡", status: "in-game", activity: "Math Blitz - Round 4", rank: "Diamond", color: "bg-emerald-500" },
  { id: "2", name: "Nova_X", avatar: "🎯", status: "in-game", activity: "Science Sprint", rank: "Master", color: "bg-emerald-500" },
  { id: "3", name: "ByteCoder", avatar: "💻", status: "online", activity: "In Lobby", rank: "Platinum", color: "bg-blue-500" },
  { id: "4", name: "Aria_99", avatar: "🔮", status: "online", activity: "Main Menu", rank: "Gold", color: "bg-blue-500" },
  { id: "5", name: "ZeroCool", avatar: "🎲", status: "away", activity: "AFK", rank: "Silver", color: "bg-zinc-500" },
  { id: "6", name: "Ph4ntom", avatar: "🐱", status: "in-game", activity: "CS Algorithms", rank: "Challenger", color: "bg-emerald-500" },
  { id: "7", name: "Viper", avatar: "🐍", status: "online", activity: "In Lobby", rank: "Gold", color: "bg-blue-500" },
  { id: "8", name: "Echo", avatar: "📡", status: "away", activity: "Away", rank: "Bronze", color: "bg-zinc-500" },
]

export function ProfileSidebar() {
  const { user } = useAuth()
  const userInitials = user?.username?.slice(0, 2).toUpperCase() ?? "ME"

  return (
    <aside className="w-14 shrink-0 border-l border-white/5 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center py-2.5 z-40 select-none">
      <TooltipProvider delayDuration={100}>
        {/* Top: Friends header icon with counter badge */}
        <div className="relative mb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center justify-center w-10 h-10 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition">
                <Users className="h-4 w-4" />
                <span className="text-[9px] font-bold text-emerald-400 leading-none mt-0.5 font-small">
                  {MOCK_PLAYERS.filter(p => p.status !== "away").length + 1}
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
        <div className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto no-scrollbar py-1">
          {/* Current User */}
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="w-9 h-9 rounded-md bg-gradient-to-tr from-violet-600 to-fuchsia-600 border border-violet-400/50 flex items-center justify-center text-xs font-black text-white shadow-sm shadow-violet-500/30 group-hover:scale-105 transition">
                    {userInitials}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-sub space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span>{user.username}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">● In Lobby</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-small">{user.email}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Player avatars */}
          {MOCK_PLAYERS.map((player) => (
            <Tooltip key={player.id}>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="w-9 h-9 rounded-md bg-zinc-900/90 border border-white/10 flex items-center justify-center text-sm group-hover:border-zinc-500 group-hover:scale-105 transition">
                    {player.avatar}
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
              <button className="flex flex-col items-center justify-center w-8 h-8 rounded text-zinc-500 hover:text-zinc-300 transition">
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
