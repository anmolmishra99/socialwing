export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black overflow-hidden">
      {/* Subtle gradient fade at top of footer */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div
          className="text-2xl tracking-tight text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          draftfor.me
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#a6a5ac]">
          <a href="#" className="transition-colors hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Blog
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
