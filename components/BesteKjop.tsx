"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { stockLabel, vinmonopoletUrl } from "@/lib/derive";
import {
  activeChips,
  applyFilters,
  ASSORTMENT_LABELS,
  ASSORTMENTS,
  countAdvanced,
  DEFAULT_FILTERS,
  FOOD_CATEGORIES,
  MIN_SCORE_CEILING,
  MIN_SCORE_FLOOR,
  NO_PRICE_LIMIT,
  parseFilters,
  PRICE_FLOOR,
  PRICE_PRESETS,
  PRICE_STEP,
  serializeFilters,
  SORT_OPTIONS,
  WINE_TYPES,
  type Filters,
  type SortKey,
} from "@/lib/filters";
import { formatOrigin, formatPrice, joinParts, WINE_TYPE_LABELS } from "@/lib/format";
import type { Store, WineView } from "@/lib/types";
import { Eyebrow, heading, ScoreBadge, textInput, WineImage } from "./ui";

const PAGE_SIZE = 8;
const COUNTRIES_SHOWN = 6;

const select =
  "h-11 rounded-[14px] border border-input-border bg-surface px-3 text-[15px] text-ink";

type Props = {
  wines: WineView[];
  countries: string[];
  grapes: string[];
  producers: string[];
  vintages: number[];
  stores: Store[];
  stockNote: string;
};

