"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

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
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Cinematic ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 pointer-events-none" />

      {/* Ambient lighting & radial backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-violet-600/[0.04] blur-[140px]" />
        <div className="w-[400px] h-[400px] rounded-full bg-fuchsia-600/[0.03] blur-[100px]" />
      </div>

      {/* Subtle floor vignette / grid reflection */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </div>
  )
}
