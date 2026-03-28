import { Check, ShieldCheck, X } from "lucide-react";

import { comparisonLists } from "@/components/landing-page/content";
import { GlassCard, SectionHeading } from "@/components/landing-page/shared";

function ComparisonList({ title, items, positive = false, badge }) {
  const Icon = positive ? Check : X;
  const iconClasses = positive
    ? "bg-emerald-400/12 text-emerald-200"
    : "bg-rose-400/12 text-rose-200";

  return (
    <GlassCard className="h-full p-7">
      <div className="flex items-center justify-between gap-4">
        <h3
          className="text-2xl font-normal text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>

        {badge ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
            <ShieldCheck className="size-3.5" />
            <span>{badge}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${iconClasses}`}
            >
              <Icon className="size-4" />
            </div>
            <p className="text-base leading-relaxed text-white/78">{item}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function ComparisonSection() {
  return (
    <section className="border-t border-white/10 bg-background py-24 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <SectionHeading
          eyebrow="The difference is obvious"
          title="Generic AI tools vs. draftfor.me"
          description="Generic tools give everyone the same polished, lifeless template. draftfor.me learns your hooks, pacing, humor, and odd little writing habits — then writes from there."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <ComparisonList
            title="ChatGPT / Generic AI"
            items={comparisonLists.generic}
          />

          <div className="hidden items-center justify-center text-sm font-semibold uppercase tracking-[0.24em] text-white/35 lg:flex">
            VS
          </div>

          <ComparisonList
            title="draftfor.me"
            items={comparisonLists.draftfor}
            positive
            badge="Humanized skill"
          />
        </div>
      </div>
    </section>
  );
}
