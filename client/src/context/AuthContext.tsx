'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

export interface UserProfile {
  full_name: string;
  bio: string;
  company: string;
  role: string;
  is_onboarded: boolean;
  updated_at?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile: UserProfile;
  date_joined?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  setupAccount: (data: { full_name: string; company?: string; role?: string; bio?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      // Calls /api/auth/me/ which verifies the 7-day httpOnly cookie
      const data = await apiFetch<{ user: User }>('/api/auth/me/');
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    apiFetch<{ user: User }>('/api/auth/me/')
      .then((data) => {
        if (isMounted) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    await apiFetch('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({
        username_or_email: usernameOrEmail,
        password,
      }),
    });
    await refreshUser();
  };

  const register = async (username: string, email: string, password: string, passwordConfirm: string) => {
    await apiFetch('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      }),
    });
    await refreshUser();
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout/', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  const setupAccount = async (data: { full_name: string; company?: string; role?: string; bio?: string }) => {
    const res = await apiFetch<{ message: string; user: User }>('/api/auth/account-setup/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        setupAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
