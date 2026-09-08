"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { ApiError } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirm) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    try {
      await register(username, email, password, passwordConfirm)
      router.push("/account-setup")
    } catch (err: unknown) {
      if (err instanceof ApiError) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError("Failed to create account. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub"

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="relative max-w-md w-full space-y-6 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur shadow-2xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white font-main">Join Metsie</h2>
          <p className="text-sm text-zinc-400 font-sub">Create your account and start competing</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-small">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Username", type: "text",     value: username,         set: setUsername,        placeholder: "jane_doe" },
            { label: "Email",    type: "email",    value: email,            set: setEmail,           placeholder: "jane@example.com" },
            { label: "Password (min. 6 chars)", type: "password", value: password, set: setPassword, placeholder: "••••••••", min: 6 },
            { label: "Confirm Password",        type: "password", value: passwordConfirm, set: setPasswordConfirm, placeholder: "••••••••", min: 6 },
          ].map(({ label, type, value, set, placeholder, min }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small">{label}</label>
              <input
                type={type}
                required
                value={value}
                minLength={min}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-bold text-sm transition shadow-md font-main"
          >
            {submitting ? "Creating..." : "Create Account →"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 font-small">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