export function BesteKjop({
  wines,
  countries,
  grapes,
  producers,
  vintages,
  stores,
  stockNote,
}: Props) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => parseFilters(searchParams));
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [allCountries, setAllCountries] = useState(false);
  // Panelet er alltid synlig på stor skjerm. På mobil åpnes det over resultatene.
  const [panelOpen, setPanelOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(() => countAdvanced(filters) > 0);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!panelOpen) return;
    closeButton.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    // Lukk hvis skjermen blir bred nok til at panelet står ved siden av.
    const wide = window.matchMedia("(min-width: 64rem)");
    const onWide = () => wide.matches && setPanelOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [panelOpen]);

  function closePanel() {
    setPanelOpen(false);
    openButton.current?.focus();
  }

  // Next beholder siden skjult ved navigering. Når URL-en endres utenfra
  // (lenke i menyen, brødsmule) må filtrene følge etter. Egne endringer står
  // allerede i location, så de ignoreres selv om searchParams henger etter.
  useEffect(() => {
    const next = parseFilters(searchParams);
    const location = parseFilters(new URLSearchParams(window.location.search));
    if (serializeFilters(next) !== serializeFilters(location)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL-en er et eksternt system
    setFilters((current) =>
      serializeFilters(current) === serializeFilters(next) ? current : next,
    );
  }, [searchParams]);

  function update(changes: Partial<Filters>) {
    const next = { ...filters, ...changes };
    const query = serializeFilters(next);
    setFilters(next);
    setVisible(PAGE_SIZE);
    window.history.replaceState(null, "", query ? `?${query}` : "/beste-kjop");
  }

  function toggle<T>(list: T[], item: T) {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
  }

  const results = applyFilters(wines, filters);
  const chips = activeChips(filters, stores);
  const filterCount = chips.filter((chip) => chip.key !== "q").length;
  const advancedCount = countAdvanced(filters);
  const resultLabel = `${results.length} ${results.length === 1 ? "vin" : "viner"}`;
  const shownCountries =
    allCountries || filters.countries.some((c) => !countries.slice(0, COUNTRIES_SHOWN).includes(c))
      ? countries
      : countries.slice(0, COUNTRIES_SHOWN);

  return (
    <>
      <section className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6 px-6 pt-16 pb-10 max-sm:pt-10">
        <div className="flex max-w-[720px] flex-col gap-4">
          <Eyebrow>Beste kjøp</Eyebrow>
          <h1 className={`${heading} text-h1-page`}>
            Finn vinen. Blindsmakt og rangert.
          </h1>
          <p className="m-0 text-lg leading-[1.6] text-text-2">
            Alle viner er smakt blindt av tre dommere fra panelet. Still inn
            budsjett og smak – vi viser bare det som er på lager hos
            Vinmonopolet.
          </p>
        </div>
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="flex min-w-0 flex-[0_1_420px] gap-2.5 max-md:flex-[1_1_100%]"
        >
          <label htmlFor="sok-bk" className="sr-only">
            Søk etter vin, drue eller produsent
          </label>
          <input
            id="sok-bk"
            type="search"
            value={filters.q}
            onChange={(event) => update({ q: event.target.value })}
            placeholder="Søk vin, drue eller produsent"
            className={`${textInput} w-full`}
          />
        </form>
      </section>

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-8 px-6 pb-28 max-sm:pb-16">
        <aside
          id="filterpanel"
          aria-labelledby="filtre-tittel"
          role={panelOpen ? "dialog" : undefined}
          aria-modal={panelOpen || undefined}
          className={`flex-col bg-surface lg:flex lg:min-w-0 lg:flex-[1_1_280px] lg:max-w-[320px] lg:rounded-card-lg lg:border lg:border-line ${
            panelOpen ? "max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:flex" : "max-lg:hidden"
          }`}
        >
          <div className="flex min-h-0 flex-col gap-7 p-7 max-lg:flex-1 max-lg:overflow-y-auto max-lg:p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 id="filtre-tittel" className={`${heading} text-[22px] tracking-[-0.02em]`}>
                Filtre
              </h2>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => update({ ...DEFAULT_FILTERS, q: filters.q, sort: filters.sort })}
                  className="min-h-11 text-sm font-medium underline"
                >
                  Nullstill
                </button>
                <button
                  ref={closeButton}
                  type="button"
                  onClick={closePanel}
                  aria-label="Lukk filtre"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-input-border text-xl lg:hidden"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </div>

            <Group legend="Budsjett">
              <label htmlFor="maks" className="flex justify-between text-[15px]">
                <span className="text-text-3">Maks pris</span>
                <strong className="font-semibold">
                  {filters.maxPrice >= NO_PRICE_LIMIT
                    ? "Ingen grense"
                    : formatPrice(filters.maxPrice)}
                </strong>
              </label>
              <input
                id="maks"
                type="range"
                min={PRICE_FLOOR}
                max={NO_PRICE_LIMIT}
                step={PRICE_STEP}
                value={filters.maxPrice}
                onChange={(event) => update({ maxPrice: Number(event.target.value) })}
                className="h-11 w-full"
              />
              <div className="flex flex-wrap gap-1.5">
                {PRICE_PRESETS.map((price) => (
                  <Toggle
                    key={price}
                    on={filters.maxPrice === price}
                    onClick={() =>
                      update({
                        maxPrice: filters.maxPrice === price ? NO_PRICE_LIMIT : price,
                      })
                    }
                  >
                    Under {price}
                  </Toggle>
                ))}
              </div>
            </Group>

            <Group legend="Type">
              <div className="flex flex-wrap gap-1.5">
                {WINE_TYPES.map((type) => (
                  <Toggle
                    key={type}
                    on={filters.types.includes(type)}
                    onClick={() => update({ types: toggle(filters.types, type) })}
                  >
                    {WINE_TYPE_LABELS[type]}
                  </Toggle>
                ))}
              </div>
            </Group>

            <Group legend="Minimum Sine-score">
              <label htmlFor="minscore" className="flex justify-between text-[15px]">
                <span className="text-text-3">Fra</span>
                <strong className="font-semibold">{filters.minScore} poeng</strong>
              </label>
              <input
                id="minscore"
                type="range"
                min={MIN_SCORE_FLOOR}
                max={MIN_SCORE_CEILING}
                step={1}
                value={filters.minScore}
                onChange={(event) => update({ minScore: Number(event.target.value) })}
                className="h-11 w-full"
              />
            </Group>

            <Group legend="Passer til">
              <div className="flex flex-wrap gap-1.5">
                {FOOD_CATEGORIES.map((food) => (
                  <Toggle
                    key={food}
                    on={filters.foods.includes(food)}
                    onClick={() => update({ foods: toggle(filters.foods, food) })}
                  >
                    {food}
                  </Toggle>
                ))}
              </div>
            </Group>

            <Group legend="Tilgjengelighet">
              <Choice
                type="radio"
                name="lager"
                checked={filters.availability === "alle"}
                onChange={() => update({ availability: "alle", store: "" })}
              >
                Alle på lager
              </Choice>
              <Choice
                type="radio"
                name="lager"
                checked={filters.availability === "butikk"}
                onChange={() => update({ availability: "butikk" })}
              >
                På lager i min butikk
              </Choice>
              <label htmlFor="butikk" className="sr-only">
                Velg butikk
              </label>
              <select
                id="butikk"
                value={filters.store}
                onChange={(event) =>
                  update({
                    store: event.target.value,
                    availability: event.target.value ? "butikk" : filters.availability,
                  })
                }
                className={select}
              >
                <option value="">Velg Vinmonopolet-butikk</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </Group>


            <button
              type="button"
              aria-expanded={advancedOpen}
              aria-controls="flere-filtre"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex min-h-11 items-center justify-between gap-3 border-t border-line pt-6 text-left text-[15px] font-semibold"
            >
              <span>
                {advancedOpen ? "Færre filtre" : "Flere filtre"}
                {!advancedOpen && advancedCount > 0 && (
                  <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs text-bg">
                    {advancedCount}
                  </span>
                )}
              </span>
              <span
                aria-hidden="true"
                className={`text-lg transition-transform motion-reduce:transition-none ${advancedOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            <div
              id="flere-filtre"
              className={advancedOpen ? "flex flex-col gap-7" : "hidden"}
            >
              <Group legend="Utvalg hos Vinmonopolet">
                {ASSORTMENTS.map((assortment) => (
                  <Choice
                    key={assortment}
                    type="checkbox"
                    checked={filters.assortments.includes(assortment)}
                    onChange={() =>
                      update({ assortments: toggle(filters.assortments, assortment) })
                    }
                  >
                    {ASSORTMENT_LABELS[assortment]}
                  </Choice>
                ))}
              </Group>

              <Group legend="Årgang">
                <div className="flex gap-2.5">
                  <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm text-text-3">
                    Fra
                    <select
                      value={filters.vintageFrom ?? ""}
                      onChange={(event) => {
                        const from = event.target.value ? Number(event.target.value) : null;
                        const to = filters.vintageTo;
                        update({
                          vintageFrom: from,
                          vintageTo: from !== null && to !== null && to < from ? from : to,
                        });
                      }}
                      className={`${select} w-full`}
                    >
                      <option value="">Alle</option>
                      {vintages.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm text-text-3">
                    Til
                    <select
                      value={filters.vintageTo ?? ""}
                      onChange={(event) => {
                        const to = event.target.value ? Number(event.target.value) : null;
                        const from = filters.vintageFrom;
                        update({
                          vintageTo: to,
                          vintageFrom: from !== null && to !== null && from > to ? to : from,
                        });
                      }}
                      className={`${select} w-full`}
                    >
                      <option value="">Alle</option>
                      {vintages.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </Group>

              <Group legend="Produsent">
                <label htmlFor="produsent" className="sr-only">
                  Velg produsent
                </label>
                <select
                  id="produsent"
                  value={filters.producer}
                  onChange={(event) => update({ producer: event.target.value })}
                  className={select}
                >
                  <option value="">Alle produsenter</option>
                  {producers.map((producer) => (
                    <option key={producer}>{producer}</option>
                  ))}
                </select>
              </Group>

              <Group legend="Land">
                {shownCountries.map((country) => (
                  <Choice
                    key={country}
                    type="checkbox"
                    checked={filters.countries.includes(country)}
                    onChange={() =>
                      update({ countries: toggle(filters.countries, country) })
                    }
                  >
                    {country}
                  </Choice>
                ))}
                {shownCountries.length < countries.length && (
                  <button
                    type="button"
                    onClick={() => setAllCountries(true)}
                    className="min-h-11 self-start text-sm font-medium underline"
                  >
                    Vis alle land
                  </button>
                )}
              </Group>

              <Group legend="Drue">
                <label htmlFor="drue" className="sr-only">
                  Velg drue
                </label>
                <select
                  id="drue"
                  value={filters.grape}
                  onChange={(event) => update({ grape: event.target.value })}
                  className={select}
                >
                  <option value="">Alle druer</option>
                  {grapes.map((grape) => (
                    <option key={grape}>{grape}</option>
                  ))}
                </select>
              </Group>

              <Group legend="Annet">
                <Choice
                  type="checkbox"
                  checked={filters.organic}
                  onChange={() => update({ organic: !filters.organic })}
                >
                  Økologisk
                </Choice>
                <Choice
                  type="checkbox"
                  checked={filters.halfBottle}
                  onChange={() => update({ halfBottle: !filters.halfBottle })}
                >
                  Halvflaske (37,5 cl)
                </Choice>
                <Choice
                  type="checkbox"
                  checked={filters.bagInBox}
                  onChange={() => update({ bagInBox: !filters.bagInBox })}
                >
                  Bag-in-box
                </Choice>
              </Group>
            </div>
          </div>

          <div className="border-t border-line bg-surface p-4 lg:hidden">
            <button
              type="button"
              onClick={closePanel}
              className="h-[52px] w-full rounded-full bg-ink text-base font-semibold text-bg"
            >
              Vis {resultLabel}
            </button>
          </div>
        </aside>

        <section
          aria-label="Resultater"
          className="flex min-w-0 flex-[999_1_560px] flex-col gap-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              ref={openButton}
              type="button"
              onClick={() => setPanelOpen(true)}
              aria-expanded={panelOpen}
              aria-controls="filterpanel"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink bg-surface px-4 text-[15px] font-semibold text-ink lg:hidden"
            >
              <FilterIcon />
              Filtre
              {filterCount > 0 && (
                <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-bg">
                  {filterCount}
                </span>
              )}
            </button>
            <p aria-live="polite" className="m-0 text-[15px] text-text-2 max-lg:basis-full max-lg:order-last">
              <strong className="font-semibold text-ink">{resultLabel}</strong>{" "}
              passer søket ditt
            </p>
            <div className="flex items-center gap-2.5">
              <label htmlFor="sorter" className="text-sm text-text-3 max-sm:sr-only">
                Sorter etter
              </label>
              <select
                id="sorter"
                value={filters.sort}
                onChange={(event) => update({ sort: event.target.value as SortKey })}
                className={select}
              >
                {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {chips.length > 0 && (
            <div role="group" aria-label="Aktive filtre" className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => update(chip.without)}
                  aria-label={`Fjern filter ${chip.label}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-sand px-3.5 text-sm font-medium text-ink"
                >
                  {chip.label} <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-card border border-line bg-surface p-8">
              <p className="m-0 font-display text-2xl font-semibold tracking-[-0.02em]">
                Ingen viner passer søket.
              </p>
              <p className="m-0 text-[15px] text-text-2">
                Prøv et høyere budsjett, eller fjern noen av filtrene.
              </p>
            </div>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {results.slice(0, visible).map((wine) => (
                <WineRow key={wine.id} wine={wine} />
              ))}
            </ul>
          )}

          {results.length > visible && (
            <button
              type="button"
              onClick={() => setVisible(visible + PAGE_SIZE)}
              className="h-[52px] self-center rounded-full bg-ink px-7 text-base font-semibold text-bg"
            >
              Vis flere viner
            </button>
          )}
          <p className="m-0 text-center text-[13px] text-text-3">{stockNote}</p>
        </section>
      </div>
    </>
  );
}

