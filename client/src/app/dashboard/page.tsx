'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-xs">Authenticating session via httpOnly cookie...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
              Active 7-Day Session
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Logged in as <span className="text-white font-medium">{user.username}</span> ({user.email})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/account-setup"
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <h2 className="text-base font-semibold text-white">User Profile Details</h2>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                user.profile?.is_onboarded
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {user.profile?.is_onboarded ? '✓ Onboarding Complete' : '⚠ Onboarding Incomplete'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-zinc-500">Full Name</p>
              <p className="text-zinc-200 font-medium mt-0.5">
                {user.profile?.full_name || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Company / Team</p>
              <p className="text-zinc-200 font-medium mt-0.5">
                {user.profile?.company || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Role / Designation</p>
              <p className="text-zinc-200 font-medium mt-0.5">
                {user.profile?.role || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">User ID & Joined</p>
              <p className="text-zinc-200 font-medium mt-0.5">
                #{user.id} · {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Recent'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-500">Bio</p>
            <p className="text-zinc-300 text-sm mt-1 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
              {user.profile?.bio || 'No bio provided yet. Visit account setup to add one.'}
            </p>
          </div>
        </div>

        {/* Security & Token Inspector Card */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur space-y-4">
          <h2 className="text-base font-semibold text-white">Security Inspection</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your JWT is protected using modern zero-trust storage principles:
          </p>

          <ul className="space-y-3 text-xs">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <div>
                <strong className="text-zinc-200">HttpOnly Flag:</strong>{' '}
                <span className="text-zinc-400">
                  Active. JavaScript cannot read <code className="text-zinc-300 font-mono">document.cookie</code>.
                </span>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <div>
                <strong className="text-zinc-200">LocalStorage:</strong>{' '}
                <span className="text-zinc-400">Zero tokens stored in localStorage or sessionStorage.</span>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <div>
                <strong className="text-zinc-200">Lifespan:</strong>{' '}
                <span className="text-zinc-400">Exactly 7 days (604,800 seconds max_age).</span>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <div>
                <strong className="text-zinc-200">SameSite Policy:</strong>{' '}
                <span className="text-zinc-400">SameSite=Lax for robust CSRF mitigation.</span>
              </div>
            </li>
          </ul>

          <div className="pt-2">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-400">
              <span className="text-emerald-400">Cookie:</span> access_token
              <br />
              <span className="text-emerald-400">Expires:</span> 7 days from issue
              <br />
              <span className="text-emerald-400">Path:</span> /
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
