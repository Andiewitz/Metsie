"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { avatars } from "@/components/ui/avatar-picker"

export function Navbar() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <nav className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-main">
            Metsie
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium font-sub">
          {loading ? (
            <div className="h-4 w-20 bg-zinc-800 animate-pulse rounded" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                Play
              </Link>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                Log out
              </button>
              <Link
                href="/dashboard/settings"
                className="h-8 w-8 rounded-full overflow-hidden border border-violet-500/40 bg-zinc-900 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full hover:scale-105 transition"
                title="Profile Settings"
              >
                {avatars[0].svg}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-violet-500 hover:bg-violet-400 text-white font-semibold px-4 py-1.5 rounded-lg shadow-sm transition"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
