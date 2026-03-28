import { cn } from "@/lib/utils";

export function GlassCard({ as: Component = "div", className, children }) {
  return (
    <Component
      className={cn(
        "liquid-glass rounded-[28px] border border-white/10 shadow-[0_24px_90px_rgba(0,0,0,0.28)]",
        className
      )}
    >
      {children}
    </Component>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}) {
  const alignment =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={cn("flex max-w-3xl flex-col gap-4", alignment, className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/55">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="text-3xl font-normal leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
