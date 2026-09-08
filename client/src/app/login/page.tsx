"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { ApiError } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isDevEnabled = process.env.NEXT_PUBLIC_DEV_CREDENTIALS_ENABLED === "true"
  const devIdentifier = process.env.NEXT_PUBLIC_DEV_IDENTIFIER || "dev@metsie.local"
  const devPassword = process.env.NEXT_PUBLIC_DEV_PASSWORD || "devpassword123"

  const fillDevCredentials = () => {
    setIdentifier(devIdentifier)
    setPassword(devPassword)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(identifier, password)
      router.push("/dashboard")
    } catch (err: unknown) {
      if (err instanceof ApiError) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError("Failed to log in. Please check your credentials.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="relative max-w-md w-full space-y-6 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur shadow-2xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white font-main">Welcome back</h2>
          <p className="text-sm text-zinc-400 font-sub">Sign in to continue your streak</p>
        </div>

        {isDevEnabled && (
          <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-violet-400 flex items-center gap-1.5 font-small">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                Dev Mode
              </span>
              <button
                type="button"
                onClick={fillDevCredentials}
                className="text-[11px] px-2 py-0.5 rounded bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 font-medium transition cursor-pointer font-small"
              >
                Autofill
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono font-small">
              {devIdentifier} / {devPassword}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-small">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="jane_doe or jane@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-bold text-sm transition shadow-md font-main"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 font-small">
          New to Metsie?{" "}
          <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
