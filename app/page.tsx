import Link from "next/link";
import { BestBuysExcerpt } from "@/components/BestBuysExcerpt";
import { JudgeSketch } from "@/components/JudgeSketch";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SiteHeader } from "@/components/SiteHeader";
import {
  accentButton,
  heading,
  secondaryButton,
  WineImage,
} from "@/components/ui";
import { formatPrice, joinParts } from "@/lib/format";
import {
  getFeaturedWine,
  getJudges,
  getShowcaseWines,
  getStockNote,
} from "@/lib/wines";

export default function HomePage() {
  const featured = getFeaturedWine();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-16 px-6 pt-[88px] pb-[104px] max-sm:gap-7 max-sm:pt-7 max-sm:pb-12">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7 max-sm:gap-4">
            <h1 className={`${heading} text-h1 max-sm:leading-[1.14]`}>
              Eksperter smaker uten å{" "}
              <span className="rounded-xl bg-ink px-3.5 text-bg">se</span>. Du
              kjøper bedre vin.
            </h1>
            <p className="m-0 max-w-[640px] text-xl leading-[1.55] text-balance text-text-2 max-sm:text-lg">
              Et anonymt panel smaker hver vin blindt. Du får én ærlig score.
            </p>
            <Link href="/i-butikken" className={`${accentButton} self-start`}>
              Jeg står i butikken nå
            </Link>
          </div>

          <aside
            aria-label="Ukens beste kjøp"
            className="grid max-w-[420px] min-w-0 flex-[1_1_360px] grid-cols-[128px_minmax(0,1fr)] gap-5 rounded-card-lg border border-line bg-surface p-5 lg:max-w-[520px] lg:flex-[1_1_420px] lg:grid-cols-[160px_minmax(0,1fr)] xl:flex-[1_1_500px] xl:grid-cols-[184px_minmax(0,1fr)] lg:gap-8 lg:p-8 max-sm:grid-cols-[104px_minmax(0,1fr)] max-sm:gap-4 max-sm:p-4"
          >
            <div className="relative flex items-center justify-center rounded-image bg-sand-soft text-text-3">
              <WineImage
                wine={featured}
                size={515}
                eager
                alt={`Flaske av ${featured.name}`}
                iconClassName="h-44"
                imageClassName="absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)]"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
              <div className="flex flex-col gap-1 lg:gap-2">
                <span className="text-[13px] font-semibold text-text-3 lg:text-sm">
                  Ukens beste kjøp
                </span>
                <span className="font-display text-2xl leading-tight font-semibold tracking-[-0.02em] lg:text-[28px]">
                  {featured.name}
                </span>
                <span className="text-sm text-text-3 lg:text-[15px]">
                  {joinParts([
                    featured.producer !== featured.name ? featured.producer : undefined,
                    featured.region,
                    featured.vintage,
                  ])}
                </span>
              </div>
              <dl className="m-0">
                <StatRow label="Sine-score" value={String(featured.score)} />
                <StatRow label="Pris" value={formatPrice(featured.priceNok)} />
                <StatRow label="Smaker som" value={formatPrice(featured.guessedPriceNok)} />
              </dl>
              <Link
                href={`/vin/${featured.slug}`}
                className={`${secondaryButton} min-h-11 text-[15px] lg:min-h-13 lg:text-base`}
              >
                Se vinen
              </Link>
            </div>
          </aside>
        </section>

        <section aria-labelledby="hvorfor" className="bg-ink text-bg">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-6 py-[104px] max-sm:py-16">
            <span className="self-start rounded-full bg-ink-raised px-3.5 py-[7px] text-sm font-medium text-on-dark-2">
              Hva er kvalitet i vin?
            </span>
            <h2 id="hvorfor" className={`${heading} text-h2`}>
              <Link href="/hvorfor-blindt" className="text-bg hover:text-accent">
                Hjernen smaker med øynene.{" "}
                <span aria-hidden="true" className="text-accent">
                  →
                </span>
              </Link>
            </h2>
            <p className="m-0 max-w-[560px] text-lg leading-[1.6] text-on-dark-2">
              Kvalitet er balanse, lengde og kompleksitet – det som faktisk er
              i glasset. Men forventninger former smaken, så vi fjerner resten.
            </p>
          </div>
        </section>

        <section
          id="beste-kjop"
          aria-labelledby="kjop"
          className="border-y border-line bg-surface"
        >
          <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-[104px] max-sm:py-16">
            <BestBuysExcerpt wines={getShowcaseWines()} />
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
              Møt våre anonyme eksperter.
            </h2>
            <p className="m-0 max-w-[420px] text-lg leading-[1.6] text-text-2">
              Tre dommere i panelet, alle smaker hver vin. Ingen navn,
              arbeidsgivere eller lojaliteter kan påvirke – verken dem eller
              deg. Erfaringen deres viser vi gjerne.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-sm:gap-x-3">
            {getJudges().map((judge, index) => (
              <figure key={judge.id} className="m-0 flex flex-col gap-3.5">
                <div className="aspect-[4/5] overflow-hidden rounded-card-lg bg-sand">
                  <JudgeSketch
                    index={index}
                    label={`Skisse av ${judge.code}, uten ansikt`}
                  />
                </div>
                <figcaption className="flex flex-col gap-1">
                  <span className="font-display text-2xl font-semibold tracking-[-0.02em] max-sm:text-lg">
                    {judge.code}
                  </span>
                  <span className="text-[15px] max-sm:text-sm">{judge.role}</span>
                  <span className="text-sm text-text-3 max-sm:text-[13px]">
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
            <NewsletterForm
              buttonLabel="Meld meg på"
              className="flex-[1_1_380px]"
            />
          </div>
        </section>
      </main>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line-soft py-1.5 last:border-b-0 lg:py-2.5">
      <dt className="text-[13px] text-text-3 lg:text-sm">{label}</dt>
      <dd className="m-0 font-display text-lg font-semibold whitespace-nowrap lg:text-xl">
        {value}
      </dd>
    </div>
  );
}
