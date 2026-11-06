import { WINE_TYPE_LABELS } from "./format";
import type { Assortment, FoodCategory, Store, WineType, WineView } from "./types";

export const NO_PRICE_LIMIT = 1000;
export const MIN_SCORE_FLOOR = 80;
export const MIN_SCORE_CEILING = 98;
export const PRICE_STEP = 25;
export const PRICE_FLOOR = 100;
export const PRICE_PRESETS = [150, 200, 300, 500];
export const WINE_TYPES = Object.keys(WINE_TYPE_LABELS) as WineType[];
export const FOOD_CATEGORIES: FoodCategory[] = [
  "Fisk",
  "Skalldyr",
  "Fjærkre",
  "Storfe",
  "Lam",
  "Vilt",
  "Ost",
  "Vegetar",
];

export const ASSORTMENT_LABELS: Record<Assortment, string> = {
  basis: "Basisutvalget",
  bestilling: "Bestillingsutvalget",
  annet: "Andre utvalg",
};
export const ASSORTMENTS = Object.keys(ASSORTMENT_LABELS) as Assortment[];
const VINTAGE_MIN = 1900;
const VINTAGE_MAX = 2100;

export const SORT_OPTIONS = {
  score: "Høyest Sine-score",
  "pris-lav": "Lavest pris",
  "pris-hoy": "Høyest pris",
  nyeste: "Nyeste smakinger",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

export type Filters = {
  q: string;
  maxPrice: number;
  minScore: number;
  types: WineType[];
  availability: "alle" | "butikk";
  store: string;
  assortments: Assortment[];
  countries: string[];
  grape: string;
  producer: string;
  vintageFrom: number | null;
  vintageTo: number | null;
  foods: FoodCategory[];
  organic: boolean;
  halfBottle: boolean;
  bagInBox: boolean;
  sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = {
  q: "",
  maxPrice: NO_PRICE_LIMIT,
  minScore: MIN_SCORE_FLOOR,
  types: [],
  availability: "alle",
  store: "",
  assortments: [],
  countries: [],
  grape: "",
  producer: "",
  vintageFrom: null,
  vintageTo: null,
  foods: [],
  organic: false,
  halfBottle: false,
  bagInBox: false,
  sort: "score",
};

type ParamSource = Pick<URLSearchParams, "get" | "getAll">;

function parseNumber(raw: string | null, min: number, max: number, step: number, fallback: number) {
  const value = Number(raw);
  if (raw === null || raw === "" || !Number.isFinite(value)) return fallback;
  const clamped = Math.min(max, Math.max(min, value));
  return min + Math.round((clamped - min) / step) * step;
}

function parseYear(raw: string | null) {
  if (!raw || !/^\d{4}$/.test(raw)) return null;
  const year = Number(raw);
  return year >= VINTAGE_MIN && year <= VINTAGE_MAX ? year : null;
}

const isOneOf = <T extends string>(allowed: readonly T[]) => (value: string): value is T =>
  (allowed as readonly string[]).includes(value);

export function parseFilters(params: ParamSource): Filters {
  const sort = params.get("sorter") ?? "";

  return {
    q: params.get("q") ?? "",
    maxPrice: parseNumber(params.get("maks"), PRICE_FLOOR, NO_PRICE_LIMIT, PRICE_STEP, NO_PRICE_LIMIT),
    minScore: parseNumber(params.get("min"), MIN_SCORE_FLOOR, MIN_SCORE_CEILING, 1, MIN_SCORE_FLOOR),
    types: params.getAll("type").filter(isOneOf(WINE_TYPES)),
    availability: params.get("lager") === "butikk" ? "butikk" : "alle",
    store: params.get("butikk") ?? "",
    // «basis=1» er det gamle formatet, så delte lenker fortsatt virker.
    assortments: [
      ...new Set([
        ...params.getAll("utvalg").filter(isOneOf(ASSORTMENTS)),
        ...(params.get("basis") === "1" ? (["basis"] as const) : []),
      ]),
    ],
    countries: params.getAll("land"),
    grape: params.get("drue") ?? "",
    producer: params.get("produsent") ?? "",
    vintageFrom: parseYear(params.get("argang-fra")),
    vintageTo: parseYear(params.get("argang-til")),
    foods: params.getAll("mat").filter(isOneOf(FOOD_CATEGORIES)),
    organic: params.get("okologisk") === "1",
    halfBottle: params.get("halvflaske") === "1",
    bagInBox: params.get("bib") === "1",
    sort: sort in SORT_OPTIONS ? (sort as SortKey) : "score",
  };
}

export function serializeFilters(filters: Filters) {
  const params = new URLSearchParams();
  const f = filters;

  if (f.q) params.set("q", f.q);
  if (f.maxPrice < NO_PRICE_LIMIT) params.set("maks", String(f.maxPrice));
  if (f.minScore > MIN_SCORE_FLOOR) params.set("min", String(f.minScore));
  f.types.forEach((type) => params.append("type", type));
  if (f.availability === "butikk") params.set("lager", "butikk");
  if (f.availability === "butikk" && f.store) params.set("butikk", f.store);
  f.assortments.forEach((assortment) => params.append("utvalg", assortment));
  f.countries.forEach((country) => params.append("land", country));
  if (f.grape) params.set("drue", f.grape);
  if (f.producer) params.set("produsent", f.producer);
  if (f.vintageFrom !== null) params.set("argang-fra", String(f.vintageFrom));
  if (f.vintageTo !== null) params.set("argang-til", String(f.vintageTo));
  f.foods.forEach((food) => params.append("mat", food));
  if (f.organic) params.set("okologisk", "1");
  if (f.halfBottle) params.set("halvflaske", "1");
  if (f.bagInBox) params.set("bib", "1");
  if (f.sort !== "score") params.set("sorter", f.sort);

  return params.toString();
}

// «Rose» skal treffe «Rosé» og «chateau» skal treffe «Château».
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("nb");

function matchesQuery(wine: WineView, query: string) {
  const haystack = normalize(
    [
      wine.name,
      wine.producer,
      wine.region,
      wine.country,
      WINE_TYPE_LABELS[wine.type],
      ...wine.grapes.map((g) => g.name),
    ].join(" "),
  );
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

function matchesFormat(wine: WineView, f: Filters) {
  if (!f.halfBottle && !f.bagInBox) return true;
  return (
    (f.halfBottle && wine.volumeCl === 37.5) ||
    (f.bagInBox && wine.packaging === "bag-in-box")
  );
}

function matchesVintage(wine: WineView, f: Filters) {
  if (f.vintageFrom === null && f.vintageTo === null) return true;
  // Viner uten årgang faller ut så snart et årgangsfilter er satt.
  if (wine.vintage === undefined) return false;
  return (
    (f.vintageFrom === null || wine.vintage >= f.vintageFrom) &&
    (f.vintageTo === null || wine.vintage <= f.vintageTo)
  );
}

function matches(wine: WineView, f: Filters) {
  return (
    wine.stock.inStock &&
    (f.maxPrice >= NO_PRICE_LIMIT || wine.priceNok <= f.maxPrice) &&
    wine.score >= f.minScore &&
    (f.types.length === 0 || f.types.includes(wine.type)) &&
    (f.availability !== "butikk" || !f.store || wine.stock.storeIds.includes(f.store)) &&
    (f.assortments.length === 0 ||
      (wine.assortment !== undefined && f.assortments.includes(wine.assortment))) &&
    (f.countries.length === 0 || f.countries.includes(wine.country)) &&
    (!f.grape || wine.grapes.some((g) => g.name === f.grape)) &&
    (!f.producer || wine.producer === f.producer) &&
    matchesVintage(wine, f) &&
    (f.foods.length === 0 || f.foods.some((food) => wine.foodCategories.includes(food))) &&
    (!f.organic || wine.organic === true) &&
    matchesFormat(wine, f) &&
    matchesQuery(wine, f.q)
  );
}

const SORTERS: Record<SortKey, (a: WineView, b: WineView) => number> = {
  score: (a, b) => b.score - a.score || a.priceNok - b.priceNok,
  "pris-lav": (a, b) => a.priceNok - b.priceNok || b.score - a.score,
  "pris-hoy": (a, b) => b.priceNok - a.priceNok || b.score - a.score,
  nyeste: (a, b) => b.tastingDate.localeCompare(a.tastingDate) || b.score - a.score,
};

export function applyFilters(wines: WineView[], filters: Filters) {
  return wines
    .filter((wine) => matches(wine, filters))
    .sort(SORTERS[filters.sort]);
}

export type FilterChip = {
  key: string;
  label: string;
  without: Partial<Filters>;
};

export function activeChips(f: Filters, stores: Store[]): FilterChip[] {
  const chips: FilterChip[] = [];
  const add = (key: string, label: string, without: Partial<Filters>) =>
    chips.push({ key, label, without });

  if (f.q) add("q", `«${f.q}»`, { q: "" });
  if (f.maxPrice < NO_PRICE_LIMIT) {
    add("maks", `Under ${f.maxPrice} kr`, { maxPrice: NO_PRICE_LIMIT });
  }
  if (f.minScore > MIN_SCORE_FLOOR) {
    add("min", `Fra ${f.minScore} poeng`, { minScore: MIN_SCORE_FLOOR });
  }
  f.types.forEach((type) =>
    add(`type-${type}`, WINE_TYPE_LABELS[type], {
      types: f.types.filter((t) => t !== type),
    }),
  );
  if (f.availability === "butikk") {
    const store = stores.find((s) => s.id === f.store);
    add("butikk", store?.name ?? "Min butikk", { availability: "alle", store: "" });
  }
  f.assortments.forEach((assortment) =>
    add(`utvalg-${assortment}`, ASSORTMENT_LABELS[assortment], {
      assortments: f.assortments.filter((a) => a !== assortment),
    }),
  );
  f.countries.forEach((country) =>
    add(`land-${country}`, country, {
      countries: f.countries.filter((c) => c !== country),
    }),
  );
  if (f.grape) add("drue", f.grape, { grape: "" });
  if (f.producer) add("produsent", f.producer, { producer: "" });
  if (f.vintageFrom !== null || f.vintageTo !== null) {
    const label =
      f.vintageFrom === f.vintageTo
        ? `Årgang ${f.vintageFrom}`
        : f.vintageFrom === null
          ? `Årgang til ${f.vintageTo}`
          : f.vintageTo === null
            ? `Årgang fra ${f.vintageFrom}`
            : `Årgang ${f.vintageFrom}–${f.vintageTo}`;
    add("argang", label, { vintageFrom: null, vintageTo: null });
  }
  f.foods.forEach((food) =>
    add(`mat-${food}`, food, { foods: f.foods.filter((x) => x !== food) }),
  );
  if (f.organic) add("okologisk", "Økologisk", { organic: false });
  if (f.halfBottle) add("halvflaske", "Halvflaske", { halfBottle: false });
  if (f.bagInBox) add("bib", "Bag-in-box", { bagInBox: false });

  return chips;
}

// Filtrene under «Flere filtre». Resten vises alltid.
export function countAdvanced(f: Filters) {
  return (
    f.assortments.length +
    f.countries.length +
    (f.grape ? 1 : 0) +
    (f.producer ? 1 : 0) +
    (f.vintageFrom !== null || f.vintageTo !== null ? 1 : 0) +
    (f.organic ? 1 : 0) +
    (f.halfBottle ? 1 : 0) +
    (f.bagInBox ? 1 : 0)
  );
}
