import express from 'express';
import cors from 'cors';
import db, { DEMO_USER } from './db.js';
import { getPanchang } from './panchang.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---------- helpers ----------

function loadPractice(id) {
  const row = db.prepare('SELECT data FROM practices WHERE id = ?').get(id);
  return row ? JSON.parse(row.data) : null;
}

function loadAllPractices() {
  return db.prepare('SELECT data FROM practices').all().map((r) => JSON.parse(r.data));
}

function loadAllFestivals() {
  return db.prepare('SELECT data FROM festivals').all().map((r) => JSON.parse(r.data));
}

function practiceSummary(p) {
  return {
    id: p.id,
    type: p.type,
    title: p.title,
    deity: p.deity,
    glyph: p.glyph,
    glyphStyle: p.glyphStyle,
    difficulty: p.difficulty,
    estDurationMin: p.estDurationMin,
    summary: p.summary,
    occasions: p.occasions,
  };
}

// ---------- weekly & flag-based observances (design §5.2, §9.2) ----------

import { weeklyObservances, flagObservances } from './seedData.js';

// Recurring observances (Ekadashi, Pradosh, Purnima, Amavasya) derived from the computed
// panchang flags, in priority order (a day can carry more than one flag, e.g. Ekadashi rarely
// coincides with Pradosh, but Purnima/Amavasya never coincide with Ekadashi/Pradosh).
const FLAG_PRIORITY = ['pradosh', 'ekadashi', 'purnima', 'amavasya'];

function getFlagObservances(panchang) {
  return FLAG_PRIORITY
    .filter((flag) => panchang.flags.includes(flag))
    .map((flag) => ({ flag, ...flagObservances[flag] }));
}

// ---------- /v1/today ----------

app.get('/v1/today', (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const panchang = getPanchang(date);

  const festivalsToday = loadAllFestivals().filter((f) => f.date === date);
  const flagsToday = getFlagObservances(panchang);

  let observance;
  let recommendedIds = [];

  if (festivalsToday.length > 0) {
    const f = festivalsToday[0];
    observance = { title: f.name, description: f.description, source: 'festival' };
    recommendedIds = f.practiceIds;
  } else if (flagsToday.length > 0) {
    const flagObs = flagsToday[0];
    observance = { title: flagObs.name, description: flagObs.description, source: 'flag' };
    recommendedIds = flagObs.practiceIds;
  } else {
    const weekly = weeklyObservances[panchang.weekday];
    observance = { title: weekly.title, description: weekly.description, source: 'weekly' };
    recommendedIds = weekly.practiceIds;
  }

  const recommended = recommendedIds
    .map(loadPractice)
    .filter(Boolean)
    .map(practiceSummary);

  // routine for today
  const weekday = panchang.weekday;
  const items = db.prepare('SELECT * FROM routine_items WHERE user_id = ? ORDER BY group_name, sort_order').all(DEMO_USER);
  const completions = new Set(
    db.prepare('SELECT routine_item_id FROM completions WHERE user_id = ? AND completed_date = ?')
      .all(DEMO_USER, date)
      .map((r) => r.routine_item_id)
  );

  const routine = items
    .filter((item) => JSON.parse(item.days).includes(weekday))
    .map((item) => {
      const practice = loadPractice(item.practice_id);
      return {
        id: item.id,
        title: item.title_override || practice?.title,
        practiceId: item.practice_id,
        timeOfDay: item.time_of_day,
        group: item.group_name,
        reminder: !!item.reminder,
        done: completions.has(item.id),
      };
    });

  res.json({
    date,
    panchang,
    observance,
    recommended,
    routine,
  });
});

// ---------- /v1/calendar ----------

