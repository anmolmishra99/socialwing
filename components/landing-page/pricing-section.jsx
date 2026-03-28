"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { GlassCard, SectionHeader } from "./shared";
import { pricingPlans } from "./content";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState("annual");

  return (
    <section id="pricing" className="relative border-t border-white/10 overflow-hidden">
      {/* ── Colorful gradient mesh (same dramatic style as CTA) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-black to-blue-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(14,165,233,0.12)_0%,rgba(59,130,246,0.06)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.14)_0%,rgba(59,130,246,0.06)_30%,transparent_60%)] blur-3xl pointer-events-none animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      {/* Diamond pattern */}
      <svg className="absolute top-0 right-0 h-[600px] w-[600px] pointer-events-none opacity-[0.02]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" stroke="white" strokeWidth="0.5" />
        <path d="M 50 20 L 80 50 L 50 80 L 20 50 Z" stroke="white" strokeWidth="0.3" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-sky-400/35 animate-float-slow" />
      <div className="absolute bottom-[25%] right-[20%] h-2 w-2 rounded-full bg-blue-400/30 animate-float-drift" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Pricing"
          title="Built to pay for itself in one post."
        />

        <div className="mt-12 flex items-center justify-center gap-4">
          <span className={cn("text-sm transition-colors", billingCycle === "monthly" ? "text-white" : "text-[#a6a5ac]")}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="relative h-6 w-11 rounded-full bg-white/10 transition-colors hover:bg-white/15"
          >
            <div className={cn("absolute top-1 h-4 w-4 rounded-full bg-white transition-all", billingCycle === "monthly" ? "left-1" : "left-6")} />
          </button>
          <span className={cn("text-sm transition-colors", billingCycle === "annual" ? "text-white" : "text-[#a6a5ac]")}>Annual <span className="text-blue-400 ml-1">(Save 40%)</span></span>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <GlassCard
              key={plan.name}
              className={cn(
                "relative p-8 md:p-10",
                plan.featured && "bg-blue-500/[0.04] ring-1 ring-blue-400/30"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-medium text-white">{plan.name}</h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {billingCycle === "annual" ? (plan.annualPrice || plan.price) : (plan.monthlyPrice || plan.price)}
                </span>
                <span className="text-sm text-[#a6a5ac]">{plan.subtext}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#a6a5ac]">{plan.description}</p>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-[#a6a5ac]">
                    <Check className="size-4 shrink-0 mt-0.5 text-blue-400/70" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={cn(
                "mt-10 w-full rounded-full py-4 text-sm font-semibold transition-transform hover:scale-[1.02]",
                plan.featured ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
              )}>
                {plan.cta}
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
