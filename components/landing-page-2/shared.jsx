"use client";

import React from "react";

export const SharedStyles = ({ instrumentSerif, syne, dmSans }) => (
  <style jsx global>{`
    :root {
      --ink: #0a0a0a;
      --paper: #f5f1eb;
      --cream: #faf8f4;
      --blue: #0a66c2;
      --blue-light: #e8f0fb;
      --accent: #e8521a;
      --accent-soft: #fdf0eb;
      --gold: #c9a84c;
      --muted: #6b6560;
      --border: #e2ddd6;
      --card: #ffffff;
      --font-instrument: ${instrumentSerif.variable};
      --font-syne: ${syne.variable};
      --font-dm-sans: ${dmSans.variable};
    }

    html {
      color-scheme: light !important;
      background-color: var(--cream) !important;
    }

    body {
      background-color: var(--cream) !important;
      color: var(--ink) !important;
      overflow-x: hidden;
      font-family: var(--font-dm-sans);
    }

    .container { max-width: 1100px; margin: 0 auto; }
    .container-narrow { max-width: 780px; margin: 0 auto; }

    .section-tag {
      font-family: var(--font-syne);
      font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--muted); margin-bottom: 16px;
    }

    .section-tag.accent { color: var(--accent); }

    .section-title {
      font-family: var(--font-instrument);
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 1.15; letter-spacing: -0.025em;
      margin-bottom: 20px;
    }

    .section-title em { font-style: italic; color: var(--accent); }

    .reveal {
      opacity: 0; transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `}</style>
);
