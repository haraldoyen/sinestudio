import Link from "next/link";
import type { ReactNode } from "react";
import { BestBuysExcerpt } from "@/components/BestBuysExcerpt";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SiteHeader } from "@/components/SiteHeader";
import {
  accentButton,
  Eyebrow,
  fitGrid,
  heading,
  secondaryButton,
  textInput,
} from "@/components/ui";
import { formatPrice, joinParts } from "@/lib/format";
import {
  getFeaturedWine,
  getInStockWines,
  getJudges,
  getStockNote,
} from "@/lib/wines";

const WHY_BLIND: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Pris",
    text: "Samme vin oppleves bedre når vi tror den er dyr. Dommerne får aldri vite prisen.",
    icon: (
      <>
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </>
    ),
  },
  {
    title: "Etikett",
    text: "Kjente navn skaper forventninger. Hver flaske får et nummer – ingenting annet.",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
  },
  {
    title: "Farge",
    text: "Fargen styrer hva vi leter etter. Vi serverer i svarte glass, så nesen får siste ord.",
    icon: (
      <>
        <path d="M2 12s3.5-7 10-7c2 0 3.7.6 5.1 1.5M22 12s-3.5 7-10 7c-2 0-3.7-.6-5.1-1.5" />
        <path d="M3 3l18 18" />
      </>
    ),
  },
];

const CRITICS = [
  {
    source: "Wine Advocate",
    aromas: ["Bjørnebær", "Solbær", "Sandeltre", "Anis", "Sigarkasse", "Lavendel"],
  },
  {
    source: "Wine Spectator",
    aromas: ["Sandeltre", "Svart te", "Mesquite", "Bringebær", "Tjære", "Syrin", "Einer", "Jern"],
  },
  { source: "JebDunnuck.com", aromas: ["Solbær", "Ristet krydder", "Eik", "Sedertre"] },
  { source: "Falstaff", aromas: ["Tobakk", "Kirsebær", "Nougat", "Kandisert appelsinskall"] },
  { source: "Inside Bordeaux", aromas: ["Bringebær", "Damsonplomme", "Skifer", "Knust stein"] },
  { source: "TimAtkin.com", aromas: ["Grafitt", "Grønn pepper"] },
];

const SHARED_AROMAS = new Set(["Solbær", "Sandeltre", "Bringebær"]);

