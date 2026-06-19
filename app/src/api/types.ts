export interface Panchang {
  date: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  masa: string;
  vara: string;
  weekday: number;
  flags: string[];
}

export interface PracticeSummary {
  id: string;
  type: 'puja' | 'mantra' | 'aarti' | 'chalisa' | 'stotra' | 'vrat' | 'sankalpa';
  title: string;
  deity: string;
  glyph: string;
  glyphStyle: 'default' | 'indigo' | 'peacock' | 'rose';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estDurationMin: number;
  summary: string;
  occasions: string[];
}

// A single line/verse of a prayer, with its own per-line meaning that can be toggled on/off.
export interface MantraLine {
  devanagari: string;
  transliteration: string;
  meaning: string;
}

// A group of lines within a prayer (e.g. "Opening Dohas", "Chaupais", "Closing Doha").
// For a simple japa mantra there is one section with a single line and a repetitionTarget.
export interface MantraSection {
  label?: string;
  lines: MantraLine[];
  repetitionTarget: number | null;
}

export interface Step {
  order: number;
  instruction: string;
  mantraRef?: number;
  estSec: number;
  optional?: boolean;
}

export interface Practice extends PracticeSummary {
  traditionTags: string[];
  regionTags: string[];
  why: string;
  materials: string[];
  mantras: MantraSection[];
  steps: Step[];
  isFavourite: boolean;
}

export interface Observance {
  title: string;
  description: string;
  source?: 'festival' | 'flag' | 'weekly';
}

export interface TodayResponse {
  date: string;
  panchang: Panchang;
  observance: Observance;
  recommended: PracticeSummary[];
  routine: RoutineTodayItem[];
}

export interface RoutineTodayItem {
  id: number;
  title: string;
  practiceId: string;
  timeOfDay: string | null;
  group: string;
  reminder: boolean;
  done: boolean;
}

export interface RoutineItem {
  id: number;
  practiceId: string;
  title: string;
  subtitle?: string;
  timeOfDay: string | null;
  days: number[];
  reminder: boolean;
  group: string;
}

export interface CalendarDay {
  date: string;
  day: number;
  weekday: number;
  flags: string[];
  festival: { id: string; name: string; icon: string } | null;
}

export interface CalendarResponse {
  month: string;
  today: Panchang;
  days: CalendarDay[];
}

export interface DayDetailResponse {
  date: string;
  panchang: Panchang;
  observances: {
    title: string;
    description: string;
    practices: PracticeSummary[];
  }[];
}

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  role: 'user' | 'admin';
  emailVerified: boolean;
  avatarUrl: string | null;
  language: string;
  tradition: string;
  region: string;
  experience: string;
  streak: number;
  favouritesCount: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  role: 'user' | 'admin';
  emailVerified: boolean;
  avatarUrl: string | null;
  language: string;
  tradition: string;
  region: string;
  experience: string;
  streak: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
