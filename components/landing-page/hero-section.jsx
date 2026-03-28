import { ArrowRight, Play, Sparkles } from "lucide-react";

import { heroAvatars } from "@/components/landing-page/content";
import { GlassCard } from "@/components/landing-page/shared";
import { SiteHeader } from "@/components/landing-page/site-header";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate min-h-screen overflow-hidden bg-background"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-[0.42] contrast-125 saturate-[0.85]"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <SiteHeader />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-14 px-6 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="flex max-w-3xl flex-col items-start text-left">
          <div className="liquid-glass animate-fade-rise inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/80">
            <Sparkles className="size-3.5" />
            <span>Your AI ghostwriter — trained on YOU</span>
          </div>

          <h1
            className="animate-fade-rise-delay mt-8 text-5xl font-normal leading-[0.9] tracking-[-0.05em] text-foreground sm:text-6xl md:text-7xl lg:text-[5.8rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LinkedIn posts that
            <br />
            sound exactly like you.
            <br />
            <span className="text-muted-foreground">
              Not like AI. Not like everyone else. Like you.
            </span>
          </h1>

          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg">
            ChatGPT writes posts that sound like ChatGPT. draftfor.me reads
            your past posts, learns your rhythm, your quirks, your voice — and
            drafts content that your followers will never suspect was
            AI-generated.
          </p>

          <div className="animate-fade-rise-delay-2 mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#pricing"
              className="liquid-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
            >
              <span>Analyze my LinkedIn voice</span>
              <ArrowRight className="size-4" />
            </a>

            <a
              href="#how-it-works"
              className="liquid-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]"
            >
              <Play className="size-4" />
              <span>See how it works</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {heroAvatars.map((initials) => (
                <div
                  key={initials}
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-foreground backdrop-blur-sm"
                >
                  {initials}
                </div>
              ))}
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-white/72">
              1,400+ founders &amp; executives post daily with their authentic
              voice
            </p>
          </div>

          <div className="mt-6 inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-medium text-white/72 backdrop-blur-sm">
            Powered by Humanized skill — 100% result across GPT &amp; AI
            detectors
          </div>
        </div>

        <GlassCard className="animate-fade-rise-delay-2 p-6 lg:p-8">
          <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Voice fingerprint detected — 94% match
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-foreground">
              SK
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Siddharth Kumar · CEO, SaaSify
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Founder | B2B SaaS | 12.4K followers
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-[15px] leading-7 text-white/84">
            <p>
              I lost a $180K deal last year because I stopped posting on
              LinkedIn for 3 months.
            </p>
            <p>
              Not kidding. The prospect literally said: "I wasn't sure if you
              were still operating."
            </p>
            <p>
              Visibility IS credibility.
              <br />
              Silence IS risk.
              <br />
              Consistency IS a moat.
            </p>
            <p>
              Now I post every day. Takes me 4 minutes with draftfor.me — and
              it actually sounds like me, not a robot.
            </p>
            <p>
              Your audience can tell the difference. So can your pipeline.
            </p>
            <p className="text-white/60">#founders #linkedin #b2bsaas</p>
          </div>

          <div className="mt-8 grid gap-3 border-t border-white/10 pt-5 text-sm text-white/68 sm:grid-cols-3">
            <div>👍 248 reactions</div>
            <div>💬 31 comments</div>
            <div>🔁 19 reposts</div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
