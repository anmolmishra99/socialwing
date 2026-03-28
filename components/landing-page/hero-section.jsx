import { cn } from "@/lib/utils";
import { SiteHeader } from "./site-header";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />

        <section
          id="top"
          className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-40 text-center md:py-[90px]"
        >
          <div className="flex max-w-7xl -translate-y-2 flex-col items-center md:-translate-y-6">
            <h1
              className="animate-fade-rise text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground sm:text-7xl md:text-8xl"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              <span className="text-white">LinkedIn</span>{" "}
              <span className="text-[#a6a5ac]">posts that</span>
              <br />
              <span className="text-[#a6a5ac]">sound exactly</span>{" "}
              <span className="text-white">like you.</span>
            </h1>

            <p className="animate-fade-rise-delay mt-8 max-w-3xl text-base leading-relaxed text-[#a6a5ac] sm:text-lg">
              Not like AI. Not like everyone else. Like you. draftfor.me
              learns your rhythm and voice from past posts, then drafts
              LinkedIn content that feels unmistakably yours.
            </p>

            <a
              href="#pricing"
              className={cn(
                "liquid-glass animate-fade-rise-delay-2 mt-12 cursor-pointer appearance-none rounded-full bg-white/[0.06] px-14 py-5 text-base font-medium text-foreground shadow-[0_20px_45px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-transform hover:scale-[1.03] hover:bg-white/[0.08]"
              )}
            >
              Start Free →
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
