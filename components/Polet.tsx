"use client";

import { useEffect, useRef, useState } from "react";
import { applyFilters, DEFAULT_FILTERS, WINE_TYPES } from "@/lib/filters";
import { WINE_TYPE_LABELS } from "@/lib/format";
import { formatDistance, nearestStore, openingStatus } from "@/lib/stores";
import type { PolStore, WineType, WineView } from "@/lib/types";
import { WineRow } from "./BesteKjop";
import { Eyebrow, heading, secondaryButton } from "./ui";

const TOP_COUNT = 5;

type Status = "locating" | "found" | "failed";

type Chosen = {
  store: PolStore;
  opening: string;
  km?: number;
};

type Props = {
  wines: WineView[];
  stores: PolStore[];
};

const choose = (store: PolStore, km?: number): Chosen => ({
  store,
  km,
  opening: openingStatus(store, new Date()),
});

export function Polet({ wines, stores }: Props) {
  const [status, setStatus] = useState<Status>("locating");
  const [failure, setFailure] = useState("");
  const [chosen, setChosen] = useState<Chosen>();
  const [type, setType] = useState<WineType>();
  const started = useRef(false);

  // Posisjonen brukes bare her i nettleseren og sendes aldri til serveren.
  function requestPosition() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { store, km } = nearestStore(stores, {
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setChosen(choose(store, km));
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
    if (started.current || stores.length === 0) return;
    started.current = true;
    requestPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- skal bare kjøre én gang
  }, []);

  function retry() {
    setStatus("locating");
    requestPosition();
  }

  function chooseStore(id: string) {
    const store = stores.find((s) => s.id === id);
    if (!store) return;
    setChosen(choose(store));
    setStatus("found");
  }

  const top = applyFilters(wines, {
    ...DEFAULT_FILTERS,
    types: type ? [type] : [],
  }).slice(0, TOP_COUNT);

  return (
    <div className="mx-auto flex max-w-[840px] flex-col gap-8 px-6 pt-16 pb-28 max-sm:pt-10 max-sm:pb-16">
      <div className="flex flex-col gap-4">
        <Eyebrow>Jeg står på polet</Eyebrow>
        <h1 className={`${heading} text-h1-page`}>
          De beste kjøpene akkurat her.
        </h1>
      </div>

      {stores.length === 0 ? (
        <p role="status" className="m-0 rounded-card border border-line bg-surface p-6 text-[17px]">
          Vi får ikke hentet butikkene akkurat nå. Prøv igjen litt senere.
        </p>
      ) : (
        <section
          aria-label="Butikk"
          className="flex flex-col gap-4 rounded-card-lg border border-line bg-surface p-7 max-sm:p-5"
        >
          <div role="status" className="flex flex-col gap-1">
            {status === "locating" && !chosen && (
              <p className="m-0 text-[17px]">Finner nærmeste pol …</p>
            )}
            {chosen && (
              <>
                <p className="m-0 font-display text-2xl font-semibold tracking-[-0.02em]">
                  {chosen.store.name}
                </p>
                <p className="m-0 text-[15px] text-text-2">
                  {chosen.km !== undefined && `${formatDistance(chosen.km)} unna · `}
                  {chosen.opening}
                </p>
                <p className="m-0 text-sm text-text-3">{chosen.store.address}</p>
              </>
            )}
            {status === "failed" && (
              <p className="m-0 text-[15px] text-text-2">{failure} Velg butikk selv.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="pol" className="sr-only">
              Velg butikk
            </label>
            <select
              id="pol"
              value={chosen?.store.id ?? ""}
              onChange={(event) => chooseStore(event.target.value)}
              className="h-11 min-w-0 flex-[1_1_220px] rounded-[14px] border border-input-border bg-surface px-3 text-[15px] text-ink"
            >
              <option value="" disabled>
                Velg Vinmonopolet-butikk
              </option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
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
      )}

      <section aria-labelledby="topp" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 id="topp" className={`${heading} text-[32px] tracking-[-0.02em]`}>
            Panelets beste kjøp
          </h2>
          <p className="m-0 text-[15px] text-text-2">
            Sjekk hyllen. Vi vet ikke hva denne butikken har inne.
          </p>
        </div>
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

        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {top.map((wine) => (
            <WineRow key={wine.id} wine={wine} />
          ))}
        </ol>
      </section>
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
