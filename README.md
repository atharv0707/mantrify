# Mantrify

A guided prayer companion — see [design/Mantrify-Design.md](design/Mantrify-Design.md) for the full
product/technical design and [design/Mantrify-Prototype.html](design/Mantrify-Prototype.html) for the
original visual prototype.

This repo contains a working implementation of the MVP described in the design doc:

- **`backend/`** — Node.js + Express + SQLite API (practices, panchang/calendar, routine, favorites, profile). See `backend/src/seedData.js` for the seeded content.
- **`app/`** — Expo (React Native + TypeScript) app with five tabs: Today, Calendar, Explore, Routine, Profile.

## Prerequisites

- **Node.js 18 or later** — check with `node --version`
- **Xcode** (for the iOS Simulator) — install from the Mac App Store, then open it once so it installs the Command Line Tools
- **Expo Go** (for a physical iPhone) — install from the [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## Running locally

You need **two terminal windows** running at the same time: one for the backend, one for the app.

### Terminal 1 — Backend

```sh
cd backend
npm install       # first time only
npm start
```

You should see: `Mantrify API listening on http://localhost:4000`

Leave this terminal running.

### Terminal 2 — App

```sh
cd app
npm install       # first time only
npx expo start
```

You will see a QR code and a menu of options. From here:

---

## Opening on the iOS Simulator

1. Make sure Xcode is installed (see Prerequisites).
2. With the Expo terminal open, press **`i`**.

Expo will launch the iOS Simulator and install Expo Go automatically. The app will open inside it.

> If you get an error about no simulator being found, open Xcode → Settings → Platforms and download an iOS Simulator runtime first.

---

## Opening on a physical iPhone

1. Make sure your **iPhone and Mac are on the same Wi-Fi network**.
2. Install **Expo Go** on your iPhone from the App Store.
3. Open the Camera app on your iPhone and point it at the **QR code** shown in the Expo terminal. Tap the banner that appears.
   - Alternatively, open Expo Go and tap **"Scan QR code"**.

The app will load in Expo Go. The backend URL is resolved automatically from the Metro server's IP address — as long as both devices are on the same network, no extra configuration is needed.

> If the app loads but shows a network error (data doesn't appear), check that your Mac's firewall isn't blocking port 4000. Go to System Settings → Network → Firewall and either disable it temporarily or add Node.js as an allowed app.

---

## Subscription / Mantrify Plus

Per the design doc, real billing goes through StoreKit / Google Play Billing + RevenueCat. That's out of scope for now — the paywall screen is fully built and the entitlement model (`free` vs `plus`, locked content) is wired end-to-end, but `POST /v1/me/entitlements/upgrade` is a **local stub** that just flips the demo user to `plus` so the rest of the app (locked guides, profile state) can be exercised.

---

## Troubleshooting

**`npx expo start` fails immediately**
Run `npm install` inside the `app/` directory first.

**Simulator won't open / "No simulator found"**
Open Xcode → Settings → Platforms and download an iOS 17 or iOS 18 runtime, then try again.

**App opens but all screens show a loading spinner or error**
The backend is not running. Open a separate terminal, `cd backend && npm start`, then reload the app (shake the device or press `r` in the Expo terminal).

**Physical iPhone can't reach the backend**
- Confirm both devices are on the same Wi-Fi (not a guest network — many guest networks isolate devices from each other).
- Check the Mac firewall (System Settings → Network → Firewall) isn't blocking port 4000.
- Try turning off the Mac's firewall temporarily to confirm that's the issue.

**"Unable to resolve module" error on start**
Delete `app/node_modules` and run `npm install` inside `app/` again.
