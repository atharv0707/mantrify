import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const BCRYPT_ROUNDS = 12;

// ── Passwords ─────────────────────────────────────────────────────────────────

export async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

export function hashPasswordSync(plaintext) {
  return bcrypt.hashSync(plaintext, BCRYPT_ROUNDS);
}

export async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

// ── JWT ───────────────────────────────────────────────────────────────────────

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} environment variable is required`);
  return v;
}

export function signAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    requireEnv('JWT_SECRET'),
    { expiresIn: '1h', issuer: 'mantrify' }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireEnv('JWT_SECRET'), { issuer: 'mantrify' });
}

// ── Refresh tokens (opaque, stored as SHA-256 hash) ──────────────────────────

export function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function refreshTokenExpiresAt() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString();
}

// ── OTP codes (email verification, password reset) ───────────────────────────

export function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

export function otpExpiresAt(minutes = 30) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

// ── Google ID token verification ─────────────────────────────────────────────
// Verifies by calling Google's tokeninfo endpoint — no extra deps needed.

export async function verifyGoogleToken(idToken) {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Invalid Google ID token');
  const data = await res.json();

  if (data.error) throw new Error(data.error_description ?? 'Invalid Google token');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId && data.aud !== clientId) {
    throw new Error('Google token audience mismatch');
  }

  return {
    email: data.email,
    emailVerified: data.email_verified === 'true',
    name: data.name || data.email.split('@')[0],
    picture: data.picture,
    sub: data.sub,
  };
}

// ── Google access token verification ─────────────────────────────────────────
// Used when expo-auth-session returns an access_token (Expo Go managed workflow).

export async function verifyGoogleAccessToken(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Invalid Google access token');
  const data = await res.json();
  if (data.error) throw new Error(data.error_description ?? 'Invalid Google token');
  return {
    email: data.email,
    emailVerified: data.email_verified === true,
    name: data.name || data.email?.split('@')[0] || 'User',
    picture: data.picture ?? null,
    sub: data.sub,
  };
}

// ── Apple identity token verification ────────────────────────────────────────
// Fetches Apple's public JWKS and verifies the JWT signature using Node crypto.

export async function verifyAppleToken(identityToken) {
  // Fetch Apple's public keys
  const jwksRes = await fetch('https://appleid.apple.com/auth/keys');
  if (!jwksRes.ok) throw new Error('Failed to fetch Apple public keys');
  const { keys } = await jwksRes.json();

  // Decode header to find the right key
  const [headerB64] = identityToken.split('.');
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());

  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('No matching Apple public key found');

  // Convert JWK to PEM using Node's built-in crypto (Node 15+)
  const keyObject = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const pem = keyObject.export({ type: 'spki', format: 'pem' });

  // Verify signature and claims
  const payload = jwt.verify(identityToken, pem, {
    algorithms: ['RS256'],
    issuer: 'https://appleid.apple.com',
  });

  return {
    sub: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
  };
}
