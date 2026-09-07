'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Header Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Decoupled Architecture: Next.js + Django Services</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Fast & Clean Full-Stack with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            HttpOnly JWTs
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Modular Django backend located in <code className="text-emerald-400 font-mono text-sm bg-zinc-900 px-1.5 py-0.5 rounded">/services</code> with dedicated service jobs, 7-day httpOnly cookies for XSS-proof auth, and Next.js in <code className="text-emerald-400 font-mono text-sm bg-zinc-900 px-1.5 py-0.5 rounded">/client</code>.
        </p>

        {/* Current Auth Status Card */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur text-left max-w-lg mx-auto shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
              Live Session Status
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                loading
                  ? 'bg-zinc-800 text-zinc-400'
                  : user
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {loading ? 'Checking...' : user ? 'Authenticated' : 'Guest'}
            </span>
          </div>

          <div className="pt-4 text-sm space-y-2">
            {loading ? (
              <div className="space-y-2 py-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse" />
              </div>
            ) : user ? (
              <div>
                <p className="text-zinc-200">
                  Welcome back, <strong className="text-white">{user.username}</strong> ({user.email})
                </p>
                <p className="text-zinc-400 text-xs mt-1">
                  Profile Status:{' '}
                  <span className={user.profile?.is_onboarded ? 'text-emerald-400' : 'text-amber-400'}>
                    {user.profile?.is_onboarded ? 'Setup Complete' : 'Setup Pending'}
                  </span>
                </p>
                <div className="mt-4 flex space-x-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition"
                  >
                    Open Dashboard &rarr;
                  </Link>
                  <Link
                    href="/account-setup"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition"
                  >
                    Account Setup
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-zinc-400 text-xs">
                  No active session found. HttpOnly cookie is clean. Register or log in to generate a secure 7-day token.
                </p>
                <div className="mt-4 flex space-x-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-2">
            <h3 className="font-semibold text-white text-sm">🔒 7-Day HttpOnly Cookies</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Tokens are never stored in localStorage. Cookies cannot be stolen via JavaScript XSS attacks.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-2">
            <h3 className="font-semibold text-white text-sm">📂 Modular Job Files</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              No monolithic views. Separate <code className="text-zinc-300">jwt.py</code>, <code className="text-zinc-300">authentication.py</code>, and <code className="text-zinc-300">account_setup.py</code>.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-2">
            <h3 className="font-semibold text-white text-sm">⚡ Nginx & Next.js Rewrites</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Zero CORS headaches in development via local proxy rewrites, with Nginx reverse proxy ready for production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
