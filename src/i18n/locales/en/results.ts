export default {
  meta: {
    title: "Results, progress tracking & habits",
    description:
      "Realistic 90-day progress timeline, how to track like an athlete, and the six habit pillars from BUSY STRONG 90.",
  },
  hero: {
    eyebrow: "RESULTS & HABITS",
    headline: "What to",
    headlineHighlight: "Expect",
    subhead:
      "You cannot manage what you cannot measure. Track these three things and nothing else: (1) Bodyweight every Monday morning — same time, same conditions. (2) Progress photos every 4 weeks — front, side, back, same lighting. (3) Main lifts each session — log the weight and reps for bench press, squat, and deadlift or row.",
  },
  timeline: {
    title: "Realistic",
    titleHighlight: "Progress Timeline",
    metricColumn: "Metric",
    phase1: "Phase 1 (Week 1–4)",
    phase2: "Phase 2 (Week 5–8)",
    phase3: "Phase 3 (Week 9–12)",
    mobileWeek1: "Week 1–4:",
    mobileWeek5: "Week 5–8:",
    mobileWeek9: "Week 9–12:",
    progressData: [
      { metric: "Body Weight", week1: "May stay same or drop 1–2kg", week5: "1–2kg fat loss", week9: "1–2kg more fat loss" },
      { metric: "Bench Press", week1: "+2.5–5kg possible", week5: "+2.5–5kg more", week9: "+2.5kg more" },
      { metric: "Squat / Leg Press", week1: "+5–10kg possible", week5: "+5–10kg more", week9: "+5kg more" },
      { metric: "Energy Levels", week1: "Rising from week 2", week5: "Noticeably higher", week9: "Peak — sustained" },
      { metric: "Visible Change", week1: "Subtle week 3–4", week5: "Clear changes week 6–7", week9: "Significant by week 10" },
    ],
  },
  track: {
    title: "Track Like an",
    titleHighlight: "Athlete",
    items: [
      { label: "Bodyweight", detail: "Every Monday morning, same time, same conditions" },
      { label: "Progress Photos", detail: "Every 4 weeks — front, side, back, same lighting" },
      { label: "Main Lifts", detail: "Each session — log weight and reps for bench, squat, row" },
    ],
  },
  habits: {
    title: "6 Habits for",
    titleHighlight: "Consistency",
    intro:
      "This is the section most people skip. It is also the most important. Every training methodology works if applied consistently.",
    actionLabel: "ACTION:",
    habits: [
      { n: 1, title: "NON-NEGOTIABLE TRAINING SLOTS", body: "Schedule your 3 sessions like doctor appointments — they cannot be moved. Put them in your calendar with an alarm. Before work, lunch break, or after work. Same time, same days, every week. Consistency > Perfection.", action: "Example: 6:00 AM Monday · 12:30 PM Wednesday · 6:00 AM Friday" },
      { n: 2, title: "SLEEP IS YOUR #1 PERFORMANCE DRUG", body: "7–9 hours is non-negotiable. Sleep debt destroys testosterone, raises cortisol, kills motivation, and increases fat storage. No training program overcomes chronic sleep deprivation. Protect your sleep like an athlete.", action: "Target: 7.5 hours minimum · Consistent wake time daily" },
      { n: 3, title: "DAILY PROTEIN FIRST", body: "At every meal, ask: where is my protein? Build your plate around it. 1.6–2.2g per kg of bodyweight daily. This one habit alone will transform your body composition over 90 days.", action: "Example 80kg: 128–176g protein per day" },
      { n: 4, title: "THE 5-MINUTE RULE", body: "On days you don't feel like training, commit to just 5 minutes. Get changed, start warming up. In 20+ years of coaching, almost nobody stops at 5 minutes. Momentum is everything. The hardest part is starting.", action: "Put your gym clothes out the night before. Always." },
      { n: 5, title: "TRACK SOMETHING — NOT EVERYTHING", body: "Weigh yourself every Monday morning, same conditions. Take monthly progress photos. Log your main lifts (bench, squat, deadlift). You don't need to obsess — you just need 3 data points to see if the system is working.", action: "Weekly: weight · Monthly: photos · Per session: main lifts" },
      { n: 6, title: "THE SUNDAY RESET", body: "Every Sunday: prep 3 meals for the week. Review next week's schedule and confirm your 3 training slots. Shop for protein sources. 90 minutes on Sunday saves you from 7 days of poor decisions.", action: "Prep · Plan · Shop · Sleep. Every Sunday." },
    ],
  },
  cta: {
    headline: "90 days.",
    headlineHighlight: "Weight down. Energy back.",
    body: "36 sessions. 6 habits. Built for busy fathers in Dubai.",
    getProgram: "Get the Program — {{price}}",
    startCoaching: "Start Coaching",
  },
} as const;
