import { cn } from "@/lib/utils";

export function GlassCard({ className, children }) {
  return (
    <div
      className={cn(
        "liquid-glass rounded-[28px] bg-white/[0.03] shadow-[0_18px_40px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, description, className }) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <p className="text-sm font-medium tracking-[0.12em] text-[#a6a5ac] uppercase">
        {eyebrow}
      </p>
      <h2
        className="mt-4 text-4xl font-normal leading-tight text-white sm:text-5xl md:text-6xl"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-[#a6a5ac] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
