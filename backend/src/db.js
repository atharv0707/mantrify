import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { practices, festivals, defaultRoutine } from './seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '..', 'mantrify.db'));

db.pragma('journal_mode = WAL');

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
  language TEXT DEFAULT 'en',
  tradition TEXT DEFAULT 'shaiva',
  region TEXT DEFAULT 'north',
  experience TEXT DEFAULT 'some',
  streak INTEGER DEFAULT 0
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

const DEMO_USER = 'demo-user';

function seed() {
  // Always upsert practices so new entries in seedData take effect on next restart
  const upsertPractice = db.prepare('INSERT OR REPLACE INTO practices (id, data) VALUES (?, ?)');
  db.transaction((rows) => {
    for (const p of rows) upsertPractice.run(p.id, JSON.stringify(p));
  })(practices);

  const festivalCount = db.prepare('SELECT COUNT(*) AS c FROM festivals').get().c;
  if (festivalCount === 0) {
    const insert = db.prepare('INSERT INTO festivals (id, data) VALUES (?, ?)');
    const tx = db.transaction((rows) => {
      for (const f of rows) insert.run(f.id, JSON.stringify(f));
    });
    tx(festivals);
  }

  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users WHERE id = ?').get(DEMO_USER).c;
  if (userCount === 0) {
    db.prepare(`INSERT INTO users (id, name, language, tradition, region, experience, streak)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(DEMO_USER, 'Aarav', 'en', 'shaiva', 'north', 'some', 12);

    const insertRoutine = db.prepare(`INSERT INTO routine_items
      (user_id, practice_id, title_override, time_of_day, days, reminder, group_name, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const tx = db.transaction((items) => {
      items.forEach((item, i) => {
        insertRoutine.run(
          DEMO_USER,
          item.practiceId,
          item.titleOverride ?? null,
          item.timeOfDay ?? null,
          JSON.stringify(item.days ?? [0,1,2,3,4,5,6]),
          item.reminder ? 1 : 0,
          item.group ?? 'morning',
          i
        );
      });
    });
    tx(defaultRoutine);

    const initialFavorites = ['hanuman-chalisa', 'shiva-aarti', 'gayatri-mantra', 'griha-pravesh',
      'om-namah-shivaya-japa', 'maha-mrityunjaya', 'durga-chalisa', 'vidyarambh'];
    const insertFav = db.prepare('INSERT OR IGNORE INTO favorites (user_id, practice_id) VALUES (?, ?)');
    for (const pid of initialFavorites) insertFav.run(DEMO_USER, pid);
  }
}

seed();

export default db;
export { DEMO_USER };
