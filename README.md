# Sine Studio

Nettside der et anonymt panel smaker vin blindt og hjelper folk å finne de beste kjøpene på Vinmonopolet.
Bygget med Next.js (App Router), TypeScript og Tailwind. Spesifikasjon og design ligger i [`design/`](design/README.md).

```bash
npm install
npm run dev
```

Siden kjører på http://localhost:3000. `npm test` kjører testene, `npm run lint` sjekker koden.

## Struktur

| Sti | Hva |
|---|---|
| `app/` | Ruter: `/`, `/beste-kjop`, `/hvorfor-blindt`, `/polet`, `/vin/[slug]` |
| `app/globals.css` | Designtokens fra `design/DESIGN.md` (`@theme`) |
| `components/` | Komponenter. `BesteKjop.tsx` er filtersiden |
| `lib/wines.ts` | Eneste sted som vet hvor dataene kommer fra |
| `lib/filters.ts` | Filtrering, sortering og speiling i URL-en |
| `lib/derive.ts` | Sine-score, spredning, gjettet pris og lagerstatus |
| `data/eksempeldata.json` | Oppdiktede viner, dommere og lagertall |

## Eksempeldata

Alt i `data/eksempeldata.json` er oppdiktet, også priser, dommere og varenumre (`EKS-001`).
Så lenge `meta.example` er `true`, sier fotnotene om pris og lager at dette er eksempeldata.

## Bilder

Viner med ekte varenummer får bilde direkte fra `bilder.vinmonopolet.no`. Eksempelvinene viser et flaskeikon.

## Butikker

`/polet` henter ekte butikker fra Vinmonopolets åpne API på serveren. Det krever `VINMONOPOLET_API_KEY`, lokalt i `.env.local` og som miljøvariabel hos Netlify. Dataene ligger ikke i repoet.

## Før lansering

- Koble på Vinmonopolet (pris og lager) og velg database.
- Koble nyhetsbrevet til en tjeneste. Skjemaet lagrer ingenting ennå.
- Bytt lenkene til Vinmonopolet fra forsiden deres til hver enkelt vare (`VINMONOPOLET_URL` i `lib/derive.ts`).
- Verifiser Margaux-eksempelet mot kildene i `design/SPEC.md`.
