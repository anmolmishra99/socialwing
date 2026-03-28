import { SectionHeader } from "./shared";
import { voiceExamples, stats } from "./content";

export function VoiceMatchSection() {
  return (
    <section id="voice-match" className="relative border-t border-white/10 overflow-hidden">
      {/* ── Colorful gradient mesh (same dramatic style as CTA) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-black to-fuchsia-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(139,92,246,0.12)_0%,rgba(217,70,239,0.06)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.14)_0%,rgba(217,70,239,0.06)_30%,transparent_60%)] blur-3xl pointer-events-none animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* Corner brackets SVG */}
      <svg className="absolute top-20 left-20 h-20 w-20 pointer-events-none opacity-[0.05]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 0 L 0 0 L 0 20" stroke="white" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-20 right-20 h-20 w-20 pointer-events-none opacity-[0.05]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 80 100 L 100 100 L 100 80" stroke="white" strokeWidth="2" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-violet-400/35 animate-float-slow" />
      <div className="absolute bottom-[25%] right-[20%] h-2 w-2 rounded-full bg-fuchsia-400/30 animate-float-drift" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="The science of style"
          title="Your voice is a fingerprint. We just mapped it."
          description="We don't just 'generate' text. We mirror your unique vocabulary, sentence rhythm, and typical hook patterns."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {voiceExamples.map((example) => (
            <div key={example.name} className="liquid-glass rounded-3xl bg-white/[0.02] p-8 md:p-10">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                  {example.initials}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">{example.name}</h4>
                  <p className="text-sm text-[#a6a5ac]">{example.role}</p>
                </div>
              </div>
              <div className="mt-8 space-y-4 rounded-2xl bg-white/[0.03] p-6 text-[15px] leading-relaxed text-[#a6a5ac]">
                {example.copy.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-white/10 pt-16 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-normal text-white md:text-5xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-[#a6a5ac] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
