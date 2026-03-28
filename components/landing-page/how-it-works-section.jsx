import { howItWorksSteps } from "@/components/landing-page/content";
import { GlassCard, SectionHeading } from "@/components/landing-page/shared";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-white/10 bg-background py-24 sm:py-28"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dead simple"
          title="From zero to authentic post in 4 minutes."
          description="The workflow is deliberately boring: connect once, drop in a topic, approve the draft, and let the voice fingerprint sharpen itself over time."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {howItWorksSteps.map((step) => (
            <GlassCard key={step.step} className="p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white/45">{step.step}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                  {step.eyebrow}
                </p>
              </div>
              <h3
                className="mt-10 max-w-md text-2xl font-normal leading-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
