import crypto from "crypto";

const TWITTER_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
const TWITTER_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const TWITTER_USER_URL = "https://api.twitter.com/2/users/me";

export function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return { verifier, challenge };
}

export function getAuthUrl({ state, codeChallenge, redirectUri }) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.TWITTER_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "tweet.read tweet.write users.read offline.access media.write",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${TWITTER_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCode({ code, codeVerifier, redirectUri }) {
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twitter token exchange failed: ${err}`);
  }
  return res.json();
}

export async function getUserProfile(accessToken) {
  const res = await fetch(`${TWITTER_USER_URL}?user.fields=profile_image_url`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Twitter profile");
  }

  const { data } = await res.json();
  return {
    id: data.id,
    handle: `@${data.username}`,
    displayName: data.name,
    avatarUrl: data.profile_image_url,
  };
}

export async function refreshToken(currentRefreshToken) {
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: currentRefreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error("Twitter token refresh failed");
  }
  return res.json();
}

/**
 * Uploads a media file (image/video) to Twitter v1.1 API.
 */
async function uploadMediaToTwitter(accessToken, mediaUrl) {
  try {
    // 1. Fetch the media from ImageKit
    const mediaRes = await fetch(mediaUrl);
    if (!mediaRes.ok) throw new Error("Failed to fetch media for upload");
    const blob = await mediaRes.blob();

    // 2. Prepare multipart form data
    const formData = new FormData();
    formData.append("media", blob);

    // 3. Upload to Twitter v1.1 (supports OAuth 2.0 User Token with media.write scope)
    const res = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Twitter media upload failed: ${err}`);
    }

    const data = await res.json();
    return data.media_id_string;
  } catch (error) {
    console.error("Twitter media upload error:", error);
    throw error;
  }
}

/**
 * Publishes a tweet to Twitter v2 API.
 */
export async function publishPost({ accessToken, content, media }) {
  const body = { text: content };

  // Handle Media Attachments
  if (media && media.length > 0) {
    const mediaIds = [];
    const mediaItems = Array.isArray(media) ? media.slice(0, 4) : [media]; // Twitter limit: 4 images
    
    for (const m of mediaItems) {
      const url = typeof m === "string" ? m : m.url;
      if (url) {
        const mediaId = await uploadMediaToTwitter(accessToken, url);
        mediaIds.push(mediaId);
      }
    }

    if (mediaIds.length > 0) {
      body.media = { media_ids: mediaIds };
    }
  }

  const res = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Twitter publish error details:", err);
    throw new Error(`Twitter publishing failed (Status ${res.status}): ${err}`);
  }

  const { data } = await res.json();
  return { id: data.id };
}