export function WineRow({ wine }: { wine: WineView }) {
  return (
    <li className="flex flex-wrap items-center gap-5 rounded-card border border-line bg-surface px-[22px] py-[18px]">
      <div className="flex h-[88px] w-[60px] shrink-0 items-center justify-center rounded-[14px] bg-sand-soft text-text-3">
        <WineImage wine={wine} size={300} iconClassName="h-16" imageClassName="h-20 w-[60px]" />
      </div>
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-1 max-sm:flex-[1_1_0]">
        <Link href={`/vin/${wine.slug}`} className="inline-flex min-h-11 items-center text-lg leading-tight font-semibold text-ink">
          {wine.name}
        </Link>
        <span className="text-sm text-text-3">
          {joinParts([wine.producer, formatOrigin(wine), wine.vintage])}
        </span>
        <span className="text-[13px] text-text-3">
          {joinParts([
            WINE_TYPE_LABELS[wine.type],
            wine.grapes[0]?.name,
            stockLabel(wine.stock, wine.assortment),
          ])}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-5 max-sm:w-full max-sm:justify-between">
        <ScoreBadge score={wine.score} />
        <span className="min-w-20 text-right font-display text-[22px] font-semibold whitespace-nowrap">
          {formatPrice(wine.priceNok)}
        </span>
        <a
          href={vinmonopoletUrl(wine.vinmonopoletId)}
          aria-label={`Kjøp ${wine.name}`}
          className="inline-flex min-h-11 items-center rounded-full border border-ink px-[18px] font-semibold whitespace-nowrap text-ink"
        >
          Kjøp
        </a>
      </div>
    </li>
  );
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
      <legend className="mb-3 p-0 text-sm font-semibold">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
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

function Choice({
  children,
  ...input
}: {
  type: "radio" | "checkbox";
  name?: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2.5 text-[15px]">
      <input {...input} /> {children}
    </label>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-[18px]">
      <path d="M3 5h14M6 10h8M8.5 15h3" />
    </svg>
  );
}
