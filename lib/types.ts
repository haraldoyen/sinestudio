export type WineType = "rod" | "hvit" | "rose" | "musserende" | "sot" | "sterk";

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
  assortment?: "basis" | "bestilling" | "annet";
  organic?: boolean;
  volumeCl: number;
  packaging: "flaske" | "bag-in-box";
  foodCategories: FoodCategory[]; // grovinndelingen i filteret
  foodPairings: string[]; // konkrete retter på vinsiden
  drinkFrom?: number;
  drinkTo?: number;
  servingTempC?: number[];
  imageUrl?: string;
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
