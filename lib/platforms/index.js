/**
 * Platform registry — maps platform IDs to their OAuth helper modules.
 * Fully implemented: twitter, linkedin
 * Scaffolded (awaiting API credentials): instagram, youtube, tiktok, facebook, pinterest, discord, slack
 */

import * as twitter from "./twitter";
import * as linkedin from "./linkedin";

const platforms = {
  twitter: {
    helpers: twitter,
    usesPKCE: true,
    displayName: "X / Twitter",
  },
  linkedin: {
    helpers: linkedin,
    usesPKCE: false,
    displayName: "LinkedIn",
  },

  // ── Scaffolded platforms ──────────────────────────────────────
  // These return null helpers. Complete when API credentials are available.

  instagram: {
    helpers: null,
    usesPKCE: false,
    displayName: "Instagram",
  },
  youtube: {
    helpers: null,
    usesPKCE: false,
    displayName: "YouTube",
  },
  tiktok: {
    helpers: null,
    usesPKCE: true,
    displayName: "TikTok",
  },
  facebook: {
    helpers: null,
    usesPKCE: false,
    displayName: "Facebook",
  },
  pinterest: {
    helpers: null,
    usesPKCE: false,
    displayName: "Pinterest",
  },
  discord: {
    helpers: null,
    usesPKCE: false,
    displayName: "Discord",
  },
  slack: {
    helpers: null,
    usesPKCE: false,
    displayName: "Slack",
  },
};

export function getPlatform(id) {
  return platforms[id] || null;
}

export function isSupported(id) {
  const p = platforms[id];
  return p && p.helpers !== null;
}

export const SUPPORTED_PLATFORM_IDS = Object.keys(platforms);
