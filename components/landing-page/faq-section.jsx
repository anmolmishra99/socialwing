"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { GlassCard, SectionHeader } from "./shared";
import { faqItems } from "./content";

export function FaqSection() {
  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <section id="faq" className="relative border-t border-white/10 overflow-hidden grain-overlay">
      {/* ── Colorful gradient mesh (same dramatic style as CTA) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-950/40 via-black to-purple-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(236,72,153,0.12)_0%,rgba(168,85,247,0.06)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.14)_0%,rgba(168,85,247,0.06)_30%,transparent_60%)] blur-3xl pointer-events-none animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

      {/* Dot pattern */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots-faq-modular" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-faq-modular)" />
      </svg>

      {/* Floating dots */}
      <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-pink-400/35 animate-float-slow" />
      <div className="absolute bottom-[25%] right-[20%] h-2 w-2 rounded-full bg-purple-400/30 animate-float-drift" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-8 md:py-28">
        <SectionHeader eyebrow="Common questions" title="Answered honestly." />

        <div className="mt-14 space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;

            return (
              <GlassCard key={item.question} className="p-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left md:px-8"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-white md:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-[#a6a5ac] transition-transform",
                      isOpen && "rotate-180 text-white"
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-white/10 px-6 pb-6 pt-4 text-sm leading-relaxed text-[#a6a5ac] md:px-8 md:text-base">
                    {item.answer}
                  </div>
                ) : null}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
