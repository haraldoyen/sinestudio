import Link from "next/link";
import { BestBuysExcerpt } from "@/components/BestBuysExcerpt";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SiteHeader } from "@/components/SiteHeader";
import { heading, secondaryButton } from "@/components/ui";
import { formatPrice, joinParts } from "@/lib/format";
import {
  getFeaturedWine,
  getInStockWines,
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
            <NewsletterForm
              buttonLabel="Få ukens funn"
              className="max-w-[580px]"
              bordered
            />
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
            <BestBuysExcerpt wines={getInStockWines()} />
            <p className="m-0 text-sm leading-[1.6] text-text-3">
              Rangert etter Sine-score. {getStockNote()}
            </p>
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
