import { GlassCard, SectionHeader } from "./shared";
import { testimonials } from "./content";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative border-t border-white/10 overflow-hidden grain-overlay">
      {/* ── Black background ── */}
      <div className="absolute inset-0 bg-black pointer-events-none" />

      {/* Waveform SVG */}
      <svg className="absolute top-1/2 left-0 h-[300px] w-full -translate-y-1/2 pointer-events-none opacity-[0.03]" viewBox="0 0 1000 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 50 Q 250 0, 500 50 T 1000 50" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M0 70 Q 250 20, 500 70 T 1000 70" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-20 left-1/4 h-2.5 w-2.5 rounded-full bg-amber-400/35 animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 h-2.5 w-2.5 rounded-full bg-yellow-400/30 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Social proof"
          title="Trusted by founders who value their voice."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <GlassCard key={i} className="flex flex-col p-8 transition-transform hover:scale-[1.02]">
              <div className="text-xl italic leading-relaxed text-white/90">
                {t.quote}
              </div>
              <div className="mt-auto pt-8">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="mt-1 text-sm text-[#a6a5ac]">{t.role}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
