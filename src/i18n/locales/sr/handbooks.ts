export default {
  eyebrow: "BESPLATNI RESURSI",
  title: "Besplatni priručnici — izaberite šta vam treba",
  subhead:
    "Izaberite jedan ili više vodiča prema svom cilju. Unesite ime i email — šaljemo samo PDF-ove koje odaberete.",
  selected: "Izabrano",
  photoCredit: "Naslovne fotografije sa Pexels-a",
  items: {
    "eat-nutrition": {
      title: "EAT Nutrition Guide",
      description: "Jednostavna pravila ishrane — bez kuhinjske vage, bez opsesije makroima. Jedite sa porodicom i ostanite na pravom putu.",
      imageAlt: "Šarena zdrava posuda sa povrćem i žitaricama",
    },
    "fuel-supplements": {
      title: "FUEL Supplement Guide",
      description: "Šta kupiti, šta je opciono i šta je bacanje novca. Zasnovano na dokazima, bez hype-a.",
      imageAlt: "Razni suplementi u kapsulama i vitamini",
    },
    "muscle-handbook": {
      title: "Muscle Handbook",
      description: "Osnove treninga, prioriteti forme i progresivni rad na snazi za zaposlene muškarce 35+.",
      imageAlt: "Mišićav muškarac radi biceps curl sa bučicama",
    },
    "busy-strong-7day": {
      title: "Busy Strong 7-Day Starter",
      description: "Vaša prva nedelja isplanirana — praktičan uvod pre punog 90-dnevnog sistema.",
      imageAlt: "Sportista trenira sa battle rope-ovima u teretani",
    },
  },
  form: {
    name: "Vaše ime",
    namePlaceholder: "Ime ili puno ime",
    email: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Pošalji moj besplatni priručnik",
    submitPlural: "Pošalji moje besplatne priručnike",
    submitting: "Slanje…",
    selectHint: "Izaberite bar jedan priručnik iznad.",
  },
  success: {
    title: "Proverite email",
    body: "Izabrani PDF priručnik je na putu. Ako ga ne vidite za nekoliko minuta, proverite spam ili promotions.",
    bodyPlural: "Izabrani PDF priručnici su na putu. Ako ih ne vidite za nekoliko minuta, proverite spam ili promotions.",
    cta: "Spremni za puni 90-dnevni sistem?",
    ctaButton: "Pogledaj BUSY STRONG 90",
  },
  toast: {
    errorTitle: "Slanje nije uspelo",
    errorFallback: "Pokušajte ponovo ili pišite na info@ptmilosilic.com.",
    selectOne: "Izaberite bar jedan priručnik.",
    invalidEmail: "Unesite ispravan email.",
    nameRequired: "Unesite svoje ime.",
  },
} as const;
