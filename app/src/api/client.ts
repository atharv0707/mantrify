import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type {
  CalendarResponse,
  DayDetailResponse,
  Practice,
  PracticeSummary,
  Profile,
  RoutineItem,
  TodayResponse,
} from './types';

// Resolve the backend host: on a physical device / simulator, reuse the same host
// the Metro bundler is served from so `npx expo start` "just works" on a LAN.
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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${options.method ?? 'GET'} ${path} (${res.status})`);
  }
  return res.json();
}

export const api = {
  getToday: (date?: string) => request<TodayResponse>(`/v1/today${date ? `?date=${date}` : ''}`),
  getCalendar: (month: string) => request<CalendarResponse>(`/v1/calendar?month=${month}`),
  getDay: (date: string) => request<DayDetailResponse>(`/v1/calendar/${date}`),
  getPractice: (id: string) => request<Practice>(`/v1/practices/${id}`),
  search: (params: { q?: string; type?: string; deity?: string; occasion?: string }) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => !!v) as [string, string][]);
    return request<{ results: PracticeSummary[] }>(`/v1/search?${qs.toString()}`);
  },

  getRoutine: () => request<{ items: RoutineItem[] }>('/v1/me/routine'),
  addRoutineItem: (body: { practiceId: string; titleOverride?: string; timeOfDay?: string; days?: number[]; reminder?: boolean; group?: string }) =>
    request<{ id: number }>('/v1/me/routine', { method: 'POST', body: JSON.stringify(body) }),
  updateRoutineItem: (id: number, body: Partial<{ reminder: boolean; timeOfDay: string; days: number[]; titleOverride: string }>) =>
    request<{ ok: true }>(`/v1/me/routine/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRoutineItem: (id: number) => request<{ ok: true }>(`/v1/me/routine/${id}`, { method: 'DELETE' }),

  setCompletion: (body: { routineItemId?: number; practiceId?: string; date?: string; done: boolean }) =>
    request<{ ok: true; done: boolean }>('/v1/me/completions', { method: 'POST', body: JSON.stringify(body) }),

  getFavourites: () => request<{ items: PracticeSummary[] }>('/v1/me/favourites'),
  addFavourite: (practiceId: string) => request<{ ok: true }>(`/v1/me/favourites/${practiceId}`, { method: 'POST' }),
  removeFavourite: (practiceId: string) => request<{ ok: true }>(`/v1/me/favourites/${practiceId}`, { method: 'DELETE' }),

  getProfile: () => request<Profile>('/v1/me/profile'),
  updateProfile: (body: Partial<{ language: string; tradition: string; region: string; experience: string }>) =>
    request<{ ok: true }>('/v1/me/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

export { BASE_URL };
