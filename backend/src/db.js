import 'dotenv/config';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { practices, festivals, defaultRoutine } from './seedData.js';
import { hashPasswordSync } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '..', 'mantrify.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
CREATE TABLE IF NOT EXISTS practices (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS festivals (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  email_verified INTEGER NOT NULL DEFAULT 0,
  sso_provider TEXT,
  sso_id TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  tradition TEXT DEFAULT 'shaiva',
  region TEXT DEFAULT 'north',
  experience TEXT DEFAULT 'some',
  streak INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS routine_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  practice_id TEXT NOT NULL,
  title_override TEXT,
  time_of_day TEXT,
  days TEXT NOT NULL DEFAULT '[0,1,2,3,4,5,6]',
  reminder INTEGER NOT NULL DEFAULT 1,
  group_name TEXT NOT NULL DEFAULT 'morning',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  practice_id TEXT,
  routine_item_id INTEGER,
  completed_date TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, routine_item_id, completed_date)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  practice_id TEXT NOT NULL,
  PRIMARY KEY (user_id, practice_id)
);
`);

// ── Migrations: safely add new columns to existing deployments ───────────────

const columnMigrations = [
  "ALTER TABLE users ADD COLUMN email TEXT",
  "ALTER TABLE users ADD COLUMN password_hash TEXT",
  "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'",
  "ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE users ADD COLUMN sso_provider TEXT",
  "ALTER TABLE users ADD COLUMN sso_id TEXT",
  "ALTER TABLE users ADD COLUMN avatar_url TEXT",
  "ALTER TABLE users ADD COLUMN created_at TEXT NOT NULL DEFAULT (datetime('now'))",
];

for (const sql of columnMigrations) {
  try { db.exec(sql); } catch { /* column already exists */ }
}

// ── Fixed IDs for test accounts ───────────────────────────────────────────────

export const ADMIN_USER_ID  = '00000000-0000-0000-0000-000000000001';
export const REGULAR_USER_ID = '00000000-0000-0000-0000-000000000002';

// ── Seed ─────────────────────────────────────────────────────────────────────

function seed() {
  // Practices — always upsert so new seed entries take effect on restart
  const upsertPractice = db.prepare('INSERT OR REPLACE INTO practices (id, data) VALUES (?, ?)');
  db.transaction((rows) => {
    for (const p of rows) upsertPractice.run(p.id, JSON.stringify(p));
  })(practices);

  // Festivals
  if (db.prepare('SELECT COUNT(*) AS c FROM festivals').get().c === 0) {
    const ins = db.prepare('INSERT INTO festivals (id, data) VALUES (?, ?)');
    db.transaction((rows) => { for (const f of rows) ins.run(f.id, JSON.stringify(f)); })(festivals);
  }

  // Test admin — only hash + insert once
  if (!db.prepare('SELECT 1 FROM users WHERE id = ?').get(ADMIN_USER_ID)) {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, email_verified, language, tradition, region, experience, streak)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(ADMIN_USER_ID, 'Admin', 'admin@mantrify.app', hashPasswordSync('password'), 'admin', 1, 'en', 'universal', 'universal', 'advanced', 0);
  }

  // Test regular user
  if (!db.prepare('SELECT 1 FROM users WHERE id = ?').get(REGULAR_USER_ID)) {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, email_verified, language, tradition, region, experience, streak)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(REGULAR_USER_ID, 'Aarav', 'user@mantrify.app', hashPasswordSync('password'), 'user', 1, 'en', 'shaiva', 'north', 'some', 12);

    // Default routine + favourites for the regular test user
    const insRoutine = db.prepare(`
      INSERT INTO routine_items (user_id, practice_id, title_override, time_of_day, days, reminder, group_name, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    db.transaction((items) => {
      items.forEach((item, i) => insRoutine.run(
        REGULAR_USER_ID, item.practiceId, item.titleOverride ?? null,
        item.timeOfDay ?? null, JSON.stringify(item.days ?? [0,1,2,3,4,5,6]),
        item.reminder ? 1 : 0, item.group ?? 'morning', i
      ));
    })(defaultRoutine);

    const insFav = db.prepare('INSERT OR IGNORE INTO favorites (user_id, practice_id) VALUES (?, ?)');
    for (const pid of ['hanuman-chalisa', 'shiva-aarti', 'gayatri-mantra', 'griha-pravesh',
                        'om-namah-shivaya-japa', 'maha-mrityunjaya', 'durga-chalisa', 'vidyarambh']) {
      insFav.run(REGULAR_USER_ID, pid);
    }
  }
}

seed();

export default db;
