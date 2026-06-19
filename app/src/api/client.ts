import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type {
  AuthResponse,
  AuthUser,
  CalendarResponse,
  DayDetailResponse,
  Practice,
  PracticeSummary,
  Profile,
  RoutineItem,
  TodayResponse,
} from './types';

function resolveBaseUrl() {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:4000`;
  }
  if (Platform.OS === 'android') return 'http://10.0.2.2:4000';
  return 'http://localhost:4000';
}

const BASE_URL = resolveBaseUrl();

// ── Module-level access token (set by AuthContext, read by every request) ─────

let _accessToken: string | null = null;
let _refreshCallback: (() => Promise<string | null>) | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken() {
  return _accessToken;
}

export function setRefreshCallback(cb: (() => Promise<string | null>) | null) {
  _refreshCallback = cb;
}

// ── Core request ──────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
  _retry = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authenticated && _accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && authenticated && !_retry && _refreshCallback) {
    const newToken = await _refreshCallback();
    if (newToken) {
      return request<T>(path, options, authenticated, true);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Record<string, unknown>;
    const err = new Error(`${options.method ?? 'GET'} ${path} (${res.status})`) as Error & { code?: string; status?: number };
    err.code = body.error as string | undefined;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

function auth<T>(path: string, options: RequestInit = {}) {
  return request<T>(path, options, true);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (body: { name: string; email: string; password: string }) =>
    request<{ message: string; email: string }>('/v1/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

  verifyEmail: (body: { email: string; code: string }) =>
    request<AuthResponse>('/v1/auth/verify-email', { method: 'POST', body: JSON.stringify(body) }),

  resendVerification: (email: string) =>
    request<{ message: string }>('/v1/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),

  signin: (body: { email: string; password: string }) =>
    request<AuthResponse>('/v1/auth/signin', { method: 'POST', body: JSON.stringify(body) }),

  signout: (refreshToken: string) =>
    request<{ ok: true }>('/v1/auth/signout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  refresh: (refreshToken: string) =>
    request<AuthResponse>('/v1/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (body: { email: string; code: string; newPassword: string }) =>
    request<{ message: string }>('/v1/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  googleSignIn: (accessToken: string) =>
    request<AuthResponse>('/v1/auth/google', { method: 'POST', body: JSON.stringify({ accessToken }) }),

  appleSignIn: (body: { identityToken: string; fullName?: { givenName?: string | null; familyName?: string | null } | null }) =>
    request<AuthResponse>('/v1/auth/apple', { method: 'POST', body: JSON.stringify(body) }),
};

// ── App API ───────────────────────────────────────────────────────────────────

export const api = {
  getToday: (date?: string) => auth<TodayResponse>(`/v1/today${date ? `?date=${date}` : ''}`),
  getCalendar: (month: string) => request<CalendarResponse>(`/v1/calendar?month=${month}`),
  getDay: (date: string) => request<DayDetailResponse>(`/v1/calendar/${date}`),
  getPractice: (id: string) => auth<Practice>(`/v1/practices/${id}`),
  search: (params: { q?: string; type?: string; deity?: string; occasion?: string }) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => !!v) as [string, string][]);
    return request<{ results: PracticeSummary[] }>(`/v1/search?${qs.toString()}`);
  },

  getRoutine: () => auth<{ items: RoutineItem[] }>('/v1/me/routine'),
  addRoutineItem: (body: { practiceId: string; titleOverride?: string; timeOfDay?: string; days?: number[]; reminder?: boolean; group?: string }) =>
    auth<{ id: number }>('/v1/me/routine', { method: 'POST', body: JSON.stringify(body) }),
  updateRoutineItem: (id: number, body: Partial<{ reminder: boolean; timeOfDay: string; days: number[]; titleOverride: string }>) =>
    auth<{ ok: true }>(`/v1/me/routine/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRoutineItem: (id: number) => auth<{ ok: true }>(`/v1/me/routine/${id}`, { method: 'DELETE' }),

  setCompletion: (body: { routineItemId?: number; practiceId?: string; date?: string; done: boolean }) =>
    auth<{ ok: true; done: boolean }>('/v1/me/completions', { method: 'POST', body: JSON.stringify(body) }),

  getFavourites: () => auth<{ items: PracticeSummary[] }>('/v1/me/favourites'),
  addFavourite: (practiceId: string) => auth<{ ok: true }>(`/v1/me/favourites/${practiceId}`, { method: 'POST' }),
  removeFavourite: (practiceId: string) => auth<{ ok: true }>(`/v1/me/favourites/${practiceId}`, { method: 'DELETE' }),

  getProfile: () => auth<Profile>('/v1/me/profile'),
  updateProfile: (body: Partial<{ name: string; language: string; tradition: string; region: string; experience: string }>) =>
    auth<{ ok: true }>('/v1/me/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

export { BASE_URL };
