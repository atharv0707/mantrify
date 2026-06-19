import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import db from './db.js';
import { getPanchang } from './panchang.js';
import {
  hashPassword, verifyPassword,
  signAccessToken, verifyAccessToken,
  generateRefreshToken, hashToken, refreshTokenExpiresAt,
  generateOtp, otpExpiresAt,
  verifyGoogleToken, verifyGoogleAccessToken, verifyAppleToken,
} from './auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './mailer.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ── Auth middleware ───────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'unauthorized' });
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'token_expired' });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try { req.user = verifyAccessToken(header.slice(7)); } catch { /* expired — proceed unauthenticated */ }
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  next();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function buildAuthResponse(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = generateRefreshToken();
  db.prepare(`INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)`).run(randomUUID(), user.id, hashToken(refreshToken), refreshTokenExpiresAt());
  return {
    accessToken,
    refreshToken,
    user: publicUser(user),
  };
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: !!user.email_verified,
    avatarUrl: user.avatar_url ?? null,
    language: user.language,
    tradition: user.tradition,
    region: user.region,
    experience: user.experience,
    streak: user.streak,
  };
}

// ── Weekly & flag-based observances ──────────────────────────────────────────

import { weeklyObservances, flagObservances } from './seedData.js';

const FLAG_PRIORITY = ['pradosh', 'ekadashi', 'purnima', 'amavasya'];

function getFlagObservances(panchang) {
  return FLAG_PRIORITY
    .filter((flag) => panchang.flags.includes(flag))
    .map((flag) => ({ flag, ...flagObservances[flag] }));
}

// ── Auth routes ───────────────────────────────────────────────────────────────

// POST /v1/auth/signup
app.post('/v1/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'missing_fields' });
  if (password.length < 8) return res.status(400).json({ error: 'password_too_short' });

  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'email_taken' });
  }

  const id = randomUUID();
  const hash = await hashPassword(password);
  db.prepare(`INSERT INTO users (id, name, email, password_hash, role, email_verified)
    VALUES (?, ?, ?, ?, 'user', 0)`).run(id, name.trim(), email.toLowerCase().trim(), hash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

  // Send verification email
  const otp = generateOtp();
  db.prepare(`INSERT INTO email_verifications (id, user_id, code_hash, email, expires_at)
    VALUES (?, ?, ?, ?, ?)`).run(randomUUID(), id, hashToken(otp), user.email, otpExpiresAt(30));
  await sendVerificationEmail(user.email, otp);

  res.status(201).json({ message: 'verification_sent', email: user.email });
});

// POST /v1/auth/verify-email
app.post('/v1/auth/verify-email', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'missing_fields' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) return res.status(400).json({ error: 'invalid_code' });

  const record = db.prepare(`
    SELECT * FROM email_verifications
    WHERE user_id = ? AND used = 0 AND expires_at > datetime('now')
    ORDER BY created_at DESC LIMIT 1
  `).get(user.id);

  if (!record || record.code_hash !== hashToken(String(code).trim())) {
    return res.status(400).json({ error: 'invalid_code' });
  }

  db.prepare('UPDATE email_verifications SET used = 1 WHERE id = ?').run(record.id);
  db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(user.id);

  const fresh = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  res.json(buildAuthResponse(fresh));
});

// POST /v1/auth/resend-verification
app.post('/v1/auth/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'missing_fields' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || user.email_verified) return res.json({ message: 'ok' }); // silent

  const otp = generateOtp();
  db.prepare(`INSERT INTO email_verifications (id, user_id, code_hash, email, expires_at)
    VALUES (?, ?, ?, ?, ?)`).run(randomUUID(), user.id, hashToken(otp), user.email, otpExpiresAt(30));
  await sendVerificationEmail(user.email, otp);

  res.json({ message: 'verification_sent' });
});

// POST /v1/auth/signin
app.post('/v1/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing_fields' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || !user.password_hash) return res.status(401).json({ error: 'invalid_credentials' });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

  if (!user.email_verified) return res.status(403).json({ error: 'email_not_verified', email: user.email });

  res.json(buildAuthResponse(user));
});

