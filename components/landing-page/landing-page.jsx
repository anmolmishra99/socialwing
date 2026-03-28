import { cn } from "@/lib/utils";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

export function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background selection:bg-white/20 selection:text-white">
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
        <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
          <div
            className="text-3xl tracking-tight text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Velorah<sup className="text-xs">®</sup>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#"
              className="text-sm font-medium text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Studio
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Journal
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Reach Us
            </a>
          </div>

          <button
            className={cn(
              "liquid-glass appearance-none rounded-full px-6 py-2.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]"
            )}
          >
            Begin Journey
          </button>
        </nav>

        <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-40 text-center md:py-[90px]">
          <div className="flex max-w-7xl flex-col items-center">
            <h1
              className="animate-fade-rise text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground sm:text-7xl md:text-8xl"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Where{" "}
              <em className="not-italic text-muted-foreground">dreams</em> rise{" "}
              <br />
              <em className="not-italic text-muted-foreground">
                through the silence.
              </em>
            </h1>

            <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We&apos;re designing tools for deep thinkers, bold creators, and
              quiet rebels. Amid the chaos, we build digital spaces for sharp
              focus and inspired work.
            </p>

            <button
              className={cn(
                "liquid-glass animate-fade-rise-delay-2 mt-12 cursor-pointer appearance-none rounded-full px-14 py-5 text-base font-medium text-foreground transition-transform hover:scale-[1.03]"
              )}
            >
              Begin Journey
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
