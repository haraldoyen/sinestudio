import type { Stock, TastingResult, Verdict, Wine } from "./types";

// Eksempelvinene finnes ikke hos Vinmonopolet, så lenkene går til forsiden deres.
export const VINMONOPOLET_URL = "https://www.vinmonopolet.no/";

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

export function summarizeVerdicts(
  verdicts: Verdict[],
  priceNok: number,
): TastingResult {
  const scores = verdicts.map((v) => v.score);
  const guessedPrice = mean(verdicts.map((v) => v.guessedPriceNok));

  return {
    score: Math.round(mean(scores)),
    spread: Math.max(...scores) - Math.min(...scores),
    guessedPriceNok: Math.round(guessedPrice),
    guessedAbv: mean(verdicts.map((v) => v.guessedAbv)),
    tastesDearerByNok: Math.max(0, Math.round(guessedPrice - priceNok)),
  };
}

export function stockLabel(stock: Stock, assortment: Wine["assortment"]) {
  if (!stock.inStock) return "Ikke på lager";
  if (assortment === "bestilling") return "Bestillingsutvalget";
  if (stock.storeIds.length === 1) return "Få igjen";
  return `På lager i ${stock.storeIds.length} butikker`;
}
