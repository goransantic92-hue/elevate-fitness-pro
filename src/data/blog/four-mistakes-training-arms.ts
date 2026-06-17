import type { BlogPost } from "./types";
import { blocksSr } from "./four-mistakes-training-arms.sr";

export const fourMistakesArmsPost: BlogPost = {
  slug: "four-mistakes-training-arms",
  title: "4 Mistakes When Training Arms (And What to Do Instead)",
  excerpt:
    "Swinging curls, skipping triceps, and endless arm days won't build sleeves — they'll stall your progress. Fix these four errors and grow arms without extra gym time.",
  metaTitle: "4 Mistakes When Training Arms — Biceps & Triceps Tips",
  metaDescription:
    "Avoid the four biggest arm training mistakes: ego lifting, neglecting triceps, too much isolation, and bad recovery. Better arm workouts for busy men.",
  keywords: [
    "arm training mistakes",
    "biceps workout tips",
    "triceps training",
    "how to grow arms",
    "arm workout men over 35",
  ],
  publishedAt: "2026-06-14",
  readingTimeMinutes: 5,
  coverImage: "/blog/arm-training.jpg",
  coverImageAlt: "Man training biceps with dumbbells in the gym",
  featuredOnHomepage: true,
  blocks: [
    {
      type: "p",
      text: "Every busy man eventually wants **bigger arms.** It's the first thing you check in the mirror and the first muscle group beginners overtrain.",
    },
    {
      type: "p",
      text: "The problem isn't that arms are hard to grow. The problem is **how most people train them** — especially when time is limited and ego is high.",
    },
    {
      type: "p",
      text: "Fix these four mistakes and your arms will grow as a **by-product of getting stronger overall** — not from an extra 45-minute \"arm day.\"",
    },
    { type: "h2", text: "Mistake #1: Swinging the Weight (Ego Curls)" },
    {
      type: "p",
      text: "If your elbows travel forward, your hips drive the rep, or the weight drops on the way down — **your biceps aren't doing the work.** Your lower back is.",
    },
    {
      type: "p",
      text: "**Fix it:**",
    },
    {
      type: "ul",
      items: [
        "Pin elbows to your sides (or bench on preacher curls)",
        "Lower the weight **10–20%**",
        "2–3 second negative on every rep",
        "Stop 1–2 reps before form breaks",
      ],
    },
    {
      type: "blockquote",
      text: "The muscle doesn't know how much weight is on the bar. It knows tension. Control creates tension.",
    },
    { type: "h2", text: "Mistake #2: Ignoring Triceps (They're 2/3 of Your Arm)" },
    {
      type: "p",
      text: "Most men train biceps because they see them in the mirror. But **triceps make up roughly two-thirds of upper arm mass.**",
    },
    {
      type: "p",
      text: "Close-grip push-ups, dips, and overhead extensions build the horseshoe faster than another set of curls.",
    },
    {
      type: "p",
      text: "**Fix it:** For every biceps exercise in your week, include a triceps movement. In Busy Strong 90, push days already hit triceps hard — **you may not need a dedicated arm day at all.**",
    },
    { type: "h2", text: "Mistake #3: Adding an \"Arm Day\" Before You're Strong on Compounds" },
    {
      type: "p",
      text: "Beginners add **15 sets of arms** while benching 40 kg and rowing with momentum. Arms grow when the whole system gets stronger.",
    },
    {
      type: "p",
      text: "Chin-ups build biceps. Rows build biceps. Push-ups and presses build triceps. **Compounds first — isolation is seasoning, not the meal.**",
    },
    {
      type: "p",
      text: "**Fix it:** If you train 3× per week, add **2–3 direct arm sets at the end** of push or pull sessions. That's enough for most busy men.",
    },
    { type: "h2", text: "Mistake #4: Training Arms When They're Already Fatigued" },
    {
      type: "p",
      text: "Doing curls after a heavy back day when your biceps are already smoked from rows? **You're training fatigue, not muscle.**",
    },
    {
      type: "p",
      text: "Same with triceps after heavy pressing — if you can't feel the muscle work, the set is junk volume.",
    },
    {
      type: "p",
      text: "**Fix it:**",
    },
    {
      type: "ul",
      items: [
        "Place direct arm work **early in the session** if arms are the priority",
        "Or accept that compounds are enough for the first 8–12 weeks",
        "Sleep and protein matter more than the 4th curl variation",
      ],
    },
    { type: "h2", text: "A Simple Arm Finisher (10 Minutes Max)" },
    {
      type: "p",
      text: "Add this after your main workout **once or twice per week:**",
    },
    {
      type: "ol",
      items: [
        "**A1:** Dumbbell curls — 3×10–12, controlled tempo",
        "**A2:** Overhead triceps extension — 3×10–12, same tempo",
        "Alternate with **60s rest** between exercises",
      ],
    },
    {
      type: "p",
      text: "Six sets total. Done in under 10 minutes. **More than that is rarely needed** when your push/pull work is solid.",
    },
    { type: "h2", text: "The Bigger Picture" },
    {
      type: "p",
      text: "Arms grow when you:",
    },
    {
      type: "ul",
      items: [
        "Get stronger on **rows, presses, and chin-ups**",
        "Eat **enough protein** daily",
        "Sleep **7+ hours**",
        "Add **small amounts** of direct arm work without sacrificing recovery",
      ],
    },
    {
      type: "p",
      text: "Busy Strong 90 builds arms through **push, pull, and compound progress** — not through a separate bro-split that eats your calendar.",
    },
    {
      type: "cta",
      title: "Train arms as part of a system — not a standalone obsession",
      primaryHref: "/training",
      primaryLabel: "See Training Programs",
      secondaryHref: "/pricing",
      secondaryLabel: "Get Full Access — {{price}}",
    },
  ],
  blocksByLocale: { sr: blocksSr },
};
