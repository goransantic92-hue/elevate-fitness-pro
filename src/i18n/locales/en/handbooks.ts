export default {
  eyebrow: "FREE RESOURCES",
  title: "Free handbooks — pick what you need",
  subhead:
    "Choose one or more guides based on your goal. Enter your name and email — we'll send only the PDFs you select.",
  items: {
    "eat-nutrition": {
      title: "EAT Nutrition Guide",
      description: "Simple nutrition rules — no food scale, no macro app obsession. Eat with your family and stay on track.",
    },
    "fuel-supplements": {
      title: "FUEL Supplement Guide",
      description: "What to buy, what's optional, and what's a waste of money. Evidence-based, no hype.",
    },
    "muscle-handbook": {
      title: "Muscle Handbook",
      description: "Training fundamentals, form priorities, and progressive strength work for busy men 35+.",
    },
    "busy-strong-7day": {
      title: "Busy Strong 7-Day Starter",
      description: "Your first week mapped out — a practical on-ramp before the full 90-day system.",
    },
  },
  form: {
    name: "Your name",
    namePlaceholder: "First name or full name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Send my free handbook",
    submitPlural: "Send my free handbooks",
    submitting: "Sending…",
    selectHint: "Select at least one handbook above.",
  },
  success: {
    title: "Check your email",
    body: "Your selected handbook PDF is on its way. If you don't see it in a few minutes, check spam or promotions.",
    bodyPlural: "Your selected handbook PDFs are on their way. If you don't see them in a few minutes, check spam or promotions.",
    cta: "Ready for the full 90-day system?",
    ctaButton: "See BUSY STRONG 90",
  },
  toast: {
    errorTitle: "Could not send",
    errorFallback: "Please try again or email info@ptmilosilic.com.",
    selectOne: "Select at least one handbook.",
    invalidEmail: "Please enter a valid email.",
    nameRequired: "Please enter your name.",
  },
} as const;
