import { problemItems } from "@/components/landing-page/content";
import { GlassCard, SectionHeading } from "@/components/landing-page/shared";

export function ProblemSection() {
  return (
    <section className="border-t border-white/10 bg-background py-24 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <SectionHeading
          eyebrow="The brutal truth"
          title="Why you're not posting — and what it's costing you."
          description="The real problem isn't motivation. It's that writing consistently takes time, generic AI kills your credibility, and disappearing from the feed quietly taxes your pipeline."
          align="left"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {problemItems.map((item) => (
            <GlassCard key={item.number} className="p-7">
              <p className="text-sm font-semibold text-white/45">{item.number}</p>
              <h3
                className="mt-8 text-2xl font-normal leading-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