// POST /v1/auth/signout
app.post('/v1/auth/signout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    db.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').run(hashToken(refreshToken));
  }
  res.json({ ok: true });
});

// POST /v1/auth/refresh
app.post('/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'missing_token' });

  const record = db.prepare(`
    SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > datetime('now')
  `).get(hashToken(refreshToken));

  if (!record) return res.status(401).json({ error: 'invalid_refresh_token' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(record.user_id);
  if (!user) return res.status(401).json({ error: 'user_not_found' });

  // Rotate: delete old token, issue new pair
  db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(record.id);

  res.json(buildAuthResponse(user));
});

// POST /v1/auth/forgot-password
app.post('/v1/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'missing_fields' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (user && user.password_hash) {
    const otp = generateOtp();
    db.prepare(`INSERT INTO password_resets (id, user_id, code_hash, expires_at)
      VALUES (?, ?, ?, ?)`).run(randomUUID(), user.id, hashToken(otp), otpExpiresAt(30));
    await sendPasswordResetEmail(user.email, otp);
  }
  // Always return ok to avoid email enumeration
  res.json({ message: 'if_account_exists_email_sent' });
});

// POST /v1/auth/reset-password
app.post('/v1/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'missing_fields' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'password_too_short' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) return res.status(400).json({ error: 'invalid_code' });

  const record = db.prepare(`
    SELECT * FROM password_resets
    WHERE user_id = ? AND used = 0 AND expires_at > datetime('now')
    ORDER BY created_at DESC LIMIT 1
  `).get(user.id);

  if (!record || record.code_hash !== hashToken(String(code).trim())) {
    return res.status(400).json({ error: 'invalid_code' });
  }

  db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(record.id);
  const hash = await hashPassword(newPassword);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, user.id);
  // Invalidate all refresh tokens on password change
  db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(user.id);

  res.json({ message: 'password_reset' });
});

// POST /v1/auth/google
app.post('/v1/auth/google', async (req, res) => {
  const { idToken, accessToken } = req.body;
  if (!idToken && !accessToken) return res.status(400).json({ error: 'missing_token' });

  let profile;
  try {
    profile = idToken
      ? await verifyGoogleToken(idToken)
      : await verifyGoogleAccessToken(accessToken);
  } catch {
    return res.status(401).json({ error: 'invalid_google_token' });
  }

  let user = db.prepare('SELECT * FROM users WHERE sso_provider = ? AND sso_id = ?').get('google', profile.sub);

  if (!user) {
    // Check if email already has a local account — link it
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(profile.email);
    if (user) {
      db.prepare('UPDATE users SET sso_provider = ?, sso_id = ?, avatar_url = COALESCE(avatar_url, ?), email_verified = 1 WHERE id = ?')
        .run('google', profile.sub, profile.picture ?? null, user.id);
    } else {
      const id = randomUUID();
      db.prepare(`INSERT INTO users (id, name, email, role, email_verified, sso_provider, sso_id, avatar_url)
        VALUES (?, ?, ?, 'user', 1, 'google', ?, ?)`).run(id, profile.name, profile.email, profile.sub, profile.picture ?? null);
    }
    user = db.prepare('SELECT * FROM users WHERE sso_provider = ? AND sso_id = ?').get('google', profile.sub)
        || db.prepare('SELECT * FROM users WHERE email = ?').get(profile.email);
  }

  res.json(buildAuthResponse(user));
});

