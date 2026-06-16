export default {
  meta: {
    title: "Rezultati, praćenje napretka i navike",
    description:
      "Realistična 90-dnevna vremenska linija napretka, kako pratiti kao sportista i šest stubova navika iz BUSY STRONG 90.",
  },
  hero: {
    eyebrow: "REZULTATI I NAVIKE",
    headline: "Šta",
    headlineHighlight: "očekivati",
    subhead:
      "Ne možete upravljati onim što ne merite. Pratite ove tri stvari i ništa više: (1) Telesnu težinu svakog ponedeljka ujutru — isto vreme, isti uslovi. (2) Fotografije napretka svake 4 nedelje — spreda, sa strane, pozadi, isto osvetljenje. (3) Glavne dizanje svake sesije — zabeležite težinu i ponavljanja za bench press, čučanj i mrtvo dizanje ili veslanje.",
  },
  timeline: {
    title: "Realistična",
    titleHighlight: "vremenska linija napretka",
    metricColumn: "Metrika",
    phase1: "Faza 1 (nedelja 1–4)",
    phase2: "Faza 2 (nedelja 5–8)",
    phase3: "Faza 3 (nedelja 9–12)",
    mobileWeek1: "Nedelja 1–4:",
    mobileWeek5: "Nedelja 5–8:",
    mobileWeek9: "Nedelja 9–12:",
    progressData: [
      { metric: "Telesna težina", week1: "Može ostati ista ili pad 1–2 kg", week5: "1–2 kg gubitka masti", week9: "Još 1–2 kg gubitka masti" },
      { metric: "Bench press", week1: "+2,5–5 kg moguće", week5: "Još +2,5–5 kg", week9: "Još +2,5 kg" },
      { metric: "Čučanj / leg press", week1: "+5–10 kg moguće", week5: "Još +5–10 kg", week9: "Još +5 kg" },
      { metric: "Nivo energije", week1: "Raste od nedelje 2", week5: "Primjetno više", week9: "Vrhunac — održano" },
      { metric: "Vidljiva promena", week1: "Suptilno nedelja 3–4", week5: "Jasne promene nedelja 6–7", week9: "Značajno do nedelje 10" },
    ],
  },
  track: {
    title: "Prati kao",
    titleHighlight: "sportista",
    items: [
      { label: "Telesna težina", detail: "Svakog ponedeljka ujutru, isto vreme, isti uslovi" },
      { label: "Fotografije napretka", detail: "Svake 4 nedelje — spreda, sa strane, pozadi, isto osvetljenje" },
      { label: "Glavna dizanja", detail: "Svaka sesija — zabeležite težinu i ponavljanja za bench, čučanj, veslanje" },
    ],
  },
  habits: {
    title: "6 navika za",
    titleHighlight: "konzistentnost",
    intro:
      "Ovo je deo koji većina preskoči. A i najvažniji je. Svaka metodologija treninga radi ako se primenjuje konzistentno.",
    actionLabel: "AKCIJA:",
    habits: [
      { n: 1, title: "NEPREGOVARIVI TERMINI TRENINGA", body: "Zakazujte 3 sesije kao doktorske termine — ne pomeraju se. Stavite ih u kalendar sa alarmom. Pre posla, u pauzi za ručak ili posle posla. Isto vreme, isti dani, svake nedelje. Konzistentnost > savršenstvo.", action: "Primer: 6:00 Pon · 12:30 Sre · 6:00 Pet" },
      { n: 2, title: "SAN JE VAŠ #1 PERFORMANS LEK", body: "7–9 sati je nepregovarivo. Dug sna uništava testosteron, podiže kortizol, ubija motivaciju i povećava skladištenje masti. Nijedan program treninga ne nadoknađuje hroničan nedostatak sna. Štitite san kao sportista.", action: "Cilj: minimum 7,5 sati · Konzistentno vreme buđenja svaki dan" },
      { n: 3, title: "DNEVNI PROTEIN PRVO", body: "Na svakom obroku pitajte: gde je moj protein? Gradite tanjir oko njega. 1,6–2,2 g po kg telesne težine dnevno. Samo ova navika transformisaće vašu kompoziciju tela za 90 dana.", action: "Primer 80 kg: 128–176 g proteina dnevno" },
      { n: 4, title: "PRAVILO 5 MINUTA", body: "Danima kad vam se ne trenira, obavezujte se na samo 5 minuta. Obucite se, počnite zagrevanje. U 20+ godina coaching-a, skoro niko ne stane na 5 minuta. Momentum je sve. Najteži deo je početak.", action: "Izložite odeću za trening veče pre. Uvek." },
      { n: 5, title: "PRATI NEŠTO — NE SVE", body: "Merite se svakog ponedeljka ujutru, isti uslovi. Mesečne fotografije napretka. Zabeležite glavna dizanja (bench, čučanj, mrtvo dizanje). Ne treba opsesija — trebaju vam 3 podatka da vidite da li sistem radi.", action: "Nedeljno: težina · Mesečno: fotografije · Po sesiji: glavna dizanja" },
      { n: 6, title: "NEDELJNI RESET", body: "Svake nedelje: pripremite 3 obroka za nedelju. Pregledajte raspored i potvrdite 3 termina treninga. Kupite izvore proteina. 90 minuta u nedelju štedi vas od 7 dana loših odluka.", action: "Priprema · Plan · Kupovina · San. Svake nedelje." },
    ],
  },
  cta: {
    headline: "90 dana.",
    headlineHighlight: "Manje kilograma. Više energije.",
    body: "36 sesija. 6 navika. Napravljeno za zaposlene očeve u Dubaiju.",
    getProgram: "Uzmi program — {{price}}",
    startCoaching: "Započni coaching",
  },
} as const;
