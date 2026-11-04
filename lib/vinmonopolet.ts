import { cacheLife } from "next/cache";
import { parseStore, type RawStore } from "./stores";
import type { PolStore } from "./types";

const STORES_URL = "https://apis.vinmonopolet.no/stores/v0/details";

// Hentes på serveren, så nøkkelen aldri når nettleseren og dataene ikke ligger i repoet.
export async function getPolStores(): Promise<PolStore[]> {
  "use cache";

  const key = process.env.VINMONOPOLET_API_KEY?.trim();
  const response = key
    ? await fetch(STORES_URL, {
        headers: { "Ocp-Apim-Subscription-Key": key },
      }).catch(() => undefined)
    : undefined;

  if (!response?.ok) {
    cacheLife("minutes");
    return [];
  }

  cacheLife("days");
  const stores: RawStore[] = await response.json();
  return stores
    .map(parseStore)
    .filter((store) => store !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name, "nb"));
}
