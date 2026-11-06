export type WineType = "rod" | "hvit" | "rose" | "musserende" | "sot" | "sterk";

export type Assortment = "basis" | "bestilling" | "annet";

export type FoodCategory =
  | "Fisk"
  | "Skalldyr"
  | "Fjærkre"
  | "Storfe"
  | "Lam"
  | "Vilt"
  | "Ost"
  | "Vegetar";

export type Judge = {
  id: string;
  code: string; // det eneste som vises offentlig som navn
  role: string;
  yearsExperience: number;
  photoUrl?: string; // bilde uten ansikt
};

export type Wine = {
  id: string;
  slug: string;
  name: string;
  producer: string;
  country: string;
  region: string;
  vintage?: number;
  type: WineType;
  grapes: { name: string; percent?: number }[];
  abv: number;
  vinmonopoletId: string;
  priceNok: number;
  assortment?: Assortment;
  organic?: boolean;
  volumeCl: number;
  packaging: "flaske" | "bag-in-box";
  foodCategories: FoodCategory[]; // grovinndelingen i filteret
  foodPairings: string[]; // konkrete retter på vinsiden
  drinkFrom?: number;
  drinkTo?: number;
  servingTempC?: number[];
  imageUrl?: string;
  isExample?: boolean; // ekte vin panelet ikke har smakt
};

export type Verdict = {
  judgeId: string;
  score: number;
  guessedPriceNok: number;
  guessedAbv: number;
};

export type Tasting = {
  id: string;
  wineId: string;
  date: string;
  summary: string;
  verdicts: Verdict[]; // nøyaktig 3
};

// Kommer fra Vinmonopolet, derfor adskilt fra Wine.
export type Stock = {
  wineId: string;
  inStock: boolean;
  storeIds: string[];
};

export type Store = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type DayHours = { open: string; close: string } | null;

// Ekte butikk fra Vinmonopolet. Har ingen lagerdata.
export type PolStore = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: DayHours[]; // mandag først
  exceptions: Record<string, DayHours>; // nøkkel: yyyy-MM-dd
};

export type TastingResult = {
  score: number;
  spread: number;
  guessedPriceNok: number;
  guessedAbv: number;
  tastesDearerByNok: number; // 0 når panelet ikke gjettet over faktisk pris
};

export type WineView = Wine &
  TastingResult & {
    tastingDate: string;
    summary: string;
    verdicts: (Verdict & { judgeCode: string })[];
    stock: Stock;
  };
