"use client";

import { useState } from "react";
import type { WineView } from "@/lib/types";
import { fillGrid, heading, WineCard } from "./ui";

const FILTERS: { id: string; label: string; test: (wine: WineView) => boolean }[] = [
  { id: "alle", label: "Alle", test: () => true },
  { id: "rod", label: "Rødvin", test: (w) => w.type === "rod" },
  { id: "hvit", label: "Hvitvin", test: (w) => w.type === "hvit" },
  { id: "musserende", label: "Musserende", test: (w) => w.type === "musserende" },
  { id: "under-200", label: "Under 200 kr", test: (w) => w.priceNok < 200 },
];

export function BestBuysExcerpt({ wines }: { wines: WineView[] }) {
  const [active, setActive] = useState(FILTERS[0]);
  const shown = wines.filter(active.test).slice(0, 5);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="kjop" className={`${heading} text-h2`}>
          Mest i glasset per krone.
        </h2>
        <div role="group" aria-label="Filtrer viner" className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const on = filter.id === active.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(filter)}
                className={`h-11 rounded-full border px-[18px] text-[15px] font-medium ${
                  on
                    ? "border-ink bg-ink text-bg"
                    : "border-input-border bg-surface text-ink"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4" style={fillGrid(220)}>
        {shown.map((wine, index) => (
          <WineCard key={wine.id} wine={wine} rank={index + 1} />
        ))}
      </div>
    </>
  );
}
