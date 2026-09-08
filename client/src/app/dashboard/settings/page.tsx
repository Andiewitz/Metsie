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

    // If profile was loaded asynchronously and fields are still empty, populate them
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
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-zinc-950/40 backdrop-blur-2xl overflow-y-auto animate-in fade-in-0 duration-300">
      {/* Background ambient lighting subtly visible through glass */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>

      {/* Glassmorphic settings panel */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white font-main leading-tight">Profile Settings</h1>
              <p className="text-xs text-zinc-400 font-small">Customize your avatar, display name, and gamer bio</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
            title="Close"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>

        {/* Content Body: Avatar Picker on Left, Profile Details on Right */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Avatar Picker Component */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <AvatarPicker
              displayName={fullName.trim() || user?.username || "Player"}
            />
          </div>

          {/* Right: Profile Info Form */}
          <form onSubmit={handleSave} className="lg:col-span-6 flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-small">
                {error}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-small flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" />
                Profile changes saved successfully!
              </div>
            )}

            {/* Username (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-small uppercase tracking-wider">
                Username / Gamer Tag
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/5 text-zinc-400 text-sm font-sub">
                <User className="h-4 w-4 text-zinc-500" />
                <span>{user?.username ?? "—"}</span>
                <span className="ml-auto text-[10px] text-zinc-600 uppercase font-mono">Permanent</span>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small uppercase tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub"
              />
            </div>

            {/* Title / Role */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small uppercase tracking-wider">
                Competitive Title / Rank
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Math Blitz Champion"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small uppercase tracking-wider">
                Gamer Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell rivals about your speed and favorite topics..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs font-bold transition font-main"
              >
                Back to Lobby
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition font-main cursor-pointer"
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
