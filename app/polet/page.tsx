import type { Metadata } from "next";
import { Polet } from "@/components/Polet";
import { SiteHeader } from "@/components/SiteHeader";
import { getInStockWines, getStockNote, getStores } from "@/lib/wines";

export const metadata: Metadata = {
  title: "Jeg står på polet",
  description: "Se de beste kjøpene i Vinmonopolet-butikken nærmest deg.",
};

export default function PoletPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Polet
          wines={getInStockWines()}
          stores={getStores()}
          stockNote={getStockNote()}
        />
      </main>
    </>
  );
}
