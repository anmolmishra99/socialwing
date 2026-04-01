export const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const heroAvatars = ["AK", "SR", "MV", "JP"];

export const problemItems = [
  {
    number: "01",
    title: `"I don't have time to write."`,
    body: "A typical LinkedIn post takes 45–90 minutes to draft, edit, and agonize over. You're a founder, not a content machine. So you skip it — again.",
  },
  {
    number: "02",
    title: `"ChatGPT makes me sound like a robot."`,
    body: `Generic AI doesn't know you. It gives you buzzword soup — "I'm thrilled to announce," "synergy," "game-changing." Your audience scrolls past it instantly.`,
  },
  {
    number: "03",
    title: `"I post once, then disappear for weeks."`,
    body: "LinkedIn's algorithm punishes inconsistency. Sporadic posting kills your reach. Your competitors who show up daily? They're winning deals you don't even know exist.",
  },
];

export const comparisonLists = {
  generic: [
    "Sounds like AI, not you",
    "Same tone for every user",
    "You prompt → it guesses your style",
    "Triggers LinkedIn's AI-detection filters",
    "No learning from your history",
    `"I'm excited to share…" every time`,
    "You still spend 30+ min editing",
  ],
  socialwing: [
    "Trained on YOUR past posts",
    "Learns your vocabulary, rhythm, humor",
    "Style analysis in 60 seconds",
    `Passes the "did a human write this?" test`,
    "Gets sharper with every post",
    "Mirrors your unique hooks & quirks",
    "Ready in 4 minutes, ship it",
  ],
};

export const howItWorksSteps = [
  {
    step: "01",
    eyebrow: "One-time setup",
    title: "Connect your LinkedIn profile",
    body: `We analyze your last 20–50 posts — your sentence structure, how you open a post, what hooks you use, how you close. We build a private "voice fingerprint" that lives only in your account.`,
  },
  {
    step: "02",
    eyebrow: "Daily — 30 seconds",
    title: "Drop in a topic or rough thought",
    body: `Tell us what you want to post about. Could be "fundraising rejection I got this week" or "why cold DMs don't work anymore". One sentence is enough. We do the rest.`,
  },
  {
    step: "03",
    eyebrow: "Takes 3 minutes",
    title: "Get a post that sounds like you wrote it at 11pm on a Tuesday",
    body: "We generate a full post using your voice fingerprint. It has your quirks, your cadence, your typical hook style. Review it, make a tweak or two, and post. Done.",
  },
  {
    step: "04",
    eyebrow: "Compounding returns",
    title: "It gets better the more you use it",
    body: "Every post you edit or approve teaches SocialWing your preferences. Over time, it needs less and less intervention — some users post in under 2 minutes.",
  },
];

export const voiceExamples = [
  {
    initials: "RK",
    name: "Raghav K. · SaaS CEO",
    role: "Revenue obsessed. Always hiring.",
    copy: [
      "3 things that killed our pipeline last quarter:",
      "1. Stopped posting → less inbound trust",
      "2. Generic outreach → 0% reply rate",
      "3. Chasing logos → wrong ICP",
      "Fixed all 3. Q3 is up 40% MoM.",
      "Consistency > genius. Ship the post.",
    ],
  },
  {
    initials: "PM",
    name: "Priya M. · Founder & Coach",
    role: "Building in public. Caffeinated.",
    copy: [
      "I used to spend Sunday nights dreading Monday posts.",
      "Now I spend 4 minutes and it's done. And it actually sounds like me — the sarcastic, slightly-too-honest version of me that people actually follow.",
      "Turns out authenticity isn't just what you say.",
      "It's how you say it. Every. Single. Time.",
      "If you're still wrestling with the blank page, come talk to me. ✨",
    ],
  },
];

export const stats = [
  { value: "1,400+", label: "Active users" },
  { value: "94%", label: "Voice match accuracy" },
  { value: "4 min", label: "Avg. post time" },
  { value: "3.1×", label: "Avg. engagement lift" },
];

export const testimonials = [
  {
    quote:
      '"My team literally asked if I hired a ghostwriter. I told them yes — one that costs less than a lunch and never misses a deadline."',
    name: "Ankit K.",
    role: "Founder, EdTech startup · 8.2K followers",
  },
  {
    quote:
      `"I've tried every AI writing tool. They all make me sound like a press release. SocialWing is the only one that nails my dry humor. That's everything."`,
    name: "Sonal R.",
    role: "VP Sales, B2B SaaS · 14.1K followers",
  },
  {
    quote:
      '"I closed two enterprise deals last quarter directly from LinkedIn conversations that started on posts SocialWing drafted. ROI? Insane."',
    name: "Mihir V.",
    role: "CEO, MarTech agency · 22K followers",
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    subtext: "forever — no card needed",
    description:
      "For curious founders who want to test the voice magic before committing.",
    features: [
      "5 posts per month",
      "Basic voice analysis (last 10 posts)",
      "3 content formats",
      "LinkedIn connect",
    ],
    cta: "Get started free",
  },
  {
    name: "Pro",
    annualPrice: "$29",
    monthlyPrice: "$49",
    annualSubtext: "/month · billed annually ($49/mo monthly)",
    monthlySubtext: "/month · billed monthly",
    description:
      "For founders & executives who need to show up daily without thinking about it.",
    features: [
      "Unlimited posts",
      "Deep voice fingerprint (50+ posts)",
      "All 12 content formats (hooks, stories, carousels, polls)",
      "Auto-learns from your edits",
      "Engagement analytics",
      "1-click schedule & post",
      "Priority support",
    ],
    cta: "Start 7-day free trial →",
    featured: true,
  },
  {
    name: "Agency / Team",
    price: "$99",
    subtext: "/month · up to 10 seats",
    description:
      "For sales teams and agencies managing multiple executives' voices.",
    features: [
      "Everything in Pro × 10 seats",
      "Separate voice profiles per user",
      "Team content calendar",
      "Client approval workflows",
      "White-label option available",
      "Dedicated onboarding call",
    ],
    cta: "Talk to us",
  },
];

export const faqItems = [
  {
    question: "Will my followers know it's AI-generated?",
    answer:
      "Not if the post sounds like you. SocialWing trains on your real LinkedIn history, then runs generation through the Humanized skill so the final draft keeps your vocabulary, pacing, humor, and quirks intact. Most users publish with only tiny edits.",
  },
  {
    question: "What if I barely have any posts? Can it still learn my style?",
    answer:
      "Yes. More posts help, but even a smaller archive gives us enough signal to learn your sentence length, hook patterns, and tone. If your history is thin, SocialWing starts with a lighter voice profile and sharpens it with every approved post.",
  },
  {
    question: "How is this different from just using ChatGPT with a custom prompt?",
    answer:
      "A prompt describes your voice. SocialWing studies the source material. That means it learns the way you actually write instead of relying on vague instructions like 'make it sound casual and punchy.'",
  },
  {
    question: "Is my LinkedIn data safe?",
    answer:
      "Yes. Your post history is used only to build your private voice fingerprint inside your account. We don't sell it, publish it, or use it to train a public model.",
  },
  {
    question: "What if I hate the generated post?",
    answer:
      "Then you don't ship it. Regenerate, edit, or throw it away. Every edit teaches the system what you actually like, so the next draft gets closer to your voice.",
  },
];

export const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Twitter / X", href: "#" },
];
