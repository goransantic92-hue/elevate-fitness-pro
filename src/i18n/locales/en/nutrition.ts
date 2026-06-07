export default {
  meta: {
    title: "Nutrition framework — rules, meals, eat anywhere",
    description:
      "Three nutrition rules, sample meal plan, Eat Anywhere guide, and supplement guidance from the BUSY STRONG 90 manual.",
  },
  hero: {
    eyebrow: "NUTRITION SYSTEM",
    headline: "Eat Simply.",
    headlineHighlight: "Stay Strong.",
    subhead:
      "The fitness industry overcomplicates nutrition to sell you products. The truth is simple. Master three rules and outperform 90% of people who follow complicated diets.",
  },
  rules: {
    title: "The Only",
    titleHighlight: "3 Rules",
    titleSuffix: "You Need",
    ruleLabel: "RULE {{number}}",
    items: [
      {
        number: "01",
        title: "PROTEIN AT EVERY MEAL",
        body:
          "1.6–2.2g per kg of bodyweight per day. This is the single most important nutrition variable. Protein preserves muscle while losing fat, keeps you full, and has the highest thermic effect of all macros (you burn calories digesting it).",
      },
      {
        number: "02",
        title: "CONTROL CALORIES — NOT OBSESSIVELY",
        body:
          "You do not need to count every calorie. But awareness matters. A rough daily target: bodyweight (kg) × 30–33 = maintenance calories. Subtract 300–500 kcal for fat loss. Add 200–300 kcal for muscle building. Simple.",
      },
      {
        number: "03",
        title: "WHOLE FOODS FIRST",
        body:
          "If it grew from the ground or had a mother, eat it. If it comes in a crinkly packet with 47 ingredients, limit it. 80% whole foods + 20% flexibility = sustainable for life.",
      },
    ],
  },
  meals: {
    title: "Sample",
    titleHighlight: "Daily Meal Plan",
    subhead:
      "80kg male template — adjust to your weight. Swap proteins and carbs freely. The structure matters, not the exact foods.",
    items: [
      { time: "6–8 AM", name: "Breakfast", meal: "4 whole eggs scrambled + 2 slices wholegrain toast + 1 banana", macros: "~550 kcal · 35g protein · 55g carbs · 18g fat", tip: "Prep in 8 min. High protein start fuels the morning and prevents overeating." },
      { time: "10–11 AM", name: "Mid-Morning Snack", meal: "Greek yoghurt (200g) + handful mixed nuts + 1 piece of fruit", macros: "~350 kcal · 22g protein · 25g carbs · 14g fat", tip: "Keep nuts pre-portioned in a bag. Never skip — prevents blood sugar crash." },
      { time: "1–2 PM", name: "Lunch", meal: "Large chicken breast (200g) + rice (100g dry) + steamed broccoli or salad", macros: "~580 kcal · 52g protein · 65g carbs · 8g fat", tip: "Batch cook chicken and rice Sunday night. This is your anchor meal." },
      { time: "4–5 PM", name: "Pre-Workout (if training)", meal: "Protein shake + 1 medium banana + rice cake x2", macros: "~320 kcal · 28g protein · 40g carbs · 4g fat", tip: "Carbs before training = energy. Protein = muscle preservation." },
      { time: "7–8 PM", name: "Dinner", meal: "Salmon fillet (180g) or lean beef (150g) + sweet potato (200g) + greens", macros: "~560 kcal · 44g protein · 45g carbs · 16g fat", tip: "Omega-3s from salmon accelerate recovery. Don't skip the greens." },
      { time: "9–10 PM", name: "Evening Snack (optional)", meal: "Cottage cheese (200g) OR casein shake + 1 tbsp almond butter", macros: "~280 kcal · 30g protein · 8g carbs · 12g fat", tip: "Casein protein digests slowly overnight — feeds muscles while you sleep." },
    ],
  },
  eatAnywhere: {
    title: "The 'Eat Anywhere'",
    titleHighlight: "Guide",
    subhead:
      "You will eat in restaurants. You will travel. The Eat Anywhere guide ensures you always have a strategy — no excuses, no guilt, no derailment.",
    items: [
      { place: "Fast Food", tips: ["Grilled chicken > fried. Always.", "Remove the bun, double the salad side.", "Skip sauces (200 kcal hidden there).", "Water or black coffee. Never soda."] },
      { place: "Restaurant", tips: ["Ask: grilled or baked protein + vegetables.", "Sauce on the side. Control portion yourself.", "Start with a protein-heavy appetizer.", "Share dessert or skip. One bite won't kill you."] },
      { place: "Airport / Travel", tips: ["Pack: protein bar, nuts, rice cakes in carry-on.", "Sushi or poke bowls: great airport protein options.", "Avoid: croissants, muffins, airport sandwiches.", "Hydrate heavily — flying dehydrates muscle function."] },
      { place: "Office / Busy Days", tips: ["Meal prep containers in the fridge at work.", "Almonds and Greek yoghurt as desk snacks.", "Protein shake is always an acceptable meal.", "Black coffee before meetings > energy drink."] },
    ],
    rule9010: {
      title: "The 90/10 Rule",
      body:
        "Be compliant 90% of the time. That means 54 out of 60 meals in a two-week period are on plan. The other 6? Enjoy them. Life is not a diet competition.",
      quote:
        '"Perfection is the enemy of progress. Aim for compliance, not perfection." — Coach Milos',
    },
  },
  supplements: {
    title: "Supplement",
    titleHighlight: "Guide",
    subhead:
      "Supplements are 5% of your results. Food is 80%. Training is the remaining 15%. The right 5% still matters.",
    essentialTitle: "✅ Essential — Do Buy",
    optionalTitle: "Optional — situational",
    wasteTitle: "❌ Waste of Money — Don't Buy",
    essential: [
      { name: "Creatine Monohydrate", dose: "5g/day", note: "Most researched supplement in history. Strength, power, muscle. No loading needed." },
      { name: "Whey Protein", dose: "1–2 scoops/day", note: "Convenient protein top-up. Use when food isn't practical. Not magic — just food." },
      { name: "Vitamin D3 + K2", dose: "2000–4000 IU D3 daily", note: "Most busy adults are deficient. Critical for testosterone, immunity, mood." },
      { name: "Magnesium Glycinate", dose: "300–400mg before bed", note: "Improves sleep quality and recovery. Cheap and highly effective." },
      { name: "Omega-3 Fish Oil", dose: "2–3g EPA+DHA/day", note: "Anti-inflammatory, supports heart health, cognitive function, joint health." },
    ],
    optional: [
      { name: "Caffeine / Pre-workout", dose: "100–200mg caffeine", note: "Genuine performance boost. Use only before training. Avoid after 2 PM." },
      { name: "ZMA", dose: "Taken before sleep", note: "Zinc + Magnesium combo. Good if you sweat a lot or skip vegetables often." },
      { name: "Collagen + Vitamin C", dose: "10g collagen + 500mg C", note: "Take 30–60 min pre-workout. Supports joint and tendon health." },
    ],
    waste: [
      { name: "Testosterone Boosters", reason: "None of them work. Save your money." },
      { name: "Fat Burners", reason: "All marketing. Diet and training are the only fat burners that work." },
      { name: "BCAAs (if already eating enough protein)", reason: "Redundant if your protein intake is already adequate. Skip it." },
    ],
  },
  cta: {
    title: "Ready to",
    titleHighlight: "Transform",
    subhead: "Get the complete nutrition framework, meal plans, and guides inside BUSY STRONG 90.",
    button: "Get Full Access — {{price}}",
  },
  member: {
    title: "Nutrition system",
    subhead:
      "From your manual — three rules, a sample day structure, eating anywhere, and what to buy (or skip) for supplements.",
    rulesTitle: "The only rules you need",
    ruleLabel: "RULE {{number}}",
    mealPlanTitle: "Sample daily meal plan",
    mealPlanSubhead: "80kg male template — adjust to your weight. Structure matters more than exact foods.",
    eatAnywhereTitle: "Eat anywhere",
    coachTip: "Coach tip: {{tip}}",
    supplementsTitle: "Supplements",
    supplementsSubhead: "Supplements are ~5% of results. Food is ~80%. Training ~15%.",
    essentialTitle: "Essential — do buy",
    optionalTitle: "Optional — situational",
    wasteTitle: "Waste of money — don't buy",
  },
} as const;
