export const NavSection = () => (
  <nav
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      height: "64px",
      background: "#ffffff",
      borderBottom: "2px solid #000",
      fontFamily: "'Inter', sans-serif",
    }}
  >
    {/* Logo */}
    <a
      href="/"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <img
        src="/assets/images/logo.png"
        alt="SocialWing Logo"
        style={{ height: "32px", width: "auto" }}
      />
      <span
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "#000",
          letterSpacing: "-0.04em",
        }}
      >
        Social
        <em style={{ color: "#5945FE", fontStyle: "normal" }}>Wing</em>
      </span>
    </a>

    {/* Nav links */}
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div
        className="nav-desktop-links"
        style={{ display: "flex", gap: "16px" }}
      >
        {[
          { label: "COMPONENTS", href: "#" },
          { label: "TEMPLATES", href: "#" },
          { label: "PRICING", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#333",
              textDecoration: "none",
              padding: "6px 10px",
              display: "inline-flex",
              alignItems: "center",
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Auth Links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginLeft: "16px",
        }}
      >
        <a
          href="/login"
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#000",
            textDecoration: "none",
          }}
        >
          Sign In
        </a>
        <a
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#111111",
            color: "#ffffff",
            border: "2px solid #000",
            boxShadow: "3px 3px 0 #000",
            padding: "8px 20px",
            fontWeight: 600,
            fontSize: "0.85rem",
            textDecoration: "none",
            borderRadius: "4px",
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(2px, 2px)";
            e.currentTarget.style.boxShadow = "1px 1px 0 #000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "3px 3px 0 #000";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Unlock Everything
        </a>
      </div>
    </div>

    {/* Mobile: hide links */}
    <style>{`
      @media (max-width: 900px) {
        nav .nav-desktop-links { display: none !important; }
      }
    `}</style>
  </nav>
);
