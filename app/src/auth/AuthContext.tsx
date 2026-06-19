import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi, setAccessToken, setRefreshCallback } from '../api/client';
import type { AuthUser, AuthResponse } from '../api/types';

const REFRESH_TOKEN_KEY = 'mantrify_refresh_token';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (response: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTokenRef = useRef<string | null>(null);

  const applyAuthResponse = useCallback(async (response: AuthResponse) => {
    setAccessToken(response.accessToken);
    refreshTokenRef.current = response.refreshToken;
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
    setUser(response.user);
  }, []);

  const doRefresh = useCallback(async (): Promise<string | null> => {
    const token = refreshTokenRef.current ?? await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!token) return null;
    try {
      const response = await authApi.refresh(token);
      await applyAuthResponse(response);
      return response.accessToken;
    } catch {
      // Refresh token invalid or expired — sign out
      setAccessToken(null);
      refreshTokenRef.current = null;
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      setUser(null);
      return null;
    }
  }, [applyAuthResponse]);

  // Register refresh callback so api/client.ts can auto-refresh on 401
  useEffect(() => {
    setRefreshCallback(doRefresh);
    return () => setRefreshCallback(null);
  }, [doRefresh]);

  // On mount: restore session from secure store
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (stored) {
          refreshTokenRef.current = stored;
          await doRefresh();
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = useCallback(async (response: AuthResponse) => {
    await applyAuthResponse(response);
  }, [applyAuthResponse]);

  const signOut = useCallback(async () => {
    const token = refreshTokenRef.current;
    setAccessToken(null);
    refreshTokenRef.current = null;
    setUser(null);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    if (token) {
      authApi.signout(token).catch(() => {});
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
