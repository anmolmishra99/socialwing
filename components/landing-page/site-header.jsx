import { cn } from "@/lib/utils";
import { navLinks } from "@/components/landing-page/content";

export function SiteHeader() {
  return (
    <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
      <a
        href="#top"
        className="text-3xl tracking-tight text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        draftfor.me
      </a>

      <div className="hidden items-center gap-8 md:flex">
        {navLinks.map((link, index) => (
          <a
            key={link.label}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors",
              index === 0
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="#pricing"
        className={cn(
          "liquid-glass appearance-none rounded-full px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        )}
      >
        Start Free →
      </a>
    </nav>
  );
}
