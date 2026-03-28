import { GlassCard, SectionHeader } from "./shared";
import { problemItems } from "./content";

export function ProblemSection() {
  return (
    <section id="problem" className="relative border-t border-white/10 overflow-hidden grain-overlay">
      {/* ── Colorful gradient mesh (same dramatic style as CTA) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-black to-orange-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(244,63,94,0.12)_0%,rgba(251,146,60,0.06)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.14)_0%,rgba(251,146,60,0.06)_30%,transparent_60%)] blur-3xl pointer-events-none animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />

      {/* Subtle grid SVG */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-problem" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-problem)" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-rose-400/35 animate-float-slow" />
      <div className="absolute bottom-[25%] right-[20%] h-2 w-2 rounded-full bg-orange-400/30 animate-float-drift" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="The brutal truth"
          title="Why you're not posting — and what it's costing you."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {problemItems.map((item) => (
            <GlassCard key={item.number} className="p-7 md:p-8">
              <div className="text-sm font-medium tracking-[0.14em] text-[#a6a5ac]">
                {item.number}
              </div>
              <h3 className="mt-5 text-2xl font-medium leading-snug text-white">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#a6a5ac]">
                {item.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