// POST /v1/auth/apple
app.post('/v1/auth/apple', async (req, res) => {
  const { identityToken, fullName } = req.body;
  if (!identityToken) return res.status(400).json({ error: 'missing_token' });

  let profile;
  try {
    profile = await verifyAppleToken(identityToken);
  } catch {
    return res.status(401).json({ error: 'invalid_apple_token' });
  }

  let user = db.prepare('SELECT * FROM users WHERE sso_provider = ? AND sso_id = ?').get('apple', profile.sub);

  if (!user) {
    if (profile.email) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(profile.email);
    }
    if (user) {
      db.prepare('UPDATE users SET sso_provider = ?, sso_id = ?, email_verified = 1 WHERE id = ?')
        .run('apple', profile.sub, user.id);
    } else {
      const id = randomUUID();
      const name = fullName?.givenName
        ? `${fullName.givenName}${fullName.familyName ? ' ' + fullName.familyName : ''}`
        : (profile.email?.split('@')[0] ?? 'User');
      db.prepare(`INSERT INTO users (id, name, email, role, email_verified, sso_provider, sso_id)
        VALUES (?, ?, ?, 'user', 1, 'apple', ?)`).run(id, name, profile.email ?? null, profile.sub);
    }
    user = db.prepare('SELECT * FROM users WHERE sso_provider = ? AND sso_id = ?').get('apple', profile.sub);
  }

  res.json(buildAuthResponse(user));
});

// ── /v1/today ─────────────────────────────────────────────────────────────────

app.get('/v1/today', requireAuth, (req, res) => {
  const userId = req.user.userId;
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

  const recommended = recommendedIds.map(loadPractice).filter(Boolean).map(practiceSummary);

  const weekday = panchang.weekday;
  const items = db.prepare('SELECT * FROM routine_items WHERE user_id = ? ORDER BY group_name, sort_order').all(userId);
  const completions = new Set(
    db.prepare('SELECT routine_item_id FROM completions WHERE user_id = ? AND completed_date = ?')
      .all(userId, date)
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

  res.json({ date, panchang, observance, recommended, routine });
});

// ── /v1/calendar ──────────────────────────────────────────────────────────────

app.get('/v1/calendar', (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
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
      : flagObs ? { id: flagObs.flag, name: flagObs.name, icon: flagObs.icon }
      : null;
    days.push({ date: dateStr, day: d, weekday: panchang.weekday, flags: panchang.flags, festival: marker });
  }

  res.json({ month, today: todayPanchang, days });
});

