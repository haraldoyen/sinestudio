import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow, fitGrid, heading, primaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Hvorfor blindt",
  description:
    "Forventninger former smaken, også hos eksperter. Derfor smaker panelet vårt alltid blindt.",
};

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

export default function HvorforBlindtPage() {
  return (
    <>
      <SiteHeader current="hvorfor-blindt" />
      <main>
        <section className="mx-auto flex max-w-[1240px] flex-col gap-7 px-6 pt-16 pb-24 max-sm:pt-10 max-sm:pb-16">
          <Eyebrow>Hvorfor blindt</Eyebrow>
          <h1 className={`${heading} max-w-[900px] text-h1-page`}>
            Hjernen smaker med øynene.
          </h1>
          <p className="m-0 max-w-[680px] text-xl leading-[1.55] text-text-2">
            Forskning på persepsjon viser at forventninger former
            smaksopplevelsen – også hos eksperter. Så vi fjerner alt som ikke er
            i glasset.
          </p>
          <div className="grid gap-x-12 gap-y-5 pt-2 text-[17px] leading-[1.6] text-text-2 md:grid-cols-2">
            <p className="m-0">
              Ingen smaker vin i et tomrom. Prisen, etiketten, produsentens
              rykte og det andre har sagt om vinen gir oss forventninger, og
              forventningene former det vi kjenner i glasset. I forsøk har folk
              likt samme vin bedre når de trodde den var dyr, og vinstudenter
              har beskrevet hvitvin farget rød med ord de vanligvis bruker om
              rødvin.
            </p>
            <p className="m-0">
              Det samme gjelder anmeldelser. En kritiker som vet hva som står
              på flasken, vurderer aldri bare innholdet. Kjente navn, tidligere
              årganger og egne vaner setter spor i både poeng og ord. Det gjør
              ikke anmeldelser uærlige, men de er farget av oppfatninger.
              Derfor fjerner vi alt annet enn glasset, og lar tre dommere svare
              hver for seg før noe blir avslørt.
            </p>
          </div>
        </section>

        <section aria-labelledby="fjerner" className="bg-ink text-bg">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-[104px] max-sm:py-16">
            <h2 id="fjerner" className={`${heading} text-h2`}>
              Dette tar vi bort.
            </h2>
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

        <section className="mx-auto max-w-[1240px] px-6 pb-28 max-sm:pb-16">
          <Link href="/beste-kjop" className={primaryButton}>
            Se beste kjøp
          </Link>
        </section>
      </main>
    </>
  );
}
