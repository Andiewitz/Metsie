"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { apiFetch, ApiError } from "@/lib/api"
import { AvatarPicker } from "@/components/ui/avatar-picker"
import { X, Check, Save, User, Sparkles } from "lucide-react"

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading, setupAccount } = useAuth()

  const [fullName, setFullName] = useState(user?.profile?.full_name || "")
  const [role, setRole] = useState(user?.profile?.role || "")
  const [bio, setBio] = useState(user?.profile?.bio || "")
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user?.profile) {
      Promise.resolve().then(() => {
        setFullName((prev) => prev || user.profile?.full_name || "")
        setRole((prev) => prev || user.profile?.role || "")
        setBio((prev) => prev || user.profile?.bio || "")
      })
    } else if (user) {
      apiFetch<{ full_name?: string; role?: string; bio?: string }>("/api/auth/account-setup/")
        .then((data) => {
          if (data.full_name) setFullName(data.full_name)
          if (data.role) setRole(data.role)
          if (data.bio) setBio(data.bio)
        })
        .catch(() => {})
    }
  }, [user, authLoading, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaveSuccess(false)

    try {
      await setupAccount({
        full_name: fullName,
        role,
        bio,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to save profile settings.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/40 overflow-y-auto animate-in fade-in-0 duration-200">
      {/* Frosted Glass Settings Slab */}
      <div className="relative w-full max-w-4xl rounded-[32px] backdrop-blur-2xl bg-zinc-950/75 border border-white/15 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.25),0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col my-auto isolation-auto">

        {/* Modal Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/15 bg-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-black text-white font-main leading-tight drop-shadow-sm">
                Profile Settings
              </h1>
              <p className="text-xs text-zinc-300 font-small">
                Customize your avatar, gamer tag, and competition bio
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>

        {/* Content Body: Avatar Picker on Left, Profile Details on Right */}
        <div className="relative z-10 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Avatar Picker */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <AvatarPicker
              displayName={fullName.trim() || user?.username || "Player"}
            />
          </div>

          {/* Right: Profile Info Form */}
          <form onSubmit={handleSave} className="lg:col-span-6 flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-small">
                {error}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-small flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <Check className="h-4 w-4 shrink-0" />
                Profile changes saved successfully!
              </div>
            )}

            {/* Username / Gamer Tag (Permanent) */}
            <div>
              <label className="block text-xs font-extrabold text-amber-200/90 mb-1.5 font-small uppercase tracking-wider drop-shadow-sm">
                Username / Gamer Tag
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-zinc-300 text-sm font-sub shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]">
                <User className="h-4 w-4 text-zinc-400" />
                <span className="font-bold">{user?.username ?? "—"}</span>
                <span className="ml-auto text-[10px] text-zinc-400 uppercase font-mono">Permanent</span>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-extrabold text-white mb-1.5 font-small uppercase tracking-wider drop-shadow-sm">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. ShadowRacer, Alex"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-transparent transition font-sub shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Title / Role */}
            <div>
              <label className="block text-xs font-extrabold text-white mb-1.5 font-small uppercase tracking-wider drop-shadow-sm">
                Competitive Title / Rank
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Science Wizard, Math Blitz Champion"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-transparent transition font-sub shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-extrabold text-white mb-1.5 font-small uppercase tracking-wider drop-shadow-sm">
                Gamer Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell rivals about your speed and favorite subjects..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-transparent transition font-sub resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl border border-white/20 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-black transition font-main cursor-pointer"
              >
                Back to Lobby
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-zinc-950 font-black text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_25px_rgba(245,158,11,0.4)] transition font-main cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
