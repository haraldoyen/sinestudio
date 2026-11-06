# Spesifikasjon – Sine Studio

## Konseptet

- All smaking skjer **blindt**: dommerne ser aldri pris, etikett, produsent eller farge (svarte glass).
- **Panelet** består av tre anonyme dommere (sommelierer/vineksperter). **Alle tre smaker hver vin**, uavhengig av hverandre.
- Hver dommer svarer på kun tre ting:
  1. **Score** (0–100)
  2. **Gjettet pris** (kr)
  3. **Gjettet alkohol** (%)
- Fakta om vinen avsløres først etter at alle tre har levert.
- Sine Studio kjøper all vin selv på Vinmonopolet. Ingen betalte plasseringer.
- Dommerne er anonyme (vises som «Dommer 01–06»), men erfaringen deres vises (rolle, år i bransjen, bilder uten ansikt).
- Språk: norsk (bokmål). `lang="no"`.

## Sider og ruter

### `/` – Forside (`referanse/forside.dc.html`)
1. **Meny:** logo, Beste kjøp, Hvorfor blindt, Panelet, «Få ukens funn» (knapp → nyhetsbrev).
2. **Hero:** «Vi smaker uten å se. Du kjøper uten å gjette.» – ordet «se» står på en mørk stripe (bind for øynene). Søkefelt + «Finn beste kjøp». Kort til høyre: «Ukens beste kjøp» med score, pris og «Smaker som» (panelets gjettede pris), lenke til vinsiden.
3. **Hjernen smaker med øynene** (mørk seksjon): tre kort – Pris, Etikett, Farge.
4. **Seks kritikere, svært ulike smaker** (`#eksempel`): ekte eksempel – se *Margaux-eksempelet* under.
5. **Beste kjøp** (utdrag): filterknapper + fem vinkort, lenker til vinsider.
6. **Panelet** (`#panelet`): tre dommerkort (foto uten ansikt, «Dommer 01», rolle, år i bransjen). Tekst: tre dommere i panelet, alle smaker hver vin.
7. **Nyhetsbrev:** «Ukens funn, rett i innboksen.» – e-postfelt + «Meld meg på».
8. **Bunntekst:** «Uavhengig. Ingen betalte plasseringer. Vi kjøper all vin selv.»

### `/vin/[slug]` – Vinside (`referanse/vinside.dc.html`)
1. Brødsmuler: Beste kjøp / [Type] / [Vinnavn].
2. **Hero:** flaskebilde, merkelapper («Blindsmakt [dato]», «Beste kjøp i [kategori]»), navn, produsent · region, land · årgang.
   Tre bokser: **Sine-score**, **Pris** (Vinmonopolet), **Panelet gjettet** (snitt gjettet pris, blindt).
   Panelets oppsummering (2–3 setninger). Knapper: «Kjøp på Vinmonopolet», «Sjekk lager i nærheten». Varenummer + lagerstatus.
3. **Panelets vurdering** (mørk seksjon): «Tre dommere. Tre enkle spørsmål.»
   - 01 Score: snitt av tre + spredning
   - 02 Gjettet pris: snitt vs. faktisk pris + merke «Smaker [X] kr dyrere enn den er» (vises bare når gjettet > faktisk)
   - 03 Alkohol: gjettet snitt vs. faktisk
   - Tabell: hver dommers score, gjettet pris, gjettet alkohol.
4. **Om vinen:** produsent, land/region, druer, årgang, alkohol, varenummer. «Avslørt først etter at scoren var satt.»
5. **Passer til:** retter som piller, drikkevindu, serveringstemperatur.
6. **Viner som ligner:** tre vinkort.

### `/beste-kjop` – Beste kjøp (`referanse/beste-kjop.dc.html`)
- Overskrift «Finn vinen. Blindsmakt og rangert.» + søkefelt.
- **Filtre (venstre panel, stables på mobil):**
  - Budsjett: maks pris (glidebryter 100–1000 kr, steg 25; 1000 = «Ingen grense») + hurtigvalg Under 150/200/300/500
  - Type: Rødvin, Hvitvin, Rosé, Musserende, Søtvin, Sterkvin (flervalg)
  - Minimum Sine-score: 80–98
  - Tilgjengelighet: Alle på lager / På lager i min butikk (+ butikkvelger) / Kun basisutvalget
  - Land (flervalg, «Vis alle land»), Drue (nedtrekk)
  - Passer til: Fisk, Skalldyr, Fjærkre, Storfe, Lam, Vilt, Ost, Vegetar
  - Annet: Økologisk, Halvflaske (37,5 cl), Bag-in-box
  - «Nullstill»
