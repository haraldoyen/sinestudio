import type { Metadata } from "next";
import { Polet } from "@/components/Polet";
import { SiteHeader } from "@/components/SiteHeader";
import { getPolStores } from "@/lib/vinmonopolet";
import { getInStockWines } from "@/lib/wines";

export const metadata: Metadata = {
  title: "Jeg står på polet",
  description: "Finn nærmeste Vinmonopolet og se panelets beste kjøp.",
};

export default async function PoletPage() {
  const stores = await getPolStores();

  return (
    <>
      <SiteHeader />
      <main>
        <Polet wines={getInStockWines()} stores={stores} />
      </main>
    </>
  );
}
