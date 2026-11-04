import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import {
  BottleIcon,
  fillGrid,
  fitGrid,
  heading,
  primaryButton,
  secondaryButton,
  WineCard,
} from "@/components/ui";
import { stockLabel, VINMONOPOLET_URL } from "@/lib/derive";
import {
  formatAbv,
  formatDate,
  formatGrapes,
  formatNumber,
  formatPrice,
  joinParts,
  WINE_TYPE_LABELS,
} from "@/lib/format";
import {
  getAllWines,
  getSimilarWines,
  getWineBySlug,
  isBestInType,
} from "@/lib/wines";

// Alle kjente viner er forhåndsrendret, så siden trenger ingen ventevisning.
// Ukjente slugger viser not-found med noindex, men får status 200 i produksjon.
export const instant = false;

export function generateStaticParams() {
  return getAllWines().map((wine) => ({ slug: wine.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/vin/[slug]">): Promise<Metadata> {
  const wine = getWineBySlug((await params).slug);
  return wine ? { title: wine.name, description: wine.summary } : {};
}

export default async function WinePage({ params }: PageProps<"/vin/[slug]">) {
  const wine = getWineBySlug((await params).slug);
  if (!wine) notFound();

  const typeLabel = WINE_TYPE_LABELS[wine.type];
  const similar = getSimilarWines(wine);
  const facts = [
    ["Produsent", wine.producer],
    ["Land, region", `${wine.country}, ${wine.region}`],
    ["Druer", formatGrapes(wine.grapes)],
    ["Årgang", wine.vintage ?? "Uten årgang"],
    ["Alkohol", formatAbv(wine.abv)],
    ["Varenummer", wine.vinmonopoletId],
  ];

  return (
    <>
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-[1240px] px-6 pt-6">
          <nav
            aria-label="Brødsmuler"
            className="flex flex-wrap items-center gap-2 text-sm text-text-3"
          >
            <Link href="/beste-kjop" className="inline-flex min-h-11 items-center text-text-3 underline">
              Beste kjøp
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/beste-kjop?type=${wine.type}`}
              className="inline-flex min-h-11 items-center text-text-3 underline"
            >
              {typeLabel}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-ink">
              {wine.name}
            </span>
          </nav>
        </div>

        <section className="mx-auto flex max-w-[1240px] flex-wrap items-stretch gap-14 px-6 pt-10 pb-24 max-sm:gap-8 max-sm:pb-16">
          <div
            role="img"
            aria-label="Plassholder for flaskebilde"
            className="flex min-h-[560px] max-w-[460px] min-w-0 flex-[1_1_340px] items-center justify-center rounded-[32px] bg-sand p-6 text-text-3 max-md:min-h-[320px] max-md:max-w-none"
          >
            <BottleIcon className="h-64 max-md:h-44" />
          </div>

          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-sand px-3.5 py-[7px] text-[13px] font-medium">
                Blindsmakt {formatDate(wine.tastingDate)}
              </span>
              {isBestInType(wine) && (
                <span className="rounded-full bg-accent px-3.5 py-[7px] text-[13px] font-semibold">
                  Beste kjøp i {typeLabel.toLowerCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <h1 className={`${heading} text-h1-page wrap-break-word`}>{wine.name}</h1>
              <p className="m-0 text-[19px] text-text-2">
                {joinParts([
                  wine.producer,
                  `${wine.region}, ${wine.country}`,
                  wine.vintage,
                ])}
              </p>
            </div>

            <div className="grid gap-3" style={fitGrid(170)}>
              <StatTile label="Sine-score" value={wine.score} note="av 100" />
              <StatTile
                label="Pris"
                value={formatNumber(wine.priceNok)}
                note="kr · Vinmonopolet"
              />
              <StatTile
                label="Panelet gjettet"
                value={formatNumber(wine.guessedPriceNok)}
                note="kr i snitt, blindt"
                accent
              />
            </div>

            <p className="m-0 max-w-[620px] text-[19px] leading-[1.6] text-text-2">
              {wine.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a href={VINMONOPOLET_URL} className={primaryButton}>
                Kjøp på Vinmonopolet
              </a>
              <a href={VINMONOPOLET_URL} className={secondaryButton}>
                Sjekk lager i nærheten
              </a>
              <span className="text-sm text-text-3">
                Varenr. {wine.vinmonopoletId} ·{" "}
                {stockLabel(wine.stock, wine.assortment)}
              </span>
            </div>
          </div>
        </section>

        <section aria-labelledby="vurdering" className="bg-ink text-bg">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-11 px-6 py-24 max-sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="flex max-w-[640px] flex-col gap-3.5">
                <span className="self-start rounded-full bg-ink-raised px-3.5 py-[7px] text-sm font-medium text-on-dark-2">
                  Panelets vurdering
                </span>
                <h2 id="vurdering" className={`${heading} text-h2-sm`}>
                  Tre dommere. Tre enkle spørsmål.
                </h2>
              </div>
              <p className="m-0 max-w-[440px] text-[17px] leading-[1.6] text-on-dark-2">
                Hver dommer smaker alene og uten å se flasken, og svarer på tre
                ting: Hvor god er vinen? Hva tror du den koster? Hvor sterk er
                den?
              </p>
            </div>

            <div className="grid gap-5" style={fitGrid(300)}>
              <ResultCard
                title="01 · Score"
                value={wine.score}
                note={`Snitt av tre, av 100 · spredning ${wine.spread} poeng`}
              />
              <ResultCard
                title="02 · Gjettet pris"
                value={formatPrice(wine.guessedPriceNok)}
                note={`Faktisk pris ${formatPrice(wine.priceNok)}`}
              >
                {wine.tastesDearerByNok > 0 && (
                  <span className="self-start rounded-full bg-accent px-3 py-[7px] text-sm font-semibold text-ink">
                    Smaker {formatPrice(wine.tastesDearerByNok)} dyrere enn den er
                  </span>
                )}
              </ResultCard>
              <ResultCard
                title="03 · Alkohol"
                value={formatAbv(wine.guessedAbv)}
                note={`Gjettet snitt · faktisk ${formatAbv(wine.abv)}`}
              />
            </div>

            <div className="overflow-x-auto rounded-card-lg bg-bg text-ink">
              <table className="w-full min-w-[560px] border-collapse text-base">
                <caption className="px-7 pt-[22px] text-left text-sm text-text-3">
                  Hver dommers svar, levert før flasken ble avslørt
                </caption>
                <thead>
                  <tr className="text-[13px] text-text-3">
                    <th scope="col" className="border-b border-line px-7 py-4 text-left font-medium">
                      Dommer
                    </th>
                    {["Score", "Gjettet pris", "Gjettet alkohol"].map((title) => (
                      <th
                        key={title}
                        scope="col"
                        className="border-b border-line px-7 py-4 text-right font-medium"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wine.verdicts.map((verdict) => (
                    <tr key={verdict.judgeId} className="border-b border-line-soft last:border-b-0">
                      <th scope="row" className="px-7 py-[18px] text-left font-semibold">
                        {verdict.judgeCode}
                      </th>
                      <td className="px-7 py-[18px] text-right">{verdict.score}</td>
                      <td className="px-7 py-[18px] text-right">
                        {formatPrice(verdict.guessedPriceNok)}
                      </td>
                      <td className="px-7 py-[18px] text-right">
                        {formatAbv(verdict.guessedAbv)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1240px] flex-wrap gap-12 px-6 py-24 max-sm:py-16">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[18px] rounded-card-lg border border-line bg-surface p-9 max-sm:p-6">
            <h2 className={`${heading} text-4xl tracking-[-0.02em]`}>Om vinen</h2>
            <p className="m-0 text-sm text-text-3">
              Avslørt først etter at scoren var satt.
            </p>
            <dl className="m-0 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              {facts.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="border-b border-line-soft py-3.5 text-[15px] text-text-3">
                    {label}
                  </dt>
                  <dd className="m-0 border-b border-line-soft py-3.5 text-[15px]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[18px] pt-9 max-sm:pt-0">
            <h2 className={`${heading} text-4xl tracking-[-0.02em]`}>Passer til</h2>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {wine.foodPairings.map((dish) => (
                <li key={dish} className="rounded-full bg-sand px-[18px] py-3 text-base">
                  {dish}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-4 text-[15px]">
              {wine.drinkFrom && wine.drinkTo && (
                <span>
                  <span className="text-text-3">Drikkevindu</span> {wine.drinkFrom}–
                  {wine.drinkTo}
                </span>
              )}
              {wine.servingTempC && (
                <span>
                  <span className="text-text-3">Serveringstemperatur</span>{" "}
                  {wine.servingTempC.join("–")} °C
                </span>
              )}
            </div>
          </div>
        </section>

        {similar.length > 0 && (
          <section
            aria-labelledby="lignende"
            className="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 pb-28 max-sm:pb-16"
          >
            <div className="flex flex-wrap items-end justify-between gap-5">
              <h2
                id="lignende"
                className={`${heading} text-[clamp(2.125rem,4.5vw,3rem)] tracking-[-0.03em]`}
              >
                Viner som ligner
              </h2>
              <Link href="/beste-kjop" className="inline-flex min-h-11 items-center font-semibold text-ink">
                Alle beste kjøp →
              </Link>
            </div>
            <div className="grid gap-4" style={fillGrid(260)}>
              {similar.map((other) => (
                <WineCard key={other.id} wine={other} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function StatTile({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: ReactNode;
  note: string;
  accent?: boolean;
}) {
  const muted = accent ? "" : "text-text-3";
  return (
    <div
      className={`flex min-w-0 flex-col gap-1.5 rounded-card p-6 ${
        accent ? "bg-accent" : "border border-line bg-surface"
      }`}
    >
      <span className={`text-[13px] ${muted}`}>{label}</span>
      <span className="font-display text-stat font-semibold whitespace-nowrap">
        {value}
      </span>
      <span className={`text-[13px] ${muted}`}>{note}</span>
    </div>
  );
}

function ResultCard({
  title,
  value,
  note,
  children,
}: {
  title: string;
  value: ReactNode;
  note: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3.5 rounded-card-lg bg-ink-raised p-8 max-sm:p-6">
      <span className="text-sm font-semibold text-accent">{title}</span>
      <span className="font-display text-stat-lg font-semibold whitespace-nowrap">
        {value}
      </span>
      <span className="text-[15px] text-on-dark-2">{note}</span>
      {children}
    </div>
  );
}
