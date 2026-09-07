'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Metsie
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            7-Day HttpOnly JWT
          </span>
        </div>

        <div className="flex items-center space-x-3 text-sm font-medium">
          {loading ? (
            <div className="h-4 w-16 bg-zinc-800 animate-pulse rounded" />
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/account-setup"
                className="text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                {user.profile?.is_onboarded ? 'Edit Profile' : 'Setup Account'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                Logout
              </button>
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs uppercase">
                {user.username.slice(0, 2)}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-4 py-1.5 rounded-lg shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
