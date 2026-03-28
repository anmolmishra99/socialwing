"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { pricingPlans } from "@/components/landing-page/content";
import { GlassCard, SectionHeading } from "@/components/landing-page/shared";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [billing, setBilling] = useState("annual");

  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-t border-white/10 bg-background py-24 sm:py-28"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <SectionHeading
          eyebrow="Simple pricing"
          title="Less than one bad hire's first day."
          description="One consistent LinkedIn presence can generate more pipeline than an entire outbound team. This is the cheapest hire you'll ever make."
        />

        <div className="mx-auto flex w-full max-w-md items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              billing === "monthly"
                ? "bg-white text-slate-950"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annual")}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              billing === "annual"
                ? "bg-white text-slate-950"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
          </button>
          <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            Save 40%
          </span>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {pricingPlans.map((plan) => {
            const isPro = plan.name === "Pro";
            const price = isPro
              ? billing === "annual"
                ? plan.annualPrice
                : plan.monthlyPrice
              : plan.price;
            const subtext = isPro
              ? billing === "annual"
                ? plan.annualSubtext
                : plan.monthlySubtext
              : plan.subtext;

            return (
              <GlassCard
                key={plan.name}
                className={cn(
                  "flex h-full flex-col p-7",
                  plan.featured ? "border-white/20 shadow-[0_28px_100px_rgba(10,24,48,0.45)]" : ""
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="text-2xl font-normal text-foreground"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {plan.name}
                    </h3>
                    <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
                      {price}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{subtext}</p>
                  </div>

                  {plan.featured ? (
                    <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      Most popular
                    </div>
                  ) : null}
                </div>

                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-200">
                        <Check className="size-3.5" />
                      </div>
                      <p className="text-sm leading-relaxed text-white/82">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                <a
                  href="#top"
                  className={cn(
                    "mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02]",
                    plan.featured
                      ? "bg-white text-slate-950"
                      : "liquid-glass text-foreground"
                  )}
                >
                  {plan.cta}
                </a>
              </GlassCard>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          No credit card required for free trial · Cancel anytime · 14-day money
          back guarantee
        </p>
      </div>
    </section>
  );
}
