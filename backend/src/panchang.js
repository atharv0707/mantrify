// Panchang computation using astronomy-engine — a real ephemeris library, deterministic and
// offline-capable, per design §9.2/§12.5 ("an astronomical computation library that derives
// tithi/nakshatra/festival dates deterministically from latitude/longitude + date").
//
// Tithi/nakshatra/yoga are computed from the actual Sun-Moon geometry at sunrise for the given
// date + location. The lunar month (masa) is approximated from the Sun's sidereal longitude
// (solar-month / sauramasa convention), which is a standard approximation; per the design doc,
// festival/observance *names and exact regional variants* still belong in a curated, reviewed
// table layered on top (see seedData.js festivals/weeklyObservances) rather than pure computation.

import * as Astronomy from 'astronomy-engine';

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
  'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const VARAS = ['Ravivar', 'Somvar', 'Mangalvar', 'Budhvar', 'Guruvar', 'Shukravar', 'Shanivar'];

// Rashi (sidereal solar month) -> traditional masa name, sauramasa convention.
const RASHI_TO_MASA = [
  'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin',
  'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna', 'Chaitra',
];

// Default location: New Delhi, IST (UTC+5:30) — see design §9.2, panchang is location/timezone-aware.
const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.209, tzOffsetMinutes: 330 };

// Lahiri ayanamsa, linear approximation (~50.3"/year of precession).
function ayanamsaDegrees(date) {
  const year = date.getUTCFullYear() + (date.getUTCMonth() + 1) / 12;
  return 23.85 + 0.0137 * (year - 2000);
}

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

export function getPanchang(dateStr, location = DEFAULT_LOCATION) {
  const { lat, lng, tzOffsetMinutes } = location;
  const [year, month, day] = dateStr.split('-').map(Number);

  // Weekday (vara) follows the local calendar day, independent of sunrise.
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  const vara = VARAS[weekday];

  // Tithi/nakshatra/masa are computed at sunrise for this location, the traditional reference
  // moment for the day's panchang.
  const localMidnightUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - tzOffsetMinutes * 60000);
  const observer = new Astronomy.Observer(lat, lng, 0);
  let referenceTime;
  try {
    const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, localMidnightUTC, 1.5);
    referenceTime = sunrise ? sunrise.date : localMidnightUTC;
  } catch {
    referenceTime = localMidnightUTC;
  }

  const elongation = Astronomy.MoonPhase(referenceTime); // 0-360, angle Moon is ahead of Sun
  const tithiIndex = Math.floor(elongation / 12); // 0-29
  const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const positionInPaksha = tithiIndex % 15; // 0-14
  const tithi = positionInPaksha === 14
    ? (paksha === 'Shukla Paksha' ? 'Purnima' : 'Amavasya')
    : TITHI_NAMES[positionInPaksha];

  const moonLon = normalizeDegrees(Astronomy.EclipticGeoMoon(referenceTime).lon);
  const nakshatraIndex = Math.floor(moonLon / (360 / 27));
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  const sunLon = Astronomy.SunPosition(referenceTime).elon;
  const siderealSun = normalizeDegrees(sunLon - ayanamsaDegrees(referenceTime));
  const rashiIndex = Math.floor(siderealSun / 30);
  const masa = RASHI_TO_MASA[rashiIndex];

  const flags = [];
  if (positionInPaksha === 10) flags.push('ekadashi'); // 11th tithi, both pakshas
  if (positionInPaksha === 12) flags.push('pradosh'); // 13th tithi (Trayodashi), both pakshas
  if (tithi === 'Purnima') flags.push('purnima');
  if (tithi === 'Amavasya') flags.push('amavasya');

  return { date: dateStr, tithi, paksha, nakshatra, masa, vara, weekday, flags };
}
