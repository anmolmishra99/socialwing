import { SectionHeader } from "./shared";
import { howItWorksSteps } from "./content";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative border-t border-white/10 overflow-hidden grain-overlay">
      {/* ── Black background ── */}
      <div className="absolute inset-0 bg-black pointer-events-none" />

      {/* Concentric circle SVG */}
      <svg className="absolute -top-20 -left-20 h-[600px] w-[600px] animate-spin-very-slow pointer-events-none opacity-[0.04]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="100" stroke="white" strokeWidth="1" />
        <circle cx="250" cy="250" r="180" stroke="white" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="240" stroke="white" strokeWidth="0.6" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-[20%] right-[15%] h-2 w-2 rounded-full bg-emerald-400/35 animate-float-slow" />
      <div className="absolute bottom-[30%] left-[40%] h-1.5 w-1.5 rounded-full bg-teal-400/30 animate-float-drift" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Dead simple"
          title="From zero to authentic post in 4 minutes."
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          {howItWorksSteps.map((step) => (
            <div key={step.step} className="group relative">
              <div className="flex items-start gap-8">
                <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-xl font-medium text-white transition-colors group-hover:border-emerald-400/30 group-hover:bg-emerald-400/5">
                  {step.step}
                </div>
                <div>
                  <div className="inline-flex rounded-full border border-white/5 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#a6a5ac]">
                    {step.eyebrow}
                  </div>
                  <h3 className="mt-4 text-2xl font-medium text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[#a6a5ac]">
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
