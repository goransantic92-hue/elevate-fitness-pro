import type { BlogPost } from "./types";

export const healthFitnessSupplementsPost: BlogPost = {
  slug: "health-fitness-supplements",
  title: "Health and Fitness Supplements: What to Buy, Skip, and Why",
  excerpt:
    "Supplements are ~5% of your results — but the right 5% matters. Evidence-based guide to creatine, protein, vitamin D, and the products that waste your money.",
  metaTitle: "Health and Fitness Supplements — Evidence-Based Guide",
  metaDescription:
    "Which health and fitness supplements actually work? Creatine, whey, vitamin D, magnesium, omega-3 — and what to skip (fat burners, test boosters, BCAAs).",
  keywords: [
    "fitness supplements",
    "best supplements for men",
    "creatine benefits",
    "supplements for muscle growth",
    "what supplements to take",
  ],
  publishedAt: "2026-06-16",
  readingTimeMinutes: 6,
  coverImage: "/blog/supplements.jpg",
  coverImageAlt: "Assorted health and fitness supplement capsules and vitamins",
  featuredOnHomepage: false,
  blocks: [
    {
      type: "p",
      text: "Walk into any supplement shop and you'll leave confused — or poorer. **The industry profits from complexity**, not clarity.",
    },
    {
      type: "p",
      text: "Here's the honest split: **Food is ~80% of results. Training ~15%. Supplements ~5%.** That 5% still matters — if you spend it on the right things.",
    },
    {
      type: "p",
      text: "This guide is what I tell busy clients in Dubai who ask \"what should I take?\" — **no affiliate hype, no magic pills.**",
    },
    { type: "h2", text: "The Essential Stack (Buy These First)" },
    { type: "h3", text: "Creatine Monohydrate — 5g/day" },
    {
      type: "p",
      text: "The most researched supplement in sports science. **Strength, power, muscle volume, cognitive function** — creatine delivers across the board.",
    },
    {
      type: "p",
      text: "No loading phase required. Mix 5g in water daily. **Cheap, safe, effective.** Ignore fancy \"buffered\" versions — monohydrate is the standard.",
    },
    { type: "h3", text: "Whey Protein — When Food Isn't Practical" },
    {
      type: "p",
      text: "Protein powder is **food in powder form**, not a steroid. Use it when you can't hit protein targets with meals — travel days, post-workout rushes, busy mornings.",
    },
    {
      type: "p",
      text: "1–2 scoops per day max for most men. **If you're already eating eggs, chicken, and yoghurt, you may not need it at all.**",
    },
    { type: "h3", text: "Vitamin D3 + K2 — Especially If You're Indoors" },
    {
      type: "p",
      text: "Most office workers are deficient. Vitamin D supports **testosterone, immunity, mood, and bone health.** Pair with K2 for calcium routing.",
    },
    {
      type: "p",
      text: "2000–4000 IU D3 daily is typical. **Get blood work once** if you're unsure — more isn't always better.",
    },
    { type: "h3", text: "Magnesium Glycinate — Sleep and Recovery" },
    {
      type: "p",
      text: "300–400mg before bed improves **sleep quality and muscle recovery.** Glycinate form is gentle on the stomach.",
    },
    {
      type: "p",
      text: "If you train hard, sleep poorly, or cramp at night — **this is often the first fix to try.**",
    },
    { type: "h3", text: "Omega-3 Fish Oil — 2–3g EPA+DHA Daily" },
    {
      type: "p",
      text: "Anti-inflammatory, heart health, joint support, brain function. **Especially useful if you don't eat oily fish 2–3× per week.**",
    },
    { type: "h2", text: "Optional (Situational)" },
    {
      type: "ul",
      items: [
        "**Caffeine / pre-workout** — 100–200mg before training. Avoid after 2pm. Genuine performance boost; not required.",
        "**ZMA** — Zinc + magnesium combo if you sweat heavily or eat few vegetables.",
        "**Collagen + vitamin C** — 10g collagen pre-workout for joint/tendon support if knees or shoulders are beat up.",
      ],
    },
    { type: "h2", text: "Waste of Money — Don't Buy These" },
    {
      type: "ul",
      items: [
        "**Testosterone boosters** — None work. Save your money; fix sleep, protein, and body fat instead.",
        "**Fat burners** — Marketing. A calorie deficit and training are the only fat burners that work.",
        "**BCAAs** — Redundant if protein intake is adequate (which it should be).",
        "**Mass gainers** — Sugar bombs. Eat real food.",
        "**Detox teas and cleanses** — Your liver already detoxes. Drink water.",
      ],
    },
    { type: "h2", text: "How Supplements Fit Busy Strong 90 Nutrition" },
    {
      type: "p",
      text: "The program's nutrition framework is built on **whole foods first:** protein at every meal, 80% whole foods, 20% flexibility.",
    },
    {
      type: "p",
      text: "Supplements fill gaps — not replace meals. **Creatine + vitamin D + magnesium** cover most busy men. Add whey only when convenience demands it.",
    },
    {
      type: "table",
      headers: ["Priority", "Supplement", "Daily dose"],
      rows: [
        ["1", "Creatine monohydrate", "5g"],
        ["2", "Vitamin D3 + K2", "2000–4000 IU D3"],
        ["3", "Magnesium glycinate", "300–400mg (bedtime)"],
        ["4", "Omega-3", "2–3g EPA+DHA"],
        ["5", "Whey protein", "As needed for protein gaps"],
      ],
    },
    { type: "h2", text: "Before You Buy Anything Else" },
    {
      type: "ol",
      items: [
        "Hit **protein at every meal** for 30 days",
        "Train **3× per week** consistently",
        "Sleep **7+ hours**",
        "Then add creatine and vitamin D if not already",
      ],
    },
    {
      type: "p",
      text: "**Supplements amplify a working system.** They don't fix a broken one.",
    },
    {
      type: "cta",
      title: "Get the full supplement guide inside Busy Strong 90",
      bullets: [
        "Essential vs optional vs waste of money",
        "Pairs with the Eat Anywhere nutrition framework",
        "Evidence-based — no hype products",
      ],
      primaryHref: "/nutrition",
      primaryLabel: "See Nutrition & Supplements",
      secondaryHref: "/pricing",
      secondaryLabel: "Get Full Access — {{price}}",
    },
  ],
};
