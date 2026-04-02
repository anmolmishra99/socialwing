const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USER_URL = "https://api.linkedin.com/v2/userinfo";

// Requires two LinkedIn Developer Portal products:
//   "Sign In with LinkedIn using OpenID Connect" → openid, profile, email
//   "Share on LinkedIn" → w_member_social
const LINKEDIN_SCOPES = "openid profile email w_member_social";

export function getAuthUrl({ state, redirectUri }) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: LINKEDIN_SCOPES,
    state,
  });
  // LinkedIn requires spaces encoded as %20, not +
  return `${LINKEDIN_AUTH_URL}?${params.toString().replace(/\+/g, "%20")}`;
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
    const errText = await res.text();
    throw new Error(`Failed to fetch LinkedIn profile (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return {
    handle: data.name || data.email,
    displayName: data.name,
    avatarUrl: data.picture || "",
    id: data.sub,
  };
}

async function uploadMediaToLinkedIn(accessToken, authorId, mediaUrl) {
  const isVideo = /\.(mp4|mov|webm)$/i.test(mediaUrl);
  const recipe = isVideo
    ? "urn:li:digitalmediaRecipe:feedshare-video"
    : "urn:li:digitalmediaRecipe:feedshare-image";
  const authorUrn = `urn:li:person:${authorId}`;

  const registerRes = await fetch(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: [recipe],
          owner: authorUrn,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    }
  );

  if (!registerRes.ok) {
    const err = await registerRes.text();
    throw new Error(`LinkedIn register upload failed (${registerRes.status}): ${err}`);
  }

  const registerData = await registerRes.json();
  const uploadMechanism =
    registerData.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ];
  const uploadUrl = uploadMechanism.uploadUrl;
  const assetUrn = registerData.value.asset;

  const mediaFetchRes = await fetch(mediaUrl);
  if (!mediaFetchRes.ok) {
    throw new Error(`Failed to fetch media for upload: ${mediaUrl}`);
  }
  const mediaBuffer = await mediaFetchRes.arrayBuffer();

  // LinkedIn expects PUT for binary uploads
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
    },
    body: mediaBuffer,
  });

  if (!uploadRes.ok && uploadRes.status !== 201) {
    const err = await uploadRes.text();
    throw new Error(`LinkedIn binary upload failed (${uploadRes.status}): ${err}`);
  }

  return { assetUrn, isVideo };
}

export async function publishPost({ accessToken, content, media, authorId }) {
  const author = `urn:li:person:${authorId}`;

  const body = {
    author,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: content || "" },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  if (media && media.length > 0) {
    const mediaItems = Array.isArray(media) ? media : [media];
    const uploadedAssets = [];
    let hasVideo = false;

    for (const m of mediaItems) {
      const url = typeof m === "string" ? m : m?.url;
      if (!url) continue;
      const result = await uploadMediaToLinkedIn(accessToken, authorId, url);
      uploadedAssets.push(result);
      if (result.isVideo) hasVideo = true;
    }

    if (uploadedAssets.length > 0) {
      const shareContent = body.specificContent["com.linkedin.ugc.ShareContent"];
      shareContent.shareMediaCategory = hasVideo ? "VIDEO" : "IMAGE";
      shareContent.media = uploadedAssets.map((asset) => ({
        status: "READY",
        media: asset.assetUrn,
      }));
    }
  }

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn publishing failed (${res.status}): ${err}`);
  }

  // LinkedIn returns the post ID in the X-RestLi-Id header
  const postId = res.headers.get("x-restli-id");

  // Fallback: try parsing the body if the header is absent
  if (postId) {
    return { id: postId };
  }

  try {
    const data = await res.json();
    return { id: data.id };
  } catch {
    return { id: "unknown" };
  }
}

export async function refreshToken() {
  throw new Error("LinkedIn does not support token refresh. User must re-authorize.");
}
