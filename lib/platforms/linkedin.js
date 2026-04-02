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
  // LinkedIn is extremely strict about scopes being joined by %20 and will throw an error with '+'
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
    throw new Error("Failed to fetch LinkedIn profile");
  }

  const data = await res.json();
  return {
    handle: data.name || data.email,
    displayName: data.name,
    avatarUrl: data.picture || "",
    id: data.sub // Member URN
  };
}

/**
 * Helper to upload a single media file to LinkedIn
 */
async function uploadMediaToLinkedIn(accessToken, authorId, mediaUrl) {
  // Determine if video or image based on extension
  const isVideo = mediaUrl.match(/\.(mp4|mov|webm)$/i);
  const recipe = isVideo 
    ? "urn:li:digitalmediaRecipe:feedshare-video"
    : "urn:li:digitalmediaRecipe:feedshare-image";

  const authorUrn = `urn:li:person:${authorId}`;

  // 1. Register Upload
  const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: [recipe],
        owner: authorUrn,
        serviceRelationships: [{
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent"
        }]
      }
    })
  });

  if (!registerRes.ok) {
    const err = await registerRes.text();
    throw new Error(`LinkedIn register upload failed: ${err}`);
  }

  const registerData = await registerRes.json();
  const uploadMechanism = registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"];
  const uploadUrl = uploadMechanism.uploadUrl;
  const assetUrn = registerData.value.asset;

  // 2. Fetch binary media from the provided URL
  const mediaFetchRes = await fetch(mediaUrl);
  if (!mediaFetchRes.ok) throw new Error(`Failed to fetch media for upload: ${mediaUrl}`);
  const mediaBuffer = await mediaFetchRes.arrayBuffer();

  // 3. Upload binary to LinkedIn
  const uploadRes = await fetch(uploadUrl, {
    method: "POST", // Sending binary stream
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream"
    },
    body: mediaBuffer
  });

  if (!uploadRes.ok && uploadRes.status !== 201 && uploadRes.status !== 200) {
    const err = await uploadRes.text();
    throw new Error(`LinkedIn binary upload failed: ${err}`);
  }

  return {
    assetUrn,
    isVideo
  };
}

/**
 * Publishes a post to LinkedIn.
 */
export async function publishPost({ accessToken, content, media, authorId }) {
  // LinkedIn requires the author URN (peron:sub)
  const author = `urn:li:person:${authorId}`;
  
  const body = {
    author: author,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: content || ""
        },
        shareMediaCategory: "NONE"
      }
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
  };

  if (media && media.length > 0) {
    const mediaItems = Array.isArray(media) ? media : [media];
    const uploadedAssets = [];
    let hasVideo = false;

    // Upload each media file sequentially
    for (const m of mediaItems) {
      const url = typeof m === "string" ? m : m.url;
      if (url) {
        const { assetUrn, isVideo } = await uploadMediaToLinkedIn(accessToken, authorId, url);
        uploadedAssets.push({ assetUrn, isVideo });
        if (isVideo) hasVideo = true;
      }
    }

    if (uploadedAssets.length > 0) {
      // Set the shareMediaCategory depending on if there is a video 
      body.specificContent["com.linkedin.ugc.ShareContent"].shareMediaCategory = hasVideo ? "VIDEO" : "IMAGE";
      
      const mediaList = uploadedAssets.map(asset => ({
        status: "READY",
        media: asset.assetUrn
      }));

      body.specificContent["com.linkedin.ugc.ShareContent"].media = mediaList;
    }
  }

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn publishing failed: ${err}`);
  }

  const data = await res.json();
  return { id: data.id };
}

export async function refreshToken() {
  // LinkedIn OAuth tokens are long-lived (60 days for 3-legged)
  // and do not support refresh_token flow for most app types.
  // Users must re-authorize when the token expires.
  throw new Error("LinkedIn does not support token refresh. User must re-authorize.");
}
