import { footerLinks } from "@/components/landing-page/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p
            className="text-2xl tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            draftfor.me
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The AI LinkedIn ghostwriter trained on your actual voice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
