import { testimonials } from "@/components/landing-page/content";
import { GlassCard, SectionHeading } from "@/components/landing-page/shared";

export function TestimonialsSection() {
  return (
    <section className="border-t border-white/10 bg-background py-24 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <SectionHeading
          eyebrow="What they're saying"
          title="Results from founders like you"
          description="These aren't people looking for nicer wording. They're buying back time, keeping their voice intact, and staying visible enough to turn content into conversations."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <GlassCard key={testimonial.name} className="flex h-full flex-col p-7">
              <p className="text-sm tracking-[0.2em] text-amber-200">★★★★★</p>
              <p className="mt-6 flex-1 text-base leading-relaxed text-white/84">
                {testimonial.quote}
              </p>
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
