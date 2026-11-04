import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { BesteKjop } from "@/components/BesteKjop";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getCountries,
  getGrapes,
  getInStockWines,
  getStockNote,
  getStores,
} from "@/lib/wines";

export const metadata: Metadata = {
  title: "Beste kjøp",
  description: "Finn vinen. Blindsmakt av tre dommere og rangert.",
};

// Rendres per forespørsel, så en delt lenke med filtre gir riktige treff i HTML-en.
async function Results() {
  await connection();

  return (
    <BesteKjop
      wines={getInStockWines()}
      countries={getCountries()}
      grapes={getGrapes()}
      stores={getStores()}
      stockNote={getStockNote()}
    />
  );
}

export default function BesteKjopPage() {
  return (
    <>
      <SiteHeader current="beste-kjop" />
      <main>
        <Suspense fallback={<p className="px-6 py-24 text-center text-text-3">Henter viner …</p>}>
          <Results />
        </Suspense>
      </main>
    </>
  );
}
