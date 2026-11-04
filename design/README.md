# Sine Studio – designpakke for Claude Code

Sine Studio er en nettside der et anonymt panel av sommelierer og vineksperter smaker vin **blindt**
(uten pris, etikett, produsent eller farge), og som hjelper vanlige folk å finne de beste kjøpene på Vinmonopolet.

## Innhold

| Fil | Hva |
|---|---|
| `SPEC.md` | Sider, seksjoner, funksjoner, datamodell og regler. **Les først.** |
| `DESIGN.md` | Farger, typografi, avstander, radier og komponenter. |
| `referanse/forside.dc.html` | Forsiden – visuell fasit |
| `referanse/vinside.dc.html` | Side for én vin – visuell fasit |
| `referanse/beste-kjop.dc.html` | «Beste kjøp» med filtre – visuell fasit |

### Om referansefilene

Filene er eksportert fra et designverktøy og bruker et eget malformat. De kan **ikke** åpnes direkte i nettleser,
men markupen er vanlig HTML med inline-stiler og er ment å leses som fasit for layout, tekst og stil:

- `{{navn}}` er en verdi som kommer fra `renderVals()` i `<script>`-blokken nederst i filen.
- `<sc-for list="{{x}}" as="y">` er en løkke over en liste.
- `onClick="{{fn}}"` er en klikk-handler.
- `{{accent}}` er aksentfargen (standard `#F28C6B`).
- Tekst i hakeparenteser, f.eks. `[Vinnavn]` eller `[000] kr`, er **plassholdere** for ekte data.
- Lenker til `*.dc.html` tilsvarer ruter: `forside.dc.html` → `/`, `vinside.dc.html` → `/vin/[slug]`, `beste-kjop.dc.html` → `/beste-kjop`.

Gjenskap designet i ekte komponenter – ikke kopier malsyntaksen.

## Forslag til første prompt i Claude Code

> Les design/README.md, design/SPEC.md og design/DESIGN.md. Bygg nettsiden i Next.js (App Router) + TypeScript + Tailwind,
> med de tre sidene slik de ser ut i design/referanse/. Sett opp designtokens fra DESIGN.md i Tailwind-konfigurasjonen.
> Bruk eksempeldata i en lokal JSON-fil inntil videre. Spør meg før du velger database eller kobler på Vinmonopolet.