app.get('/v1/calendar', (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7); // YYYY-MM
  const [year, mon] = month.split('-').map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();

  const festivals = loadAllFestivals();
  const todayPanchang = getPanchang(new Date().toISOString().slice(0, 10));

  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(mon).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const panchang = getPanchang(dateStr);
    const festival = festivals.find((f) => f.date === dateStr);
    const flagObs = getFlagObservances(panchang)[0];
    const marker = festival
      ? { id: festival.id, name: festival.name, icon: festival.icon }
      : flagObs
        ? { id: flagObs.flag, name: flagObs.name, icon: flagObs.icon }
        : null;
    days.push({
      date: dateStr,
      day: d,
      weekday: panchang.weekday,
      flags: panchang.flags,
      festival: marker,
    });
  }

  res.json({
    month,
    today: todayPanchang,
    days,
  });
});

app.get('/v1/calendar/:date', (req, res) => {
  const { date } = req.params;
  const panchang = getPanchang(date);
  const festivals = loadAllFestivals().filter((f) => f.date === date);
  const flagsToday = getFlagObservances(panchang);
  const weekly = weeklyObservances[panchang.weekday];

  const observances = [];
  if (festivals.length) {
    for (const f of festivals) {
      observances.push({
        title: f.name,
        description: f.description,
        practices: f.practiceIds.map(loadPractice).filter(Boolean).map(practiceSummary),
      });
    }
  }
  for (const f of flagsToday) {
    observances.push({
      title: f.name,
      description: f.description,
      practices: f.practiceIds.map(loadPractice).filter(Boolean).map(practiceSummary),
    });
  }
  observances.push({
    title: weekly.title,
    description: weekly.description,
    practices: weekly.practiceIds.map(loadPractice).filter(Boolean).map(practiceSummary),
  });

  res.json({ date, panchang, observances });
});

// ---------- /v1/practices ----------

app.get('/v1/practices/:id', (req, res) => {
  const practice = loadPractice(req.params.id);
  if (!practice) return res.status(404).json({ error: 'not_found' });

  const isFavorite = !!db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND practice_id = ?').get(DEMO_USER, practice.id);

  res.json({ ...practice, isFavorite });
});

// ---------- /v1/search ----------

app.get('/v1/search', (req, res) => {
  const { q, type, deity, occasion } = req.query;
  let results = loadAllPractices();

  if (type) results = results.filter((p) => p.type === type);
  if (deity) results = results.filter((p) => p.deity === deity);
  if (occasion) results = results.filter((p) => p.occasions?.includes(occasion));
  if (q) {
    const needle = q.toLowerCase();
    results = results.filter((p) =>
      p.title.toLowerCase().includes(needle) ||
      p.summary.toLowerCase().includes(needle) ||
      p.occasions?.some((o) => o.toLowerCase().includes(needle))
    );
  }

  res.json({ results: results.map(practiceSummary) });
});

// ---------- /v1/me/routine ----------

app.get('/v1/me/routine', (req, res) => {
  const items = db.prepare('SELECT * FROM routine_items WHERE user_id = ? ORDER BY group_name, sort_order').all(DEMO_USER);
  const out = items.map((item) => {
    const practice = loadPractice(item.practice_id);
    return {
      id: item.id,
      practiceId: item.practice_id,
      title: item.title_override || practice?.title,
      subtitle: practice?.summary,
      timeOfDay: item.time_of_day,
      days: JSON.parse(item.days),
      reminder: !!item.reminder,
      group: item.group_name,
    };
  });
  res.json({ items: out });
});

