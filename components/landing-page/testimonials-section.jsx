import { GlassCard, SectionHeader } from "./shared";
import { testimonials } from "./content";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative border-t border-white/10 overflow-hidden grain-overlay">
      {/* ── Colorful gradient mesh (same dramatic style as CTA) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-black to-yellow-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(245,158,11,0.12)_0%,rgba(234,179,8,0.06)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.14)_0%,rgba(234,179,8,0.06)_30%,transparent_60%)] blur-3xl pointer-events-none animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

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
