import { SectionHeader } from "./shared";

export function ClosingCtaSection() {
  return (
    <section id="cta-closing" className="relative border-t border-white/10 overflow-hidden grain-overlay">
      {/* ── Premium gradient mesh background — most dramatic of all ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-black to-violet-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(59,130,246,0.12)_0%,rgba(139,92,246,0.08)_40%,transparent_70%)] pointer-events-none" />
      
      {/* Dramatic radial gradient burst — vivid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,rgba(139,92,246,0.08)_30%,transparent_60%)] blur-3xl pointer-events-none animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
      
      {/* Accent top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      {/* Concentric rings SVG */}
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] animate-spin-very-slow pointer-events-none opacity-[0.03]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="80" stroke="white" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="140" stroke="white" strokeWidth="0.4" />
        <circle cx="250" cy="250" r="200" stroke="white" strokeWidth="0.3" />
        <circle cx="250" cy="250" r="240" stroke="white" strokeWidth="0.2" />
      </svg>
      
      {/* Particle dots */}
      <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-blue-400/35 animate-float-slow" />
      <div className="absolute bottom-[25%] right-[20%] h-2 w-2 rounded-full bg-violet-400/30 animate-float-drift" />
      <div className="absolute top-[35%] right-[12%] h-1 w-1 rounded-full bg-white/25 animate-float-slow" style={{ animationDelay: '6s' }} />
      <div className="absolute bottom-[35%] left-[22%] h-2.5 w-2.5 rounded-full bg-cyan-400/25 animate-float-drift" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center md:px-8 md:py-28">
        <SectionHeader
          eyebrow="The clock's ticking"
          title="Your next deal is hiding in your feed."
          description="Every day you don't post is a day your competitor does. Your next client is scrolling LinkedIn right now — are they seeing you?"
        />

        <a
          href="#top"
          className="liquid-glass mt-12 inline-flex items-center justify-center rounded-full bg-white/[0.08] px-10 py-5 text-base font-medium text-white shadow-[0_20px_45px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-transform hover:scale-[1.03]"
        >
          Analyze my LinkedIn voice — Free →
        </a>

        <p className="mt-5 text-sm text-[#a6a5ac]">
          No credit card · Takes 60 seconds · Cancel anytime
        </p>
      </div>
    </section>
  );
}
