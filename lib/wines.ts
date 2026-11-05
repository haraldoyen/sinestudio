import rawData from "../data/eksempeldata.json";
import { summarizeVerdicts } from "./derive";
import type { Judge, Stock, Store, Tasting, Wine, WineView } from "./types";

// Eneste sted som vet hvor dataene kommer fra. Bytt ut innholdet her når
// Vinmonopolet og en database kobles på, så slipper sidene å endres.
const data = rawData as unknown as {
  meta: {
    example: boolean;
    featuredWineId: string;
    stockUpdatedAt: string | null;
  };
  judges: Judge[];
  stores: Store[];
  wines: Wine[];
  tastings: Tasting[];
  stock: Stock[];
};

export const getJudges = () => data.judges;
export const getStores = () => data.stores;

export function byScore(a: WineView, b: WineView) {
  return (
    b.score - a.score ||
    a.priceNok - b.priceNok ||
    a.name.localeCompare(b.name, "nb")
  );
}

function toView(wine: Wine): WineView | undefined {
  const tasting = data.tastings.find((t) => t.wineId === wine.id);
  if (!tasting) return undefined;

  return {
    ...wine,
    ...summarizeVerdicts(tasting.verdicts, wine.priceNok),
    tastingDate: tasting.date,
    summary: tasting.summary,
    verdicts: tasting.verdicts.map((verdict) => ({
      ...verdict,
      judgeCode:
        data.judges.find((j) => j.id === verdict.judgeId)?.code ?? "Dommer",
    })),
    stock: data.stock.find((s) => s.wineId === wine.id) ?? {
      wineId: wine.id,
      inStock: false,
      storeIds: [],
    },
  };
}

export function getAllWines() {
  return data.wines
    .map(toView)
    .filter((wine) => wine !== undefined)
    .sort(byScore);
}

export const getInStockWines = () =>
  getAllWines().filter((wine) => wine.stock.inStock);

export const getWineBySlug = (slug: string) =>
  getAllWines().find((wine) => wine.slug === slug);

export function getFeaturedWine() {
  const wines = getInStockWines();
  return wines.find((w) => w.id === data.meta.featuredWineId) ?? wines[0];
}

export function isBestInType(wine: WineView) {
  return getInStockWines().find((w) => w.type === wine.type)?.id === wine.id;
}

export function getSimilarWines(wine: WineView, count = 3) {
  const grapes = new Set(wine.grapes.map((g) => g.name));
  const closeness = (other: WineView) =>
    other.grapes.filter((g) => grapes.has(g.name)).length * 2 +
    (other.country === wine.country ? 1 : 0);

  return getInStockWines()
    .filter((other) => other.type === wine.type && other.id !== wine.id)
    .sort((a, b) => closeness(b) - closeness(a) || byScore(a, b))
    .slice(0, count);
}

export function getCountries() {
  const counts = new Map<string, number>();
  for (const { country } of getInStockWines()) {
    counts.set(country, (counts.get(country) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "nb"))
    .map(([country]) => country);
}

export function getGrapes() {
  const names = getInStockWines().flatMap((w) => w.grapes.map((g) => g.name));
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, "nb"));
}

export function getStockNote() {
  if (data.meta.example) {
    return "Eksempeldata. Pris og lagerstatus hentes fra Vinmonopolet når koblingen er på plass.";
  }
  return `Pris og lagerstatus hentes fra Vinmonopolet, sist oppdatert ${data.meta.stockUpdatedAt}.`;
}
