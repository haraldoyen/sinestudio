import { describe, expect, it } from "vitest";
import { stockLabel, summarizeVerdicts } from "./derive";
import {
  applyFilters,
  DEFAULT_FILTERS,
  parseFilters,
  serializeFilters,
  type Filters,
} from "./filters";
import { getAllWines, getCountries, getJudges, getWineBySlug } from "./wines";

const wines = getAllWines();
const search = (overrides: Partial<Filters>) =>
  applyFilters(wines, { ...DEFAULT_FILTERS, ...overrides });
const verdict = (score: number, guessedPriceNok: number, guessedAbv = 13) => ({
  judgeId: "dommer-01",
  score,
  guessedPriceNok,
  guessedAbv,
});

describe("avledede verdier", () => {
  it("regner ut score, spredning og gjettet pris", () => {
    const result = summarizeVerdicts(
      [verdict(92, 320, 14), verdict(94, 290, 13.5), verdict(93, 350, 14)],
      189,
    );
    expect(result).toMatchObject({
      score: 93,
      spread: 2,
      guessedPriceNok: 320,
      tastesDearerByNok: 131,
    });
    expect(result.guessedAbv).toBeCloseTo(13.83, 2);
  });

  it("gir 0 når panelet gjettet likt eller under faktisk pris", () => {
    const guesses = [verdict(90, 100), verdict(90, 100), verdict(90, 100)];
    expect(summarizeVerdicts(guesses, 100).tastesDearerByNok).toBe(0);
    expect(summarizeVerdicts(guesses, 150).tastesDearerByNok).toBe(0);
  });

  it("beskriver lagerstatus", () => {
    const stock = { wineId: "x", inStock: true, storeIds: ["a", "b"] };
    expect(stockLabel(stock, "basis")).toBe("På lager i 2 butikker");
    expect(stockLabel({ ...stock, storeIds: ["a"] }, "basis")).toBe("Få igjen");
    expect(stockLabel({ ...stock, storeIds: [] }, "bestilling")).toBe("Bestillingsutvalget");
    expect(stockLabel({ ...stock, inStock: false }, "basis")).toBe("Ikke på lager");
  });
});

describe("eksempeldata", () => {
  it("har nøyaktig tre ulike dommere fra panelet per vin", () => {
    const judgeIds = new Set(getJudges().map((j) => j.id));
    expect(judgeIds.size).toBe(6);
    for (const wine of wines) {
      const ids = wine.verdicts.map((v) => v.judgeId);
      expect(new Set(ids).size).toBe(3);
      expect(ids.every((id) => judgeIds.has(id))).toBe(true);
    }
  });

  it("har unike slugger og er merket som oppdiktet", () => {
    expect(new Set(wines.map((w) => w.slug)).size).toBe(wines.length);
    expect(wines.every((w) => w.vinmonopoletId.startsWith("EKS-"))).toBe(true);
  });

  it("gir flere enn seks land, så «Vis alle land» kan testes", () => {
    expect(getCountries().length).toBeGreaterThan(6);
  });
});

describe("filtre", () => {
  it("skjuler vin som ikke er på lager", () => {
    expect(wines.some((w) => !w.stock.inStock)).toBe(true);
    expect(search({}).every((w) => w.stock.inStock)).toBe(true);
  });

  it("behandler 1000 kr som ingen grense", () => {
    expect(search({}).some((w) => w.priceNok > 1000)).toBe(true);
    expect(search({ maxPrice: 975 }).every((w) => w.priceNok <= 975)).toBe(true);
  });

  it("søker uavhengig av aksenter og på flere ord", () => {
    expect(search({ q: "rose" }).every((w) => w.type === "rose")).toBe(true);
    expect(search({ q: "rose" }).length).toBeGreaterThan(0);
    expect(search({ q: "chateau" }).length).toBe(1);
    expect(search({ q: "riesling mosel" }).length).toBe(1);
    expect(search({ q: "finnes ikke" })).toEqual([]);
  });

  it("gir treff når både halvflaske og bag-in-box er valgt", () => {
    const result = search({ halfBottle: true, bagInBox: true });
    expect(result.some((w) => w.volumeCl === 37.5)).toBe(true);
    expect(result.some((w) => w.packaging === "bag-in-box")).toBe(true);
  });

  it("filtrerer på butikk først når en butikk er valgt", () => {
    expect(search({ availability: "butikk" }).length).toBe(search({}).length);
    const result = search({ availability: "butikk", store: "tromso" });
    expect(result.length).toBeLessThan(search({}).length);
    expect(result.every((w) => w.stock.storeIds.includes("tromso"))).toBe(true);
  });

  it("sorterer", () => {
    const prices = search({ sort: "pris-lav" }).map((w) => w.priceNok);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    const dates = search({ sort: "nyeste" }).map((w) => w.tastingDate);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("URL", () => {
  it("gir tom URL for standardfiltre", () => {
    expect(serializeFilters(DEFAULT_FILTERS)).toBe("");
  });

  it("gjenskaper filtrene fra URL-en", () => {
    const filters: Filters = {
      ...DEFAULT_FILTERS,
      q: "pinot noir",
      maxPrice: 300,
      minScore: 88,
      types: ["rod", "hvit"],
      availability: "butikk",
      store: "oslo",
      basisOnly: true,
      countries: ["Frankrike", "Sør-Afrika"],
      grape: "Riesling",
      foods: ["Fisk", "Fjærkre"],
      organic: true,
      halfBottle: true,
      bagInBox: true,
      sort: "nyeste",
    };
    const url = new URLSearchParams(serializeFilters(filters));
    expect(parseFilters(url)).toEqual(filters);
  });

  it("tåler ugyldige verdier", () => {
    const url = new URLSearchParams("maks=abc&min=500&type=ol&mat=Pizza&sorter=x");
    expect(parseFilters(url)).toEqual({ ...DEFAULT_FILTERS, minScore: 98 });
    expect(parseFilters(new URLSearchParams("maks=137")).maxPrice).toBe(125);
  });
});

describe("oppslag", () => {
  it("finner vin på slug", () => {
    expect(getWineBySlug("serra-escura-tinto-2022")?.score).toBe(93);
    expect(getWineBySlug("finnes-ikke")).toBeUndefined();
  });
});