export default function HomePage() {
  const featured = getFeaturedWine();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-16 px-6 pt-[88px] pb-[104px] max-sm:pt-12 max-sm:pb-16">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">
            <Eyebrow>Blindsmakt av profesjonelle · rangert for deg</Eyebrow>
            <h1 className={`${heading} text-h1`}>
              Vi smaker uten å{" "}
              <span className="rounded-xl bg-ink px-3.5 text-bg">se</span>. Du
              kjøper uten å gjette.
            </h1>
            <p className="m-0 max-w-[560px] text-xl leading-[1.55] text-text-2">
              Et anonymt panel av sommelierer og vineksperter smaker hver vin
              blindt – uten pris, etikett eller produsent. Du får én ærlig
              score, og flaskene som gir mest for pengene.
            </p>
            <form
              role="search"
              action="/beste-kjop"
              className="flex max-w-[580px] flex-wrap gap-2.5"
            >
              <label htmlFor="sok" className="sr-only">
                Søk etter vin, drue eller region
              </label>
              <input
                id="sok"
                name="q"
                type="search"
                placeholder="Søk vin, drue eller region"
                className={`${textInput} flex-[1_1_260px]`}
              />
              <button type="submit" className={accentButton}>
                Finn beste kjøp
              </button>
            </form>
          </div>

          <aside
            aria-label="Ukens beste kjøp"
            className="flex max-w-[420px] min-w-0 flex-[1_1_360px] flex-col gap-[22px] rounded-card-lg border border-line bg-surface p-8 max-sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-text-3">
                Ukens beste kjøp
              </span>
              <span className="rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap">
                Sine-score {featured.score}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-display text-[28px] leading-tight font-semibold tracking-[-0.02em]">
                {featured.name}
              </span>
              <span className="text-[15px] text-text-3">
                {joinParts([featured.producer, featured.region, featured.vintage])}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PriceTile label="Pris" value={featured.priceNok} />
              <PriceTile label="Smaker som" value={featured.guessedPriceNok} />
            </div>
            <Link href={`/vin/${featured.slug}`} className={secondaryButton}>
              Se vinen
            </Link>
          </aside>
        </section>

        <section aria-labelledby="hvorfor" className="bg-ink text-bg">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-[104px] max-sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <h2 id="hvorfor" className={`${heading} max-w-[720px] text-h2`}>
                Hjernen smaker med øynene.
              </h2>
              <p className="m-0 max-w-[440px] text-lg leading-[1.6] text-on-dark-2">
                Forskning på persepsjon viser at forventninger former
                smaksopplevelsen – også hos eksperter. Så vi fjerner alt som
                ikke er i glasset.
              </p>
            </div>
            <div className="grid gap-5" style={fitGrid(260)}>
              {WHY_BLIND.map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col gap-4 rounded-card-lg bg-ink-raised p-8"
                >
                  <svg
                    aria-hidden="true"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    {card.icon}
                  </svg>
                  <span className="font-display text-[32px] font-semibold tracking-[-0.02em]">
                    {card.title}
                  </span>
                  <p className="m-0 text-base leading-[1.6] text-on-dark-2">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="eksempel"
          aria-labelledby="eksempel-tittel"
          className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-28 max-sm:py-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex max-w-[680px] flex-col gap-4">
              <Eyebrow>Seks kritikere, svært ulike smaker</Eyebrow>
              <h2 id="eksempel-tittel" className={`${heading} text-h2`}>
                Samme vin. Seks helt ulike glass.
              </h2>
            </div>
            <p className="m-0 max-w-[420px] text-lg leading-[1.6] text-text-2">
              Seks anerkjente vinmagasiner og kritikere har smakt Château
              Margaux 2015. Til sammen beskrev de 25 ulike aromaer – bare 3 av
              dem går igjen.
            </p>
          </div>
          <ul className="m-0 list-none rounded-card-lg border border-line bg-surface p-0">
            {CRITICS.map((critic) => (
              <li
                key={critic.source}
                className="grid items-center gap-x-5 gap-y-3 border-b border-line-soft px-7 py-5 last:border-b-0 sm:grid-cols-[minmax(160px,200px)_minmax(0,1fr)] max-sm:px-5"
              >
                <span className="font-display text-[17px] font-semibold">
                  {critic.source}
                </span>
                <span className="flex flex-wrap gap-2">
                  {critic.aromas.map((aroma) => (
                    <span
                      key={aroma}
                      className={`rounded-full px-3 py-[7px] text-sm leading-[1.2] ${
                        SHARED_AROMAS.has(aroma)
                          ? "bg-accent font-semibold"
                          : "bg-sand-soft"
                      }`}
                    >
                      {aroma}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-7 rounded-card-lg bg-sand px-12 py-11 max-sm:px-6 max-sm:py-8">
            <p className="m-0 min-w-0 flex-[1_1_520px] font-display text-[30px] leading-[1.2] font-semibold tracking-[-0.02em] max-sm:text-2xl">
              Hvis seks eksperter knapt kjenner de samme aromaene – hvor mye
              kommer fra glasset, og hvor mye fra etiketten?
            </p>
            <p className="m-0 min-w-0 flex-[1_1_300px] text-[17px] leading-[1.6] text-text-2">
              Derfor smaker vårt panel alltid blindt.
            </p>
          </div>
          <p className="m-0 text-[13px] leading-[1.6] text-text-3">
            Uthevet = nevnt av mer enn én kritiker. Notatene er skrevet
            2016–2024, oversatt til norsk. Kilder: kritikernotater gjengitt hos
            Wine.com, Millesima og Farr Vintners.
          </p>
        </section>

        <section
          id="beste-kjop"
          aria-labelledby="kjop"
          className="border-y border-line bg-surface"
        >
          <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-[104px] max-sm:py-16">
            <BestBuysExcerpt wines={getInStockWines()} />
            <p className="m-0 text-sm leading-[1.6] text-text-3">
              Rangert etter Sine-score. {getStockNote()}
            </p>
          </div>
        </section>

        <section
          id="panelet"
          aria-labelledby="panel"
          className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-28 max-sm:py-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 id="panel" className={`${heading} max-w-[680px] text-h2`}>
              Møt våre anonyme dommere.
            </h2>
            <p className="m-0 max-w-[420px] text-lg leading-[1.6] text-text-2">
              Seks dommere i panelet, tre smaker hver vin. Ingen navn,
              arbeidsgivere eller lojaliteter kan påvirke – verken dem eller
              deg. Erfaringen deres viser vi gjerne.
            </p>
          </div>
          <div className="grid gap-5" style={fitGrid(340)}>
            {getJudges().map((judge) => (
              <figure key={judge.id} className="m-0 flex flex-col gap-3.5">
                <div
                  role="img"
                  aria-label="Plassholder for foto av dommer, ansikt ikke synlig"
                  className="flex aspect-[4/5] items-end rounded-card-lg bg-sand p-5"
                >
                  <span className="text-[13px] leading-[1.4] text-text-3">
                    Foto kommer – ansikt ikke synlig
                  </span>
                </div>
                <figcaption className="flex flex-col gap-1">
                  <span className="font-display text-2xl font-semibold tracking-[-0.02em]">
                    {judge.code}
                  </span>
                  <span className="text-[15px]">{judge.role}</span>
                  <span className="text-sm text-text-3">
                    {judge.yearsExperience} år i bransjen
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          id="nyhetsbrev"
          aria-labelledby="nyhetsbrev-tittel"
          className="mx-auto max-w-[1240px] px-6 pb-28 max-sm:pb-16"
        >
          <div className="flex flex-wrap items-center justify-between gap-10 rounded-block bg-accent px-14 py-16 max-sm:px-6 max-sm:py-10">
            <h2
              id="nyhetsbrev-tittel"
              className={`${heading} min-w-0 flex-[1_1_420px] text-[clamp(2.25rem,5vw,3.25rem)] leading-none tracking-[-0.03em]`}
            >
              Ukens funn, rett i innboksen.
            </h2>
            <NewsletterForm />
          </div>
        </section>
      </main>
    </>
  );
}

function PriceTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-image bg-sand-soft p-4">
      <span className="text-[13px] text-text-3">{label}</span>
      <span className="font-display text-[30px] font-semibold whitespace-nowrap max-sm:text-2xl">
        {formatPrice(value)}
      </span>
    </div>
  );
}
