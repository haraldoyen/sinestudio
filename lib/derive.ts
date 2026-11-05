import type { Stock, TastingResult, Verdict, Wine } from "./types";

// Eksempelvinene finnes ikke hos Vinmonopolet, så de lenker til forsiden deres.
export function vinmonopoletUrl(productId: string) {
  const base = "https://www.vinmonopolet.no/";
  return /^\d+$/.test(productId) ? `${base}p/${productId}` : base;
}

// Eksempelvinene har varenumre som EKS-001 og får ikke bilde.
export function vinmonopoletImageUrl(productId: string, size: 300 | 515 | 1200) {
  if (!/^\d+$/.test(productId)) return undefined;
  const id = productId.replace(/^0+/, "");
  return `https://bilder.vinmonopolet.no/cache/${size}x${size}-0/${id}-1.jpg`;
}

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
