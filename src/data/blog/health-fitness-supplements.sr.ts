import type { BlogBlock } from "./types";

export const blocksSr: BlogBlock[] = [
  {
    type: "p",
    text: "Uđi u bilo koju prodavnicu suplemenata i izaći ćeš zbunjen — ili siromašniji. **Industrija profitira od kompleksnosti**, ne od jasnoće.",
  },
  {
    type: "p",
    text: "Evo iskrenog podela: **Hrana je ~80% rezultata. Trening ~15%. Suplementi ~5%.** Taj 5% i dalje važi — ako ga potrošiš na prave stvari.",
  },
  {
    type: "p",
    text: 'Ovaj vodič je ono što kažem zauzetim klijentima u Dubaiju kada pitaju „šta da uzimam?" — **bez affiliate hype-a, bez magičnih pilula.**',
  },
  { type: "h2", text: "Osnovni stack (kupi ovo prvo)" },
  { type: "h3", text: "Kreatin monohidrat — 5 g/dan" },
  {
    type: "p",
    text: "Najistraženiji suplement u sportskoj nauci. **Snaga, moć, mišićni volumen, kognitivna funkcija** — kreatin isporučuje sve to.",
  },
  {
    type: "p",
    text: 'Nije potrebna loading faza. Pomešaj 5 g u vodi dnevno. **Jeftin, bezbedan, efikasan.** Ignoriši fancy „buffered" verzije — monohidrat je standard.',
  },
  { type: "h3", text: "Whey protein — kada hrana nije praktična" },
  {
    type: "p",
    text: "Proteinski prah je **hrana u prahu**, ne steroid. Koristi ga kada ne možeš da dostigneš proteinske ciljeve obrocima — dani putovanja, žurba posle treninga, zauzeta jutra.",
  },
  {
    type: "p",
    text: "1–2 scoopa dnevno maksimum za većinu muškaraca. **Ako već jedeš jaja, piletinu i jogurt, možda ti uopšte ne treba.**",
  },
  { type: "h3", text: "Vitamin D3 + K2 — posebno ako si u zatvorenom" },
  {
    type: "p",
    text: "Većina kancelarijskih radnika ima nedostatak. Vitamin D podržava **testosteron, imunitet, raspoloženje i zdravlje kostiju.** Upari sa K2 za usmeravanje kalcijuma.",
  },
  {
    type: "p",
    text: "2000–4000 IU D3 dnevno je tipično. **Uradi krvnu sliku jednom** ako nisi siguran — više nije uvek bolje.",
  },
  { type: "h3", text: "Magnezijum glicinat — san i oporavak" },
  {
    type: "p",
    text: "300–400 mg pre spavanja poboljšava **kvalitet sna i oporavak mišića.** Glicinat forma je blaga za stomak.",
  },
  {
    type: "p",
    text: "Ako treniraš teško, loše spavaš ili grči te noću — **ovo je često prva stvar koju treba probati.**",
  },
  { type: "h3", text: "Omega-3 riblje ulje — 2–3 g EPA+DHA dnevno" },
  {
    type: "p",
    text: "Anti-inflamatorno, zdravlje srca, podrška zglobovima, funkcija mozga. **Posebno korisno ako ne jedeš masnu ribu 2–3× nedeljno.**",
  },
  { type: "h2", text: "Opciono (situaciono)" },
  {
    type: "ul",
    items: [
      "**Kofein / pre-workout** — 100–200 mg pre treninga. Izbegavaj posle 14h. Pravi boost performansi; nije obavezan.",
      "**ZMA** — Cink + magnezijum combo ako se jako znojiš ili jedeš malo povrća.",
      "**Kolagen + vitamin C** — 10 g kolagena pre treninga za podršku zglobovima/tetivama ako su kolena ili ramena uništena.",
    ],
  },
  { type: "h2", text: "Bacanje para — ne kupuj ovo" },
  {
    type: "ul",
    items: [
      "**Testosterone boosteri** — Nijedan ne radi. Sačuvaj novac; popravi san, proteine i telesnu mast.",
      "**Fat burneri** — Marketing. Kalorijski deficit i trening su jedini fat burneri koji rade.",
      "**BCAA** — Suvišni ako je unos proteina adekvatan (a treba da bude).",
      "**Mass gainers** — Šećerne bombe. Jedite pravu hranu.",
      "**Detox čajevi i cleanse** — Jetra već detoksikuje. Pij vodu.",
    ],
  },
  { type: "h2", text: "Kako suplementi ulaze u Busy Strong 90 ishranu" },
  {
    type: "p",
    text: "Nutritivni okvir programa gradi se na **celovitoj hrani prvo:** protein na svakom obroku, 80% celovite hrane, 20% fleksibilnosti.",
  },
  {
    type: "p",
    text: "Suplementi popunjavaju praznine — ne zamenjuju obroke. **Kreatin + vitamin D + magnezijum** pokrivaju većinu zauzetih muškaraca. Dodaj whey samo kada praktičnost zahteva.",
  },
  {
    type: "table",
    headers: ["Prioritet", "Suplement", "Dnevna doza"],
    rows: [
      ["1", "Kreatin monohidrat", "5 g"],
      ["2", "Vitamin D3 + K2", "2000–4000 IU D3"],
      ["3", "Magnezijum glicinat", "300–400 mg (pre spavanja)"],
      ["4", "Omega-3", "2–3 g EPA+DHA"],
      ["5", "Whey protein", "Po potrebi za proteinske praznine"],
    ],
  },
  { type: "h2", text: "Pre nego što kupiš bilo šta drugo" },
  {
    type: "ol",
    items: [
      "Dostigni **protein na svakom obroku** 30 dana",
      "Treniraj **3× nedeljno** konzistentno",
      "Spavaj **7+ sati**",
      "Zatim dodaj kreatin i vitamin D ako već nisi",
    ],
  },
  {
    type: "p",
    text: "**Suplementi pojačavaju sistem koji radi.** Ne popravljaju pokvareni.",
  },
  {
    type: "cta",
    title: "Dobij kompletan vodič za suplemente unutar Busy Strong 90",
    bullets: [
      "Osnovno vs opciono vs bacanje para",
      "Uparuje se sa Eat Anywhere okvirom ishrane",
      "Zasnovano na dokazima — bez hype proizvoda",
    ],
    primaryHref: "/nutrition",
    primaryLabel: "Pogledaj ishranu i suplemente",
    secondaryHref: "/pricing",
    secondaryLabel: "Uzmi pun pristup — {{price}}",
  },
];