- **Resultater:** antall treff, sortering (Høyest Sine-score, Lavest pris, Høyest pris, Nyeste smakinger), aktive filtre som fjernbare piller, liste med vinrader, «Vis flere viner».
- Filtre bør speiles i URL-en (query params) så søk kan deles.
- Vis kun vin som er på lager hos Vinmonopolet.

## Datamodell (forslag)

```ts
type Judge = {
  id: string;            // "dommer-01"
  code: string;          // "Dommer 01" – det eneste som vises offentlig som navn
  role: string;          // f.eks. "Vinkelnersjef"
  yearsExperience: number;
  photoUrl?: string;     // bilde uten ansikt
};

type Wine = {
  id: string;
  slug: string;
  name: string;
  producer: string;
  country: string;
  region: string;
  vintage?: number;
  type: 'rod' | 'hvit' | 'rose' | 'musserende' | 'sot' | 'sterk';
  grapes: { name: string; percent?: number }[];
  abv: number;                 // faktisk alkohol
  vinmonopoletId: string;      // varenummer
  priceNok: number;            // fra Vinmonopolet
  assortment?: 'basis' | 'bestilling' | 'annet';
  organic?: boolean;
  volumeCl: number;
  foodPairings: string[];
  drinkFrom?: number; drinkTo?: number;
  servingTempC?: [number, number];
  imageUrl?: string;
};

type Tasting = {               // én blindsmaking av én vin
  id: string;
  wineId: string;
  date: string;
  summary: string;             // panelets oppsummering
  verdicts: Verdict[];         // nøyaktig 3
};

type Verdict = {
  judgeId: string;
  score: number;               // 0–100
  guessedPriceNok: number;
  guessedAbv: number;
};
```

**Avledede verdier:**
- Sine-score = snitt av de tre scorene (heltall).
- Spredning = maks − min (eller standardavvik) av scorene.
- Panelet gjettet = snitt av gjettet pris.
- «Smaker X kr dyrere» = gjettet snitt − faktisk pris (vises bare når positivt).

## Ikke i første versjon

- **Verdi / pris per poeng / «smaker som»-modell:** skal utvikles senere. Lag ingen verdi-kolonne eller verdi-sortering nå,
  men hold datamodellen åpen for det.
- Integrasjon mot Vinmonopolet (pris, lager per butikk): bruk eksempeldata først. Ikke finn på priser.

## Margaux-eksempelet (forside, seksjon 4)

Château Margaux 2015, aromaer beskrevet av seks kritikere (oversatt til norsk). Uthevet = nevnt av mer enn én (Solbær, Sandeltre, Bringebær).
Ingen poeng og ingen personnavn vises – bare publikasjon/nettsted.

| Kilde | Aromaer |
|---|---|
| Wine Advocate | Bjørnebær, Solbær, Sandeltre, Anis, Sigarkasse, Lavendel |
| Wine Spectator | Sandeltre, Svart te, Mesquite, Bringebær, Tjære, Syrin, Einer, Jern |
| JebDunnuck.com | Solbær, Ristet krydder, Eik, Sedertre |
| Falstaff | Tobakk, Kirsebær, Nougat, Kandisert appelsinskall |
| Inside Bordeaux | Bringebær, Damsonplomme, Skifer, Knust stein |
| TimAtkin.com | Grafitt, Grønn pepper |

Ingress: «Seks anerkjente vinmagasiner og kritikere har smakt Château Margaux 2015. Til sammen beskrev de 25 ulike aromaer – bare 3 av dem går igjen.»
Avslutning: «Hvis seks eksperter knapt kjenner de samme aromaene – hvor mye kommer fra glasset, og hvor mye fra etiketten?»
Fotnote: «Uthevet = nevnt av mer enn én kritiker. Notatene er skrevet 2016–2024, oversatt til norsk. Kilder: kritikernotater gjengitt hos Wine.com, Millesima og Farr Vintners.»

Kilder (for verifisering før lansering):
- https://www.wine.com/product/chateau-margaux-2015/153459
- https://www.millesima-usa.com/chateau-margaux-2015.html
- https://www.farrvintners.com/wine.php?wine=43088
