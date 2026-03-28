"use client";
import React, { useState } from "react";

export const PricingSection = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="pricing-section" id="pricing">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap");

        /* ── Shell ── */
        .pricing-section {
          padding: 140px 24px 120px;
          background: #f7f4ef;
          position: relative;
          overflow: hidden;
          font-family: "DM Sans", sans-serif;
        }

        /* ── SVG backgrounds ── */
        .pricing-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Fade overlays ── */
        .pricing-fade-top,
        .pricing-fade-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 160px;
          pointer-events: none;
          z-index: 1;
        }
        .pricing-fade-top {
          top: 0;
          background: linear-gradient(to bottom, #f7f4ef 0%, transparent 100%);
        }
        .pricing-fade-bottom {
          bottom: 0;
          background: linear-gradient(to top, #f7f4ef 0%, transparent 100%);
        }

        /* ── Warm glows ── */
        .glow-top {
          position: absolute;
          width: 800px;
          height: 500px;
          top: -160px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(
            ellipse,
            rgba(232, 82, 26, 0.09) 0%,
            transparent 65%
          );
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }
        .glow-br {
          position: absolute;
          width: 440px;
          height: 400px;
          bottom: -80px;
          right: -60px;
          background: radial-gradient(
            ellipse,
            rgba(210, 140, 60, 0.12) 0%,
            transparent 65%
          );
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }
        .glow-bl {
          position: absolute;
          width: 360px;
          height: 360px;
          bottom: 40px;
          left: -80px;
          background: radial-gradient(
            ellipse,
            rgba(180, 100, 40, 0.08) 0%,
            transparent 65%
          );
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Corner ornaments ── */
        .corner-ornament {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          opacity: 0.25;
        }
        .corner-ornament.tl {
          top: 24px;
          left: 24px;
        }
        .corner-ornament.tr {
          top: 24px;
          right: 24px;
          transform: scaleX(-1);
        }
        .corner-ornament.bl {
          bottom: 24px;
          left: 24px;
          transform: scaleY(-1);
        }
        .corner-ornament.br {
          bottom: 24px;
          right: 24px;
          transform: scale(-1, -1);
        }

        /* ── Inner ── */
        .pricing-inner {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        /* ── Eyebrow ── */
        .pricing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c4541a;
          margin-bottom: 20px;
        }
        .eyebrow-ornament {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c4541a88);
        }
        .eyebrow-ornament.right {
          background: linear-gradient(90deg, #c4541a88, transparent);
        }

        /* ── Title ── */
        .pricing-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #2a1a0e;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .pricing-title em {
          font-style: italic;
          color: #e8521a;
          position: relative;
        }
        /* underline squiggle */
        .pricing-title em::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 3px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8'%3E%3Cpath d='M0 4 Q12.5 0 25 4 Q37.5 8 50 4 Q62.5 0 75 4 Q87.5 8 100 4' stroke='%23e8521a' stroke-width='2' fill='none' opacity='0.5'/%3E%3C/svg%3E")
            repeat-x center;
          background-size: 60px 6px;
        }
        .pricing-sub {
          color: #7a5c3d;
          max-width: 480px;
          margin: 0 auto;
          font-size: 0.92rem;
          line-height: 1.7;
          font-weight: 400;
        }

        /* ── Toggle ── */
        .pricing-toggle {
          display: flex;
          align-items: center;
          gap: 14px;
          justify-content: center;
          margin: 48px 0 60px;
        }
        .toggle-label {
          font-size: 0.88rem;
          color: #b09070;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
          user-select: none;
        }
        .toggle-label.active {
          color: #2a1a0e;
          font-weight: 600;
        }
        .toggle-pill {
          width: 50px;
          height: 27px;
          background: #e8d8c4;
          border: 1.5px solid #d4b896;
          border-radius: 100px;
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 3px;
          transition:
            background 0.25s,
            border-color 0.25s;
        }
        .toggle-pill.on {
          background: #e8521a;
          border-color: #e8521a;
        }
        .toggle-dot {
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: white;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 1px 4px rgba(100, 50, 0, 0.2);
        }
        .toggle-pill.on .toggle-dot {
          transform: translateX(23px);
        }
        .save-badge {
          background: rgba(232, 82, 26, 0.1);
          border: 1px solid rgba(232, 82, 26, 0.25);
          color: #c4541a;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
          letter-spacing: 0.06em;
        }

        /* ── Grid ── */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1040px;
          margin: 0 auto;
          align-items: start;
        }

        /* ── Plan card ── */
        .plan {
          border-radius: 22px;
          padding: 38px 32px 36px;
          border: 1.5px solid;
          position: relative;
          overflow: hidden;
          text-align: left;
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s;
        }

        /* Starter */
        .plan.free {
          border-color: #e2d4c0;
          background: #faf8f4;
          box-shadow: 0 2px 12px rgba(120, 70, 20, 0.06);
        }
        .plan.free:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(120, 70, 20, 0.1);
        }

        /* Pro / featured */
        .plan.featured {
          border-color: #e8521a;
          background: #fff8f4;
          transform: scale(1.035) translateY(-10px);
          box-shadow:
            0 8px 24px rgba(232, 82, 26, 0.14),
            0 28px 56px rgba(232, 82, 26, 0.08);
        }
        .plan.featured:hover {
          transform: scale(1.035) translateY(-15px);
          box-shadow:
            0 16px 40px rgba(232, 82, 26, 0.2),
            0 40px 80px rgba(232, 82, 26, 0.12);
        }
        /* Warm top glow inside featured */
        .plan.featured::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 180px;
          background: radial-gradient(
            ellipse 80% 60% at 50% 0%,
            rgba(232, 82, 26, 0.1) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }
        /* top accent bar */
        .plan.featured::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #e8521a 40%,
            rgba(232, 82, 26, 0.3) 100%
          );
        }

        /* Team */
        .plan.team {
          border-color: #e2d4c0;
          background: #faf8f4;
          box-shadow: 0 2px 12px rgba(120, 70, 20, 0.06);
        }
        .plan.team:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(120, 70, 20, 0.1);
        }

        /* ── Card SVG watermark ── */
        .card-watermark {
          position: absolute;
          bottom: -20px;
          right: -20px;
          opacity: 0.045;
          pointer-events: none;
          z-index: 0;
        }
        .plan.featured .card-watermark {
          opacity: 0.07;
        }

        /* ── Badge ── */
        .plan-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #e8521a;
          color: white;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          z-index: 2;
          box-shadow: 0 4px 14px rgba(232, 82, 26, 0.3);
        }

        /* ── Plan name ── */
        .plan-name {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b09070;
          margin-bottom: 22px;
          position: relative;
          z-index: 1;
        }
        .plan.featured .plan-name {
          color: #c4541a;
        }

        /* ── Price ── */
        .plan-price-row {
          display: flex;
          align-items: flex-start;
          gap: 2px;
          margin-bottom: 4px;
          position: relative;
          z-index: 1;
        }
        .plan-currency {
          font-family: "Playfair Display", serif;
          font-size: 1.4rem;
          color: #7a5c3d;
          padding-top: 10px;
        }
        .plan-price {
          font-family: "Playfair Display", serif;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -0.03em;
          color: #2a1a0e;
        }
        .plan-period {
          font-size: 0.8rem;
          color: #b09070;
          margin-bottom: 24px;
          line-height: 1.5;
          position: relative;
          z-index: 1;
        }
        .plan-desc {
          font-size: 0.85rem;
          line-height: 1.65;
          color: #7a5c3d;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        /* ── Divider ── */
        .plan-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #d4b89660,
            transparent
          );
          margin: 0 0 24px;
          position: relative;
          z-index: 1;
        }
        .plan.featured .plan-divider {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(232, 82, 26, 0.25),
            transparent
          );
        }

        /* ── Features ── */
        .plan-features {
          list-style: none;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          position: relative;
          z-index: 1;
        }
        .plan-features li {
          font-size: 0.86rem;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.45;
          color: #4a3020;
        }
        .feat-check {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          font-size: 0.6rem;
          font-weight: 900;
        }
        .plan.free .feat-check,
        .plan.team .feat-check {
          background: #f0e8dc;
          color: #b09070;
        }
        .plan.featured .feat-check {
          background: rgba(232, 82, 26, 0.12);
          color: #e8521a;
        }

        /* ── CTA ── */
        .plan-cta {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: 1.5px solid;
          font-family: "DM Sans", sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s;
          text-align: center;
          text-decoration: none;
          display: block;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 1;
        }
        .plan.free .plan-cta,
        .plan.team .plan-cta {
          border-color: #d4b896;
          color: #4a3020;
          background: transparent;
        }
        .plan.free .plan-cta:hover,
        .plan.team .plan-cta:hover {
          border-color: #c4541a;
          color: #c4541a;
          background: rgba(232, 82, 26, 0.04);
        }
        .plan.featured .plan-cta {
          border-color: #e8521a;
          color: white;
          background: #e8521a;
          box-shadow: 0 6px 20px rgba(232, 82, 26, 0.25);
        }
        .plan.featured .plan-cta:hover {
          background: #d4461a;
          box-shadow: 0 10px 32px rgba(232, 82, 26, 0.38);
          transform: translateY(-1px);
        }

        /* ── Footer note ── */
        .pricing-note {
          text-align: center;
          color: #b09070;
          font-size: 0.8rem;
          margin-top: 36px;
          position: relative;
          z-index: 2;
          letter-spacing: 0.01em;
        }

        /* ── Decorative leaf / petal row above note ── */
        .pricing-deco {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 40px;
          margin-bottom: 12px;
          opacity: 0.35;
        }
        .pricing-deco-line {
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c4541a);
        }
        .pricing-deco-line.right {
          background: linear-gradient(90deg, #c4541a, transparent);
        }

        @media (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .plan.featured {
            transform: none;
          }
          .plan.featured:hover {
            transform: translateY(-5px);
          }
          .corner-ornament {
            display: none;
          }
        }
      `}</style>

      {/* ── SVG background: hatched + dot grid + warm rings ── */}
      <svg
        className="pricing-bg"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* fine cross-hatch */}
          <pattern
            id="hatch-v"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="16"
              y1="0"
              x2="16"
              y2="32"
              stroke="rgba(180,120,60,0.07)"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="hatch-h"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="16"
              x2="32"
              y2="16"
              stroke="rgba(180,120,60,0.05)"
              strokeWidth="1"
            />
          </pattern>
          {/* warm dot grid */}
          <pattern
            id="warm-dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1.2" fill="rgba(196,84,26,0.13)" />
          </pattern>
          {/* vignette mask — lighter at center, dots fade toward edges */}
          <radialGradient id="dot-fade" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="60%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>
          <mask id="dot-mask">
            <rect width="100%" height="100%" fill="url(#dot-fade)" />
          </mask>
          {/* diagonal linen texture */}
          <pattern
            id="linen"
            x="0"
            y="0"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="rgba(160,100,40,0.045)"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>

        {/* linen base */}
        <rect width="100%" height="100%" fill="url(#linen)" />
        {/* grid overlay */}
        <rect width="100%" height="100%" fill="url(#hatch-v)" />
        <rect width="100%" height="100%" fill="url(#hatch-h)" />
        {/* warm dots, masked */}
        <rect
          width="100%"
          height="100%"
          fill="url(#warm-dots)"
          mask="url(#dot-mask)"
        />

        {/* large concentric rings centered top */}
        <circle
          cx="50%"
          cy="0"
          r="380"
          fill="none"
          stroke="rgba(196,84,26,0.07)"
          strokeWidth="1"
        />
        <circle
          cx="50%"
          cy="0"
          r="540"
          fill="none"
          stroke="rgba(196,84,26,0.05)"
          strokeWidth="1"
        />
        <circle
          cx="50%"
          cy="0"
          r="700"
          fill="none"
          stroke="rgba(196,84,26,0.03)"
          strokeWidth="1"
        />

        {/* bottom-right arc cluster */}
        <circle
          cx="105%"
          cy="100%"
          r="280"
          fill="none"
          stroke="rgba(180,120,40,0.07)"
          strokeWidth="1"
        />
        <circle
          cx="105%"
          cy="100%"
          r="400"
          fill="none"
          stroke="rgba(180,120,40,0.04)"
          strokeWidth="1"
        />

        {/* diagonal golden sweep */}
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="rgba(196,84,26,0.04)"
          strokeWidth="1"
        />
        <line
          x1="100%"
          y1="0"
          x2="0"
          y2="100%"
          stroke="rgba(196,84,26,0.03)"
          strokeWidth="1"
        />
      </svg>

      {/* Corner ornaments */}
      {["tl", "tr", "bl", "br"].map((pos) => (
        <svg
          key={pos}
          className={`corner-ornament ${pos}`}
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 4 L4 32 M4 4 L32 4"
            stroke="#c4541a"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 4 Q 36 4 36 36"
            stroke="#c4541a"
            strokeWidth="0.8"
            fill="none"
            opacity="0.5"
          />
          <circle cx="4" cy="4" r="2.5" fill="#c4541a" opacity="0.6" />
          <circle cx="18" cy="18" r="1.2" fill="#c4541a" opacity="0.3" />
        </svg>
      ))}

      <div className="pricing-fade-top" aria-hidden="true" />
      <div className="pricing-fade-bottom" aria-hidden="true" />
      <div className="glow-top" aria-hidden="true" />
      <div className="glow-br" aria-hidden="true" />
      <div className="glow-bl" aria-hidden="true" />

      <div className="pricing-inner">
        {/* Header */}
        <p className="pricing-eyebrow">
          <span className="eyebrow-ornament" />
          Simple pricing
          <span className="eyebrow-ornament right" />
        </p>
        <h2 className="pricing-title">
          Less than one <em>bad hire's</em> first day.
        </h2>
        <p className="pricing-sub">
          One consistent LinkedIn presence generates more pipeline than an
          entire outbound team. This is the cheapest hire you'll ever make.
        </p>

        {/* Toggle */}
        <div className="pricing-toggle">
          <span
            className={`toggle-label${!annual ? " active" : ""}`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </span>
          <div
            className={`toggle-pill${annual ? " on" : ""}`}
            onClick={() => setAnnual((a) => !a)}
          >
            <div className="toggle-dot" />
          </div>
          <span
            className={`toggle-label${annual ? " active" : ""}`}
            onClick={() => setAnnual(true)}
          >
            Annual
          </span>
          <span className="save-badge">Save 40%</span>
        </div>

        {/* Cards */}
        <div className="pricing-grid">
          {/* ─ Starter ─ */}
          <div className="plan free">
            {/* card watermark */}
            <svg
              className="card-watermark"
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
            >
              <circle
                cx="70"
                cy="70"
                r="60"
                stroke="#c4541a"
                strokeWidth="1.5"
              />
              <circle cx="70" cy="70" r="40" stroke="#c4541a" strokeWidth="1" />
              <circle
                cx="70"
                cy="70"
                r="20"
                stroke="#c4541a"
                strokeWidth="0.8"
              />
              <line
                x1="10"
                y1="70"
                x2="130"
                y2="70"
                stroke="#c4541a"
                strokeWidth="0.8"
              />
              <line
                x1="70"
                y1="10"
                x2="70"
                y2="130"
                stroke="#c4541a"
                strokeWidth="0.8"
              />
            </svg>
            <div className="plan-name">Starter</div>
            <div className="plan-price-row">
              <span className="plan-price">Free</span>
            </div>
            <div className="plan-period">forever — no card needed</div>
            <div className="plan-divider" />
            <p className="plan-desc">
              For curious founders who want to test the voice magic before
              committing.
            </p>
            <ul className="plan-features">
              {[
                "5 posts per month",
                "Basic voice analysis (last 10 posts)",
                "3 content formats",
                "LinkedIn connect",
              ].map((f, i) => (
                <li key={i}>
                  <span className="feat-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#" className="plan-cta">
              Get started free
            </a>
          </div>

          {/* ─ Pro ─ */}
          <div className="plan featured">
            {/* card watermark */}
            <svg
              className="card-watermark"
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
            >
              <path
                d="M80 10 L150 150 L10 150 Z"
                stroke="#e8521a"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M80 40 L130 140 L30 140 Z"
                stroke="#e8521a"
                strokeWidth="1"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="30"
                stroke="#e8521a"
                strokeWidth="0.8"
              />
            </svg>
            <div className="plan-badge">Most popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price-row">
              <span className="plan-currency">$</span>
              <span className="plan-price">{annual ? "29" : "49"}</span>
            </div>
            <div className="plan-period">
              /month · {annual ? "billed annually" : "billed monthly"}
            </div>
            <div className="plan-divider" />
            <p className="plan-desc">
              For founders & executives who need to show up daily without
              thinking about it.
            </p>
            <ul className="plan-features">
              {[
                "Unlimited posts",
                "Deep voice fingerprint (50+ posts)",
                "All 12 content formats",
                "Auto-learns from your edits",
                "Engagement analytics",
                "1-click schedule & post",
                "Priority support",
              ].map((f, i) => (
                <li key={i}>
                  <span className="feat-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#" className="plan-cta">
              Start 7-day free trial →
            </a>
          </div>

          {/* ─ Team ─ */}
          <div className="plan team">
            {/* card watermark */}
            <svg
              className="card-watermark"
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
            >
              <rect
                x="15"
                y="15"
                width="110"
                height="110"
                rx="12"
                stroke="#c4541a"
                strokeWidth="1.5"
              />
              <rect
                x="35"
                y="35"
                width="70"
                height="70"
                rx="8"
                stroke="#c4541a"
                strokeWidth="1"
              />
              <rect
                x="55"
                y="55"
                width="30"
                height="30"
                rx="4"
                stroke="#c4541a"
                strokeWidth="0.8"
              />
            </svg>
            <div className="plan-name">Agency / Team</div>
            <div className="plan-price-row">
              <span className="plan-currency">$</span>
              <span className="plan-price">{annual ? "79" : "99"}</span>
            </div>
            <div className="plan-period">/month · up to 10 seats</div>
            <div className="plan-divider" />
            <p className="plan-desc">
              For sales teams and agencies managing multiple executives' voices.
            </p>
            <ul className="plan-features">
              {[
                "Everything in Pro × 10 seats",
                "Separate voice profiles per user",
                "Team content calendar",
                "Client approval workflows",
                "White-label option available",
                "Dedicated onboarding call",
              ].map((f, i) => (
                <li key={i}>
                  <span className="feat-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#" className="plan-cta">
              Talk to us
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pricing-deco">
          <span className="pricing-deco-line" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2 C10 2 14 7 14 10 C14 13 12 16 10 18 C8 16 6 13 6 10 C6 7 10 2 10 2Z"
              fill="#c4541a"
              opacity="0.6"
            />
            <circle cx="10" cy="10" r="2" fill="#c4541a" />
          </svg>
          <span className="pricing-deco-line right" />
        </div>
        <p className="pricing-note">
          💳 No credit card for free trial &nbsp;·&nbsp; Cancel anytime
          &nbsp;·&nbsp; 14-day money-back guarantee
        </p>
      </div>
    </section>
  );
};
