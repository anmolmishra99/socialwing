"use client";

import React from "react";
import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { ComparisonSection } from "./comparison-section";
import { HowItWorksSection } from "./how-it-works-section";
import { VoiceMatchSection } from "./voice-match-section";
import { TestimonialsSection } from "./testimonials-section";
import { PricingSection } from "./pricing-section";
import { FaqSection } from "./faq-section";
import { ClosingCtaSection } from "./closing-cta-section";
import { SiteFooter } from "./site-footer";

export default function LandingPage() {
  return (
    <main className="relative w-full overflow-x-hidden bg-background selection:bg-white/20 selection:text-white">
      <HeroSection />
      <ProblemSection />
      <ComparisonSection />
      <HowItWorksSection />
      <VoiceMatchSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <ClosingCtaSection />
      <SiteFooter />
    </main>
  );
}