app.post('/v1/me/routine', (req, res) => {
  const { practiceId, titleOverride, timeOfDay, days, reminder, group } = req.body;
  if (!practiceId || !loadPractice(practiceId)) return res.status(400).json({ error: 'invalid_practice' });

  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM routine_items WHERE user_id = ?').get(DEMO_USER).m;

  const result = db.prepare(`INSERT INTO routine_items
    (user_id, practice_id, title_override, time_of_day, days, reminder, group_name, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    DEMO_USER, practiceId, titleOverride ?? null, timeOfDay ?? null,
    JSON.stringify(days ?? [0,1,2,3,4,5,6]), reminder ? 1 : 0, group ?? 'morning', maxOrder + 1
  );

  res.status(201).json({ id: result.lastInsertRowid });
});

app.put('/v1/me/routine/:id', (req, res) => {
  const { id } = req.params;
  const item = db.prepare('SELECT * FROM routine_items WHERE id = ? AND user_id = ?').get(id, DEMO_USER);
  if (!item) return res.status(404).json({ error: 'not_found' });

  const { reminder, timeOfDay, days, titleOverride } = req.body;
  db.prepare(`UPDATE routine_items SET
    reminder = COALESCE(?, reminder),
    time_of_day = COALESCE(?, time_of_day),
    days = COALESCE(?, days),
    title_override = COALESCE(?, title_override)
    WHERE id = ?`).run(
    reminder === undefined ? null : (reminder ? 1 : 0),
    timeOfDay ?? null,
    days ? JSON.stringify(days) : null,
    titleOverride ?? null,
    id
  );

  res.json({ ok: true });
});

app.delete('/v1/me/routine/:id', (req, res) => {
  db.prepare('DELETE FROM routine_items WHERE id = ? AND user_id = ?').run(req.params.id, DEMO_USER);
  res.json({ ok: true });
});

// ---------- /v1/me/completions ----------

app.post('/v1/me/completions', (req, res) => {
  const { routineItemId, practiceId, date, done } = req.body;
  const completedDate = date || new Date().toISOString().slice(0, 10);

  if (done === false) {
    db.prepare('DELETE FROM completions WHERE user_id = ? AND routine_item_id = ? AND completed_date = ?')
      .run(DEMO_USER, routineItemId ?? null, completedDate);
    return res.json({ ok: true, done: false });
  }

  db.prepare(`INSERT OR IGNORE INTO completions (user_id, practice_id, routine_item_id, completed_date)
    VALUES (?, ?, ?, ?)`).run(DEMO_USER, practiceId ?? null, routineItemId ?? null, completedDate);

  res.json({ ok: true, done: true });
});

// ---------- /v1/me/favorites ----------

app.get('/v1/me/favorites', (req, res) => {
  const rows = db.prepare('SELECT practice_id FROM favorites WHERE user_id = ?').all(DEMO_USER);
  const items = rows.map((r) => loadPractice(r.practice_id)).filter(Boolean).map(practiceSummary);
  res.json({ items });
});

app.post('/v1/me/favorites/:practiceId', (req, res) => {
  if (!loadPractice(req.params.practiceId)) return res.status(404).json({ error: 'not_found' });
  db.prepare('INSERT OR IGNORE INTO favorites (user_id, practice_id) VALUES (?, ?)').run(DEMO_USER, req.params.practiceId);
  res.json({ ok: true });
});

app.delete('/v1/me/favorites/:practiceId', (req, res) => {
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND practice_id = ?').run(DEMO_USER, req.params.practiceId);
  res.json({ ok: true });
});

// ---------- /v1/me/profile ----------

app.get('/v1/me/profile', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER);
  const favCount = db.prepare('SELECT COUNT(*) AS c FROM favorites WHERE user_id = ?').get(DEMO_USER).c;
  res.json({
    id: user.id,
    name: user.name,
    language: user.language,
    tradition: user.tradition,
    region: user.region,
    experience: user.experience,
    streak: user.streak,
    favoritesCount: favCount,
  });
});

app.put('/v1/me/profile', (req, res) => {
  const { language, tradition, region, experience } = req.body;
  db.prepare(`UPDATE users SET
    language = COALESCE(?, language),
    tradition = COALESCE(?, tradition),
    region = COALESCE(?, region),
    experience = COALESCE(?, experience)
    WHERE id = ?`).run(language ?? null, tradition ?? null, region ?? null, experience ?? null, DEMO_USER);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Mantrify API listening on http://localhost:${PORT}`);
});
