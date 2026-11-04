# Design – Sine Studio (stil B)

Varm, moderne og litt leken – men rolig og troverdig. Ingen harde skygger, ingen rotasjoner, ingen gradienter, ingen emoji.

## Farger

| Token | Hex | Bruk |
|---|---|---|
| `ink` | `#231127` | Hovedtekst, mørke seksjoner, primærknapper (aubergine) |
| `ink-raised` | `#2F1A34` | Kort på mørk bakgrunn |
| `bg` | `#FBF6EF` | Sidebakgrunn (varm hvit) |
| `surface` | `#FFFFFF` | Kort, filterpanel, inputfelt |
| `sand` | `#F3E6D8` | Merkelapper, «piller», plassholderbilder, sitatboks |
| `sand-soft` | `#F7EFE5` | Ikke-uthevede tagger, flaskeplassholdere |
| `line` | `#EADFD2` | Kantlinjer på kort og seksjoner |
| `line-soft` | `#F1E8DD` | Skillelinjer i lister og tabeller |
| `input-border` | `#D9CBBB` | Inputfelt, ikke-valgte filterknapper |
| `text-2` | `#4A3A4E` | Ingress og brødtekst |
| `text-3` | `#6B5A6F` | Hjelpetekst, metadata |
| `on-dark-2` | `#D8CADB` | Brødtekst på mørk bakgrunn |
| `accent` | `#F28C6B` | Korall. Score-merker, uthevede tagger, nyhetsbrevblokk, logo-stripe. Tekst på aksent er alltid `ink`. |

Alternative aksenter som er testet i designet: `#E9B949` (gul), `#9CCFB8` (mint), `#C9B8F0` (lavendel).

## Typografi

- **Overskrifter:** Bricolage Grotesque, vekt 600, tett sporing (`letter-spacing: -0.03em` til `-0.035em`), `line-height: 1`.
  - H1: 72–84 px · H2: 56–64 px · H3/kort: 22–36 px · store tall (score/pris): 64–72 px
- **Brødtekst:** DM Sans 400/500/600. Ingress 18–20 px (`line-height: 1.55–1.6`), brødtekst 15–17 px, metadata 13–14 px.
- Google Fonts: `Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600` og `DM+Sans:wght@400;500;600`.
- Logo: «Sine Studio» i Bricolage 600, 24 px, med et rundt `ink`-merke (34 px) som har en liten korall «bind for øynene»-stripe (20×6 px).

## Layout

- Maks innholdsbredde 1240 px, sidemarg 24 px.
- Seksjonsavstand vertikalt: 96–112 px.
- Grids med `repeat(auto-fit, minmax(…, 1fr))` så alt stables på mobil.
- Fungerer ned til mobilbredde: menyer brytes, filterpanel legger seg over resultatene.

## Radier

- Knapper, merkelapper, inputfelt: `999px` (pille)
- Kort: 24 px · store kort/seksjonsblokker: 28–36 px · plassholderbilder: 18–32 px

## Komponenter

- **Primærknapp:** `ink`-bakgrunn, `bg`-tekst, pille, høyde 56 px, vekt 600.
- **Sekundærknapp:** 1 px `ink`-kant, transparent, pille.
- **Aksentknapp:** `accent`-bakgrunn, `ink`-tekst (brukes f.eks. «Finn beste kjøp»).
- **Merkelapp (eyebrow):** `sand`-bakgrunn, 14 px, vekt 500, pille, plassert over H2.
- **Score-merke:** `accent`-bakgrunn, «Score 91», 14 px, vekt 600, pille.
- **Aroma-tag:** `sand-soft`-bakgrunn; uthevet variant (nevnt av flere kritikere) har `accent`-bakgrunn og vekt 600.
- **Filterknapp (toggle):** av = hvit med `input-border`; på = `ink`-bakgrunn med `bg`-tekst. Bruk `aria-pressed`.
- **Vinkort (rutenett):** hvit, 1 px `line`, radius 24, flaskeplassholder 140 px høy, navn, produsent/region, score-merke + pris.
- **Vinrad (liste):** samme innhold i én rad: flaske 60×88, navn/opprinnelse/type/lager, score-merke, pris (Bricolage 22 px), «Kjøp»-knapp.
- **Mørk seksjon:** `ink`-bakgrunn, kort i `ink-raised`, ikoner i `accent` (strek 1.8 px, 32 px).

## Tilgjengelighet

- Ekte `<button>`, `<a href>`, `<label>` for alle input.
- Tekstkontrast minst 4.5:1. Tekst på `accent` er alltid `ink`.
- Berøringsflater ≥ 44 px.
- Dekorative SVG-er: `aria-hidden="true"`.
