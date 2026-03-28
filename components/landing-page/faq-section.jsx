"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { faqItems } from "@/components/landing-page/content";
import { GlassCard, SectionHeading } from "@/components/landing-page/shared";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openItem, setOpenItem] = useState(0);

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-white/10 bg-background py-24 sm:py-28"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 lg:px-8">
        <SectionHeading
          eyebrow="Common questions"
          title="Answered honestly."
          description="If you're considering this, you're probably deciding whether voice quality is real, whether your data is safe, and whether it can actually save time. Fair questions."
        />

        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = index === openItem;

            return (
              <GlassCard key={item.question} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-lg font-medium text-foreground">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform",
                      isOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-white/10 px-6 py-5">
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
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
