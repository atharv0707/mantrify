# Mantrify

A guided prayer companion — see [design/Mantrify-Design.md](design/Mantrify-Design.md) for the full
product/technical design and [design/Mantrify-Prototype.html](design/Mantrify-Prototype.html) for the
original visual prototype.

This repo contains a working implementation of the MVP described in the design doc:

- **`backend/`** — Node.js + Express + SQLite API serving the content model (practices, panchang/calendar,
  routine, favorites, profile, entitlements). See `backend/src/seedData.js` for the seeded content.
- **`app/`** — Expo (React Native + TypeScript) consumer app with the five tabs (Today, Calendar, Explore,
  Routine, Profile), the practice guide player with japa counter, and a Mantrify Plus paywall.

## Subscription / Mantrify Plus

Per the design doc, real billing goes through StoreKit / Google Play Billing + RevenueCat. That's out of
scope for now — the paywall screen is fully built and the entitlement model (`free` vs `plus`, locked
content) is wired end-to-end, but `POST /v1/me/entitlements/upgrade` is a **local stub** that just flips
the demo user to `plus` so the rest of the app (locked guides, profile state) can be exercised.

## Running it

### 1. Backend

```sh
cd backend
npm install   # first time only
npm start     # http://localhost:4000
```

This seeds a local SQLite database (`backend/mantrify.db`) on first run with a demo user, sample
practices/festivals, a default routine, and favorites.

### 2. App

```sh
cd app
npm install   # first time only
npx expo start
```

Then press `w` for web, or scan the QR code with Expo Go on a device on the same network. The app
auto-detects the Metro dev server's host so it can reach the backend on port 4000 — make sure the backend
is running first.