app.get('/v1/calendar/:date', (req, res) => {
  const { date } = req.params;
  const panchang = getPanchang(date);
  const festivals = loadAllFestivals().filter((f) => f.date === date);
  const flagsToday = getFlagObservances(panchang);
  const weekly = weeklyObservances[panchang.weekday];

  const observances = [];
  for (const f of festivals) {
    observances.push({
      title: f.name,
      description: f.description,
      practices: f.practiceIds.map(loadPractice).filter(Boolean).map(practiceSummary),
    });
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

// ── /v1/practices ─────────────────────────────────────────────────────────────

app.get('/v1/practices/:id', optionalAuth, (req, res) => {
  const practice = loadPractice(req.params.id);
  if (!practice) return res.status(404).json({ error: 'not_found' });

  const userId = req.user?.userId;
  const isFavourite = userId
    ? !!db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND practice_id = ?').get(userId, practice.id)
    : false;

  res.json({ ...practice, isFavourite });
});

// ── /v1/search ────────────────────────────────────────────────────────────────

const SEARCH_ALIASES = {
  'ganesh': 'ganesha', 'ganpati': 'ganesha', 'ganapati': 'ganesha', 'vinayak': 'ganesha',
  'laxmi': 'lakshmi', 'mahalakshmi': 'lakshmi',
  'shiv': 'shiva', 'mahadev': 'shiva', 'bholenath': 'shiva', 'shankar': 'shiva', 'shankara': 'shiva',
  'bajrangbali': 'hanuman', 'pawanputra': 'hanuman', 'maruti': 'hanuman', 'anjaniputra': 'hanuman',
  'ambe': 'durga', 'bhavani': 'durga', 'jagdamba': 'durga', 'maa durga': 'durga',
  'sharada': 'saraswati', 'vagdevi': 'saraswati',
  'narayan': 'vishnu', 'narayana': 'vishnu', 'hari': 'vishnu', 'madhav': 'vishnu',
  'ram': 'rama', 'ramchandra': 'rama', 'shri ram': 'rama',
  'govind': 'krishna', 'murari': 'krishna', 'kanha': 'krishna', 'gopal': 'krishna',
  'aditya': 'surya', 'sun god': 'surya',
};

function scoreMatch(p, needle) {
  const lc = (x) => (x ?? '').toLowerCase();
  let score = 0;

  const mantraText = (p.mantras ?? [])
    .flatMap((sec) => sec.lines ?? [])
    .map((l) => `${lc(l.transliteration)} ${lc(l.devanagari)}`)
    .join(' ');

  const fields = [
    { text: lc(p.title), weight: 10 },
    { text: lc(p.deity), weight: 8 },
    { text: lc(p.type), weight: 5 },
    { text: lc(p.summary), weight: 4 },
    { text: (p.occasions ?? []).join(' ').toLowerCase(), weight: 4 },
    { text: lc(p.why), weight: 2 },
    { text: (p.traditionTags ?? []).join(' ').toLowerCase(), weight: 1 },
    { text: mantraText, weight: 3 },
  ];

  const fullText = fields.map((f) => f.text).join(' ');
  const resolvedDeity = SEARCH_ALIASES[needle];
  if (resolvedDeity && p.deity === resolvedDeity) score += 15;

  for (const { text, weight } of fields) {
    if (text.includes(needle)) score += weight;
  }

  const tokens = needle.split(/\s+/).filter((t) => t.length > 1);
  if (tokens.length > 1) {
    if (!tokens.every((t) => fullText.includes(t))) return 0;
    score += tokens.length * 2;
  }

  return score;
}

app.get('/v1/search', (req, res) => {
  const { q, type, deity, occasion } = req.query;
  let results = loadAllPractices();

  if (type) results = results.filter((p) => p.type === type);
  if (deity) results = results.filter((p) => p.deity === deity);
  if (occasion) results = results.filter((p) => p.occasions?.includes(occasion));

  if (q) {
    const needle = q.toLowerCase().trim();
    results = results
      .map((p) => ({ p, score: scoreMatch(p, needle) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ p }) => p);
  }

  res.json({ results: results.map(practiceSummary) });
});

// ── /v1/me/routine ────────────────────────────────────────────────────────────

app.get('/v1/me/routine', requireAuth, (req, res) => {
  const userId = req.user.userId;
  const items = db.prepare('SELECT * FROM routine_items WHERE user_id = ? ORDER BY group_name, sort_order').all(userId);
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

app.post('/v1/me/routine', requireAuth, (req, res) => {
  const userId = req.user.userId;
  const { practiceId, titleOverride, timeOfDay, days, reminder, group } = req.body;
  if (!practiceId || !loadPractice(practiceId)) return res.status(400).json({ error: 'invalid_practice' });

  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM routine_items WHERE user_id = ?').get(userId).m;
  const result = db.prepare(`INSERT INTO routine_items
    (user_id, practice_id, title_override, time_of_day, days, reminder, group_name, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    userId, practiceId, titleOverride ?? null, timeOfDay ?? null,
    JSON.stringify(days ?? [0,1,2,3,4,5,6]), reminder ? 1 : 0, group ?? 'morning', maxOrder + 1
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

app.put('/v1/me/routine/:id', requireAuth, (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const item = db.prepare('SELECT * FROM routine_items WHERE id = ? AND user_id = ?').get(id, userId);
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

app.delete('/v1/me/routine/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM routine_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
  res.json({ ok: true });
});

// ── /v1/me/completions ────────────────────────────────────────────────────────

app.post('/v1/me/completions', requireAuth, (req, res) => {
  const userId = req.user.userId;
  const { routineItemId, practiceId, date, done } = req.body;
  const completedDate = date || new Date().toISOString().slice(0, 10);

  if (done === false) {
    db.prepare('DELETE FROM completions WHERE user_id = ? AND routine_item_id = ? AND completed_date = ?')
      .run(userId, routineItemId ?? null, completedDate);
    return res.json({ ok: true, done: false });
  }

  db.prepare(`INSERT OR IGNORE INTO completions (user_id, practice_id, routine_item_id, completed_date)
    VALUES (?, ?, ?, ?)`).run(userId, practiceId ?? null, routineItemId ?? null, completedDate);

  res.json({ ok: true, done: true });
});

// ── /v1/me/favourites ─────────────────────────────────────────────────────────

app.get('/v1/me/favourites', requireAuth, (req, res) => {
  const userId = req.user.userId;
  const rows = db.prepare('SELECT practice_id FROM favorites WHERE user_id = ?').all(userId);
  const items = rows.map((r) => loadPractice(r.practice_id)).filter(Boolean).map(practiceSummary);
  res.json({ items });
});

app.post('/v1/me/favourites/:practiceId', requireAuth, (req, res) => {
  if (!loadPractice(req.params.practiceId)) return res.status(404).json({ error: 'not_found' });
  db.prepare('INSERT OR IGNORE INTO favorites (user_id, practice_id) VALUES (?, ?)').run(req.user.userId, req.params.practiceId);
  res.json({ ok: true });
});

app.delete('/v1/me/favourites/:practiceId', requireAuth, (req, res) => {
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND practice_id = ?').run(req.user.userId, req.params.practiceId);
  res.json({ ok: true });
});

// ── /v1/me/profile ────────────────────────────────────────────────────────────

app.get('/v1/me/profile', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  if (!user) return res.status(404).json({ error: 'not_found' });
  const favCount = db.prepare('SELECT COUNT(*) AS c FROM favorites WHERE user_id = ?').get(user.id).c;
  res.json({ ...publicUser(user), favouritesCount: favCount });
});

app.put('/v1/me/profile', requireAuth, (req, res) => {
  const { name, language, tradition, region, experience } = req.body;
  db.prepare(`UPDATE users SET
    name = COALESCE(?, name),
    language = COALESCE(?, language),
    tradition = COALESCE(?, tradition),
    region = COALESCE(?, region),
    experience = COALESCE(?, experience)
    WHERE id = ?`).run(name ?? null, language ?? null, tradition ?? null, region ?? null, experience ?? null, req.user.userId);
  res.json({ ok: true });
});

// ── /v1/admin — admin-only CRUD ───────────────────────────────────────────────

app.get('/v1/admin/practices', requireAuth, requireAdmin, (req, res) => {
  res.json({ practices: loadAllPractices() });
});

app.post('/v1/admin/practices', requireAuth, requireAdmin, (req, res) => {
  const practice = req.body;
  if (!practice.id || !practice.title) return res.status(400).json({ error: 'missing_fields' });
  if (db.prepare('SELECT 1 FROM practices WHERE id = ?').get(practice.id)) {
    return res.status(409).json({ error: 'id_taken' });
  }
  db.prepare('INSERT INTO practices (id, data) VALUES (?, ?)').run(practice.id, JSON.stringify(practice));
  res.status(201).json({ ok: true });
});

app.put('/v1/admin/practices/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT data FROM practices WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'not_found' });
  const merged = { ...JSON.parse(existing.data), ...req.body, id: req.params.id };
  db.prepare('UPDATE practices SET data = ? WHERE id = ?').run(JSON.stringify(merged), req.params.id);
  res.json({ ok: true });
});

app.delete('/v1/admin/practices/:id', requireAuth, requireAdmin, (req, res) => {
  const info = db.prepare('DELETE FROM practices WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'not_found' });
  res.json({ ok: true });
});

app.get('/v1/admin/users', requireAuth, requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, email_verified, sso_provider, avatar_url, created_at, streak FROM users ORDER BY created_at DESC').all();
  res.json({ users });
});

app.put('/v1/admin/users/:id', requireAuth, requireAdmin, (req, res) => {
  const user = db.prepare('SELECT 1 FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'not_found' });
  const { role, name } = req.body;
  db.prepare(`UPDATE users SET
    role = COALESCE(?, role),
    name = COALESCE(?, name)
    WHERE id = ?`).run(role ?? null, name ?? null, req.params.id);
  res.json({ ok: true });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Mantrify API listening on http://localhost:${PORT}`);
});
