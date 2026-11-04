"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { applyFilters, DEFAULT_FILTERS, WINE_TYPES } from "@/lib/filters";
import { WINE_TYPE_LABELS } from "@/lib/format";
import { formatDistance, nearestStore } from "@/lib/stores";
import type { Store, WineType, WineView } from "@/lib/types";
import { WineRow } from "./BesteKjop";
import { Eyebrow, heading, secondaryButton } from "./ui";

const TOP_COUNT = 5;

type Status = "locating" | "found" | "failed";

type Props = {
  wines: WineView[];
  stores: Store[];
  stockNote: string;
};

export function Polet({ wines, stores, stockNote }: Props) {
  const [status, setStatus] = useState<Status>("locating");
  const [failure, setFailure] = useState("");
  const [store, setStore] = useState<Store>();
  const [distance, setDistance] = useState<number>();
  const [type, setType] = useState<WineType>();
  const started = useRef(false);

  // Posisjonen brukes bare her i nettleseren og sendes aldri til serveren.
  function requestPosition() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = nearestStore(stores, {
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setStore(nearest.store);
        setDistance(nearest.km);
        setStatus("found");
      },
      (error) => {
        setFailure(
          error.code === error.PERMISSION_DENIED
            ? "Du har ikke gitt tilgang til posisjonen din."
            : "Vi fant ikke posisjonen din.",
        );
        setStatus("failed");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  // Siden åpnes av et trykk på «Jeg står på polet», så vi spør med en gang.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    requestPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- skal bare kjøre én gang
  }, []);

  function retry() {
    setStatus("locating");
    requestPosition();
  }

  function chooseStore(id: string) {
    setStore(stores.find((s) => s.id === id));
    setDistance(undefined);
    setStatus("found");
  }

  const top = store
    ? applyFilters(wines, {
        ...DEFAULT_FILTERS,
        availability: "butikk",
        store: store.id,
        types: type ? [type] : [],
      }).slice(0, TOP_COUNT)
    : [];

  return (
    <div className="mx-auto flex max-w-[840px] flex-col gap-8 px-6 pt-16 pb-28 max-sm:pt-10 max-sm:pb-16">
      <div className="flex flex-col gap-4">
        <Eyebrow>Jeg står på polet</Eyebrow>
        <h1 className={`${heading} text-h1-page`}>
          De beste kjøpene akkurat her.
        </h1>
      </div>

      <section
        aria-label="Butikk"
        className="flex flex-col gap-4 rounded-card-lg border border-line bg-surface p-7 max-sm:p-5"
      >
        <p role="status" className="m-0 text-[17px] leading-[1.5]">
          {status === "locating" && !store && "Finner nærmeste pol …"}
          {store && (
            <>
              <strong className="font-semibold">{store.name}</strong>
              {distance !== undefined && ` · ${formatDistance(distance)} unna`}
            </>
          )}
          {status === "failed" && (
            <span className={store ? "mt-1 block text-[15px] text-text-2" : ""}>
              {failure} Velg butikk selv.
            </span>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="pol" className="sr-only">
            Velg butikk
          </label>
          <select
            id="pol"
            value={store?.id ?? ""}
            onChange={(event) => chooseStore(event.target.value)}
            className="h-11 min-w-0 flex-[1_1_220px] rounded-[14px] border border-input-border bg-surface px-3 text-[15px] text-ink"
          >
            <option value="" disabled>
              Velg Vinmonopolet-butikk
            </option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={retry}
            disabled={status === "locating"}
            className={`${secondaryButton} min-h-11 text-[15px] disabled:opacity-50`}
          >
            Finn nærmeste
          </button>
        </div>
        <p className="m-0 text-[13px] text-text-3">
          Posisjonen din brukes bare på enheten din og lagres ikke.
        </p>
      </section>

      {store && (
        <section aria-labelledby="topp" className="flex flex-col gap-5">
          <h2 id="topp" className={`${heading} text-[32px] tracking-[-0.02em]`}>
            Topp {TOP_COUNT} her
          </h2>
          <div role="group" aria-label="Velg type" className="flex flex-wrap gap-1.5">
            <TypeButton on={!type} onClick={() => setType(undefined)}>
              Alle
            </TypeButton>
            {WINE_TYPES.map((wineType) => (
              <TypeButton
                key={wineType}
                on={type === wineType}
                onClick={() => setType(wineType)}
              >
                {WINE_TYPE_LABELS[wineType]}
              </TypeButton>
            ))}
          </div>

          {top.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-card border border-line bg-surface p-8">
              <p className="m-0 font-display text-2xl font-semibold tracking-[-0.02em]">
                Ingen smakte viner her.
              </p>
              <p className="m-0 text-[15px] text-text-2">
                Velg en annen type, eller se{" "}
                <Link href="/beste-kjop" className="text-ink underline">
                  alle beste kjøp
                </Link>
                .
              </p>
            </div>
          ) : (
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {top.map((wine) => (
                <WineRow key={wine.id} wine={wine} />
              ))}
            </ol>
          )}
          <p className="m-0 text-center text-[13px] text-text-3">{stockNote}</p>
        </section>
      )}
    </div>
  );
}

function TypeButton({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-11 rounded-full border px-3.5 text-sm font-medium ${
        on ? "border-ink bg-ink text-bg" : "border-input-border bg-surface text-ink"
      }`}
    >
      {children}
    </button>
  );
}
