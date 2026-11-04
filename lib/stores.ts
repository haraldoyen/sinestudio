import type { DayHours, PolStore } from "./types";

export type Position = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function distanceKm(from: Position, to: Position) {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function nearestStore<T extends Position>(stores: T[], position: Position) {
  return stores
    .map((store) => ({ store, km: distanceKm(position, store) }))
    .sort((a, b) => a.km - b.km)[0];
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 100) * 10} m`;
  const digits = km < 10 ? 1 : 0;
  return `${km.toFixed(digits).replace(".", ",")} km`;
}

type RawHours = {
  openingTime?: string;
  closingTime?: string;
  closed?: boolean;
};

export type RawStore = {
  storeId: string;
  storeName: string;
  status: string;
  address: { street: string; postalCode: string; city: string; gpsCoord: string };
  openingHours: {
    regularHours: (RawHours & { dayOfTheWeek: string })[];
    exceptionHours: (RawHours & { date: string })[];
  };
};

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Tomme tider betyr stengt, også når closed er false.
function toDayHours(raw?: RawHours): DayHours {
  if (!raw || raw.closed || !raw.openingTime || !raw.closingTime) return null;
  return { open: raw.openingTime, close: raw.closingTime };
}

// Gir undefined for det som ikke er en åpen butikk, for eksempel eLager.
export function parseStore(raw: RawStore): PolStore | undefined {
  const [lat, lng] = raw.address.gpsCoord.split(";").map(Number);
  const { regularHours, exceptionHours } = raw.openingHours;
  if (raw.status !== "Open" || regularHours.length === 0) return undefined;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;

  return {
    id: raw.storeId,
    name: raw.storeName,
    address: `${raw.address.street}, ${raw.address.postalCode} ${raw.address.city}`,
    lat,
    lng,
    hours: WEEKDAYS.map((day) =>
      toDayHours(regularHours.find((h) => h.dayOfTheWeek === day)),
    ),
    exceptions: Object.fromEntries(
      exceptionHours.map((h) => [h.date, toDayHours(h)]),
    ),
  };
}

function osloClock(now: Date) {
  const timeZone = "Europe/Oslo";
  return {
    date: now.toLocaleDateString("en-CA", { timeZone }),
    time: now.toLocaleTimeString("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    }),
    weekday: now.toLocaleDateString("en-GB", { timeZone, weekday: "long" }),
  };
}

export function openingStatus(store: PolStore, now: Date) {
  const { date, time, weekday } = osloClock(now);
  const today =
    date in store.exceptions
      ? store.exceptions[date]
      : store.hours[WEEKDAYS.indexOf(weekday)];

  if (today && time < today.open) return `Åpner ${today.open}`;
  if (today && time < today.close) return `Åpent til ${today.close}`;
  return "Stengt nå";
}
