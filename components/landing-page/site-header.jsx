import { ArrowRight } from "lucide-react";

import { navLinks } from "@/components/landing-page/content";
import { GlassCard } from "@/components/landing-page/shared";

export function SiteHeader() {
  return (
    <div className="relative z-20 px-4 pt-6 sm:px-6 lg:px-8">
      <GlassCard className="mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="text-[1.75rem] tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          draftfor.me
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#pricing"
          className="liquid-glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]"
        >
          <span>Start Free</span>
          <ArrowRight className="size-4" />
        </a>
      </GlassCard>
    </div>
  );
}
