import { stats, voiceExamples } from "@/components/landing-page/content";
import { GlassCard, SectionHeading } from "@/components/landing-page/shared";

function VoiceCard({ example }) {
  return (
    <GlassCard className="p-7">
      <div className="flex items-start gap-4">
        <div className="flex size-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-foreground">
          {example.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{example.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{example.role}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-[15px] leading-7 text-white/82">
        {example.copy.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </GlassCard>
  );
}

export function VoiceMatchSection() {
  return (
    <section className="border-t border-white/10 bg-background py-24 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <SectionHeading
          eyebrow="Voice-matching in action"
          title="Two users. Same topic. Completely different voices."
          description="Because draftfor.me is trained on each person's history, the output changes with the author — not just the prompt."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {voiceExamples.map((example) => (
            <VoiceCard key={example.name} example={example} />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-white/10 bg-white/[0.03] px-6 py-7"
            >
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
