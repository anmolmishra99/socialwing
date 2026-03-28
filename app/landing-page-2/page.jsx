"use client";

import React, { useEffect } from "react";
import { Instrument_Serif, Syne, DM_Sans } from "next/font/google";

// Components
import { SharedStyles } from "@/components/landing-page-2/shared";
import { NavSection } from "@/components/landing-page-2/nav-section";
import { HeroSection } from "@/components/landing-page-2/hero-section";
import { ProblemSection } from "@/components/landing-page-2/problem-section";
import { VsSection } from "@/components/landing-page-2/vs-section";
import { HowItWorksSection } from "@/components/landing-page-2/how-it-works-section";
import { StyleDemoSection } from "@/components/landing-page-2/style-demo-section";
import { StatsSection } from "@/components/landing-page-2/stats-section";
import { TestimonialsSection } from "@/components/landing-page-2/testimonials-section";
import { PricingSection } from "@/components/landing-page-2/pricing-section";
import { FaqSection } from "@/components/landing-page-2/faq-section";
import { ClosingCtaSection } from "@/components/landing-page-2/closing-cta-section";
import { FooterSection } from "@/components/landing-page-2/footer-section";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
});

export default function LandingPage2() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${instrumentSerif.variable} ${syne.variable} ${dmSans.variable} font-sans`}>
      <SharedStyles instrumentSerif={instrumentSerif} syne={syne} dmSans={dmSans} />
      
      <NavSection />
      
      <main>
        <HeroSection />
        <ProblemSection />
        <VsSection />
        <HowItWorksSection />
        <StyleDemoSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <ClosingCtaSection />
      </main>

      <FooterSection />
    </div>
  );
}
