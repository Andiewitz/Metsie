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

// Online players list — ready to be populated by real-time lobby/matchmaking backend
const ONLINE_PLAYERS: PlayerProfile[] = []

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
    <aside className="group/sidebar fixed top-0 right-0 bottom-0 w-16 hover:w-64 transition-all duration-300 ease-out shrink-0 backdrop-blur-2xl bg-zinc-950/75 border-l border-white/10 shadow-[-10px_0_35px_rgba(0,0,0,0.6)] flex flex-col z-50 select-none overflow-hidden">
      {/* ── TOP: Player's Profile (Sitting at the exact same height as the top header: h-12) ── */}
      <div className="h-12 shrink-0 flex items-center px-2.5 border-b border-white/10 bg-zinc-950/40">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 w-full p-1 rounded-xl hover:bg-white/10 transition group/user"
          title="Profile Settings"
        >
          {/* Avatar with glowing border */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-300/80 bg-black/50 flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.35)] group-hover/user:scale-105 group-hover/user:border-amber-200 transition [&>svg]:w-full [&>svg]:h-full">
              {getAvatarSvg(userAvatarId)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black/90 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          </div>

          {/* Revealed on sidebar hover */}
          {user && (
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 min-w-0 overflow-hidden whitespace-nowrap">
              <p className="text-xs font-black text-white truncate font-main leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {user.profile?.full_name || user.username}
              </p>
              <p className="text-[10px] text-emerald-300 font-small font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                In Lobby
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* ── SUB-HEADER: Lobby & Friends ── */}
      <div className="shrink-0 pt-2 px-3">
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
          <p className="text-[10px] font-black text-amber-300/90 uppercase tracking-widest font-main">
            Lobby & Friends
          </p>
        </div>
      </div>

      {/* ── SPACER ── */}
      <div className="flex-1" />

      {/* ── BOTTOM: Players Online List ── */}
      <div className="relative z-10 mt-auto flex flex-col gap-1.5 shrink-0">
        {/* Section title (revealed on hover) */}
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 px-1 mb-1 whitespace-nowrap overflow-hidden">
          <span className="text-[10px] font-extrabold text-amber-200/90 font-small tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Players Online ({ONLINE_PLAYERS.length})
          </span>
        </div>

        {/* List of players or clean empty state */}
        <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto no-scrollbar">
          {ONLINE_PLAYERS.length === 0 ? (
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 px-2.5 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <p className="text-[11px] text-zinc-200 font-bold font-sub">No other players online</p>
              <p className="text-[9px] text-zinc-400 font-small mt-0.5">Lobby ready for matchmaking</p>
            </div>
          ) : (
            ONLINE_PLAYERS.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                {/* Circular preset avatar */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-black/40 flex items-center justify-center transition [&>svg]:w-full [&>svg]:h-full shadow-sm">
                    {getAvatarSvg(player.avatarId)}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${player.color}`}
                  />
                </div>

                {/* Revealed on hover */}
                <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 min-w-0 overflow-hidden whitespace-nowrap flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-bold text-white truncate font-sub drop-shadow-sm">{player.name}</span>
                    <span className="text-[9px] text-zinc-300 font-small shrink-0">{player.rank}</span>
                  </div>
                  <p className="text-[10px] text-emerald-300 font-small truncate">{player.activity}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom ping/server status */}
        <div className="pt-2 mt-1 border-t border-white/10 flex items-center gap-2.5 px-1.5 text-zinc-300">
          <Wifi className="h-3.5 w-3.5 text-emerald-400 shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] text-zinc-200 font-mono font-bold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap drop-shadow-sm">
            18ms · US East
          </span>
        </div>
      </div>
    </aside>
  )
}
