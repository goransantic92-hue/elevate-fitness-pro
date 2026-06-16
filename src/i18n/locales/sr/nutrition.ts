export default {
  meta: {
    title: "Okvir ishrane — pravila, obroci, jedi bilo gde",
    description:
      "Tri pravila ishrane, primer plana obroka, Eat Anywhere vodič i saveti za suplemente iz BUSY STRONG 90 priručnika.",
  },
  hero: {
    eyebrow: "SISTEM ISHRANE",
    headline: "Jedi jednostavno.",
    headlineHighlight: "Ostani jak.",
    subhead:
      "Fitnes industrija komplikuje ishranu da vam proda proizvode. Istina je jednostavna. Savladajte tri pravila i nadmašite 90% ljudi koji prate komplikovane dijete.",
  },
  rules: {
    title: "Jedina",
    titleHighlight: "3 pravila",
    titleSuffix: "koja vam trebaju",
    ruleLabel: "PRAVILO {{number}}",
    items: [
      {
        number: "01",
        title: "PROTEIN NA SVAKOM OBROKU",
        body:
          "1,6–2,2 g po kg telesne težine dnevno. Ovo je najvažnija promenljiva ishrane. Protein čuva mišiće tokom gubitka masti, drži vas sitim i ima najveći termički efekat od svih makronutrijenata (trošite kalorije vareći ga).",
      },
      {
        number: "02",
        title: "KONTROLIŠITE KALORIJE — BEZ OPSESIJE",
        body:
          "Ne morate brojati svaku kaloriju. Ali svest je važna. Grubi dnevni cilj: telesna težina (kg) × 30–33 = kalorije održavanja. Oduzmite 300–500 kcal za gubitak masti. Dodajte 200–300 kcal za gradnju mišića. Jednostavno.",
      },
      {
        number: "03",
        title: "CELA HRANA PRVO",
        body:
          "Ako je izrasla iz zemlje ili je imala majku, jedite je. Ako dolazi u šuštavoj kesici sa 47 sastojaka, ograničite je. 80% cele hrane + 20% fleksibilnosti = održivo ceo život.",
      },
    ],
  },
  meals: {
    title: "Primer",
    titleHighlight: "dnevnog plana obroka",
    subhead:
      "Šablon za muškarca od 80 kg — prilagodite svojoj težini. Slobodno menjajte proteine i ugljene hidrate. Struktura je važna, ne tačna hrana.",
    items: [
      { time: "6–8", name: "Doručak", meal: "4 cela jaja na žaru + 2 kriške integralnog hleba + 1 banana", macros: "~550 kcal · 35 g proteina · 55 g ugljenih hidrata · 18 g masti", tip: "Priprema za 8 min. Visok protein ujutru pokreće jutro i sprečava prejedanje." },
      { time: "10–11", name: "Užina pre podne", meal: "Grčki jogurt (200 g) + šaka mešanih orašastih plodova + 1 voće", macros: "~350 kcal · 22 g proteina · 25 g ugljenih hidrata · 14 g masti", tip: "Orašasti plodovi unapred porcionisani u kesici. Nikad ne preskačite — sprečava pad šećera u krvi." },
      { time: "13–14", name: "Ručak", meal: "Velika pileća prsa (200 g) + pirinač (100 g suvog) + brokoli na pari ili salata", macros: "~580 kcal · 52 g proteina · 65 g ugljenih hidrata · 8 g masti", tip: "Pripremite piletinu i pirinač u nedelju uveče. Ovo je vaš sidreni obrok." },
      { time: "16–17", name: "Pre treninga (ako trenirate)", meal: "Proteinski šejk + 1 srednja banana + 2 pirinčane krekere", macros: "~320 kcal · 28 g proteina · 40 g ugljenih hidrata · 4 g masti", tip: "Ugljeni hidrati pre treninga = energija. Protein = očuvanje mišića." },
      { time: "19–20", name: "Večera", meal: "Losos (180 g) ili nemasna govedina (150 g) + batat (200 g) + zeleno povrće", macros: "~560 kcal · 44 g proteina · 45 g ugljenih hidrata · 16 g masti", tip: "Omega-3 iz lososa ubrzava oporavak. Ne preskačite zeleno povrće." },
      { time: "21–22", name: "Večernja užina (opciono)", meal: "Pavlaka (200 g) ILI kazein šejk + 1 kašika bademovog putera", macros: "~280 kcal · 30 g proteina · 8 g ugljenih hidrata · 12 g masti", tip: "Kazein se sporo vari preko noći — hrani mišiće dok spavate." },
    ],
  },
  eatAnywhere: {
    title: "Vodič",
    titleHighlight: "Jedi bilo gde",
    subhead:
      "Jedećete u restoranima. Putovaćete. Eat Anywhere vodič osigurava da uvek imate strategiju — bez izgovora, bez krivice, bez skretanja s puta.",
    items: [
      { place: "Brza hrana", tips: ["Pileće na žaru > prženo. Uvek.", "Skinite pecivo, udvostručite salatu.", "Preskočite sosove (200 kcal skriveno).", "Voda ili crna kafa. Nikad gazirano."] },
      { place: "Restoran", tips: ["Pitajte: protein na žaru ili u rerni + povrće.", "Sos sa strane. Vi kontrolišete porciju.", "Počnite proteinom bogatim predjelo.", "Podelite desert ili preskočite. Jedan zalogaj neće ubiti."] },
      { place: "Aerodrom / putovanje", tips: ["Spakujte: proteinska čokoladica, orašasti plodovi, pirinčani krekeri u ručnoj prtljagu.", "Sushi ili poke zdjele: odlične proteinske opcije na aerodromu.", "Izbegavajte: kroasane, mafine, sendviče sa aerodroma.", "Pijte puno vode — let dehidrira mišiće."] },
      { place: "Kancelarija / zauzeti dani", tips: ["Meal prep posude u frižideru na poslu.", "Bademi i grčki jogurt kao užine za sto.", "Proteinski šejk je uvek prihvatljiv obrok.", "Crna kafa pre sastanaka > energetsko piće."] },
    ],
    rule9010: {
      title: "Pravilo 90/10",
      body:
        "Budite usklađeni 90% vremena. To znači 54 od 60 obroka u dve nedelje su po planu. Ostalih 6? Uživajte. Život nije takmičenje u dijetama.",
      quote:
        "Savršenstvo je neprijatelj napretka. Ciljajte usklađenost, ne savršenstvo. — Coach Milos",
    },
  },
  supplements: {
    title: "Vodič za",
    titleHighlight: "suplemente",
    subhead:
      "Suplementi su 5% vaših rezultata. Hrana je 80%. Trening preostalih 15%. Pravih 5% i dalje važi.",
    essentialTitle: "✅ Esencijalno — kupite",
    optionalTitle: "Opciono — situaciono",
    wasteTitle: "❌ Bacanje novca — ne kupujte",
    essential: [
      { name: "Kreatin monohidrat", dose: "5 g/dan", note: "Najistraženiji suplement u istoriji. Snaga, moć, mišići. Bez loading faze." },
      { name: "Whey protein", dose: "1–2 scoopa/dan", note: "Praktičan proteinski dodatak. Koristite kad hrana nije praktična. Nije magija — samo hrana." },
      { name: "Vitamin D3 + K2", dose: "2000–4000 IU D3 dnevno", note: "Većina zaposlenih odraslih je u deficitu. Ključno za testosteron, imunitet, raspoloženje." },
      { name: "Magnezijum glisinat", dose: "300–400 mg pre spavanja", note: "Poboljšava kvalitet sna i oporavak. Jeftin i veoma efikasan." },
      { name: "Omega-3 riblje ulje", dose: "2–3 g EPA+DHA/dan", note: "Anti-inflamatorno, podržava zdravlje srca, kognitivne funkcije, zglobove." },
    ],
    optional: [
      { name: "Kofein / pre-workout", dose: "100–200 mg kofeina", note: "Pravi performans boost. Samo pre treninga. Izbegavajte posle 14h." },
      { name: "ZMA", dose: "Pre spavanja", note: "Cink + magnezijum combo. Dobro ako puno znoite ili često preskačete povrće." },
      { name: "Kolagen + vitamin C", dose: "10 g kolagena + 500 mg C", note: "30–60 min pre treninga. Podržava zdravlje zglobova i tetiva." },
    ],
    waste: [
      { name: "Testosterone boosteri", reason: "Nijedan ne radi. Sačuvajte novac." },
      { name: "Fat burneri", reason: "Samo marketing. Dijeta i trening su jedini fat burneri koji rade." },
      { name: "BCAA (ako već jedete dovoljno proteina)", reason: "Suvišno ako je unos proteina već adekvatan. Preskočite." },
    ],
  },
  cta: {
    title: "Spremni za",
    titleHighlight: "transformaciju",
    subhead: "Uzmite kompletan okvir ishrane, planove obroka i vodiče unutar BUSY STRONG 90.",
    button: "Pun pristup — {{price}}",
  },
  member: {
    title: "Sistem ishrane",
    subhead:
      "Iz vašeg priručnika — tri pravila, primer dnevne strukture, jelo bilo gde i šta kupiti (ili preskočiti) za suplemente.",
    rulesTitle: "Jedina pravila koja vam trebaju",
    ruleLabel: "PRAVILO {{number}}",
    mealPlanTitle: "Primer dnevnog plana obroka",
    mealPlanSubhead: "Šablon za muškarca od 80 kg — prilagodite svojoj težini. Struktura je važnija od tačne hrane.",
    eatAnywhereTitle: "Jedi bilo gde",
    coachTip: "Coach savet: {{tip}}",
    supplementsTitle: "Suplementi",
    supplementsSubhead: "Suplementi su ~5% rezultata. Hrana ~80%. Trening ~15%.",
    essentialTitle: "Esencijalno — kupite",
    optionalTitle: "Opciono — situaciono",
    wasteTitle: "Bacanje novca — ne kupujte",
  },
} as const;
