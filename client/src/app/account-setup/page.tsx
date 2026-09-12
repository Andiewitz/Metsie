'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, ApiError } from '@/lib/api';
import { AvatarPicker } from '@/components/ui/avatar-picker';
import { Sparkles, Gamepad2 } from 'lucide-react';

export default function AccountSetupPage() {
  const router = useRouter();
  const { user, loading: authLoading, setupAccount } = useAuth();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      apiFetch<{ full_name?: string; role?: string; bio?: string }>('/api/auth/account-setup/')
        .then((data) => {
          setFullName(data.full_name || '');
          setRole(data.role || '');
          setBio(data.bio || '');
        })
        .catch((err) => {
          console.error('Failed to load profile info', err);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await setupAccount({
        full_name: fullName,
        role,
        bio,
      });
      setSuccess('Profile initialized successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update player profile.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-xs font-small">Loading player profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>

      <div className="relative max-w-2xl w-full space-y-8 p-8 sm:p-10 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-3xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold font-small">
            <Sparkles className="w-3.5 h-3.5" />
            Player Setup
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-main">
            Welcome to Metsie
          </h2>
          <p className="text-sm text-zinc-400 font-sub max-w-md mx-auto">
            Choose your avatar and set up your in-game identity before entering the lobby.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-small">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-small">
            {success} Entering lobby...
          </div>
        )}

        {/* Avatar Picker */}
        <div className="flex flex-col items-center">
          <AvatarPicker displayName={fullName.trim() || user?.username || 'Player'} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small uppercase tracking-wider">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. ShadowRacer, Alex"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small uppercase tracking-wider">
              Competitive Title / Rank Tag
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Challenger, Science Wizard, Math Prodigy"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-small uppercase tracking-wider">
              Player Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a quick bio or your favorite competition subjects..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-sub resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 font-main cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            {submitting ? 'Entering Lobby...' : 'Enter Lobby & Start Playing'}
          </button>
        </form>
      </div>
    </div>
  );
}
