import { ArrowRight } from "lucide-react";

import { GlassCard } from "@/components/landing-page/shared";

export function ClosingCTASection() {
  return (
    <section className="border-t border-white/10 bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <GlassCard className="p-8 sm:p-12 lg:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/55">
            The clock&apos;s ticking
          </p>

          <h2
            className="mt-6 max-w-4xl text-4xl font-normal leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your next deal is
            <br />
            <span className="text-muted-foreground">hiding in your feed.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every day you don&apos;t post is a day your competitor does. Your
            next client is scrolling LinkedIn right now — are they seeing you?
          </p>

          <a
            href="#pricing"
            className="liquid-glass mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
          >
            <span>Analyze my LinkedIn voice — Free</span>
            <ArrowRight className="size-4" />
          </a>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card · Takes 60 seconds · Cancel anytime
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
