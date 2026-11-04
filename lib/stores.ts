import type { Store } from "./types";

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

export function nearestStore(stores: Store[], position: Position) {
  return stores
    .map((store) => ({ store, km: distanceKm(position, store) }))
    .sort((a, b) => a.km - b.km)[0];
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 100) * 10} m`;
  const digits = km < 10 ? 1 : 0;
  return `${km.toFixed(digits).replace(".", ",")} km`;
}
