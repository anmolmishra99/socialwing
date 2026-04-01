const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USER_URL = "https://api.linkedin.com/v2/userinfo";

export function getAuthUrl({ state, redirectUri }) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "openid profile email w_member_social",
    state,
  });
  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCode({ code, redirectUri }) {
  const res = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn token exchange failed: ${err}`);
  }
  return res.json();
}

export async function getUserProfile(accessToken) {
  const res = await fetch(LINKEDIN_USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch LinkedIn profile");
  }

  const data = await res.json();
  return {
    handle: data.name || data.email,
    displayName: data.name,
    avatarUrl: data.picture || "",
  };
}

export async function refreshToken() {
  // LinkedIn OAuth tokens are long-lived (60 days for 3-legged)
  // and do not support refresh_token flow for most app types.
  // Users must re-authorize when the token expires.
  throw new Error("LinkedIn does not support token refresh. User must re-authorize.");
}
