import { Check, X } from "lucide-react";
import { comparisonLists } from "./content";

export function ComparisonSection() {
  return (
    <section id="comparison" className="relative border-t border-white/10 overflow-hidden">
      {/* ── Colorful gradient mesh (same dramatic style as CTA) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-black to-cyan-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(59,130,246,0.12)_0%,rgba(6,182,212,0.06)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,rgba(6,182,212,0.06)_30%,transparent_60%)] blur-3xl pointer-events-none animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* Diagonal grid lines */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonal-lines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-[20%] right-[15%] h-1.5 w-1.5 rounded-full bg-blue-400/35 animate-float-slow" />
      <div className="absolute bottom-[30%] left-[20%] h-2 w-2 rounded-full bg-cyan-400/30 animate-float-drift" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-28">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.12em] text-[#a6a5ac] uppercase">The difference is obvious</p>
          <h2 className="mt-4 text-4xl font-normal text-white sm:text-5xl md:text-6xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Generic AI tools vs. draftfor.me
          </h2>
        </div>

        <div className="mt-16 grid items-center gap-0 lg:grid-cols-[1fr_auto_1fr]">
          <div className="liquid-glass rounded-3xl lg:rounded-r-none border-r-0 bg-white/[0.02] p-8 md:p-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a6a5ac]">ChatGPT / Generic AI</h3>
            <ul className="mt-10 space-y-6">
              {comparisonLists.generic.map((item) => (
                <li key={item} className="flex items-center gap-4 text-base text-[#a6a5ac]">
                  <X className="size-5 shrink-0 text-white/20" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 -my-4 flex h-16 w-16 items-center justify-center self-center rounded-full border border-white/10 bg-[#050505] text-xs font-bold uppercase tracking-widest text-[#a6a5ac] shadow-xl md:h-20 md:w-20 lg:-mx-8 lg:my-0">
            VS
          </div>

          <div className="liquid-glass rounded-3xl lg:rounded-l-none border-l-0 bg-blue-500/[0.03] p-8 md:p-10 ring-1 ring-blue-400/20">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">DRAFTFOR.ME</h3>
            <ul className="mt-10 space-y-6">
              {comparisonLists.draftfor.map((item) => (
                <li key={item} className="flex items-center gap-4 text-base text-white">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                    <Check className="size-3.5 text-blue-400" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
