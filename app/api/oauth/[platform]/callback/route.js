import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlatform } from "@/lib/platforms";

export async function GET(request, { params }) {
  const { platform } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/dashboard`;

  // Handle user denial
  if (error) {
    return NextResponse.redirect(
      `${dashboardUrl}?oauth_error=${encodeURIComponent(error)}&platform=${platform}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${dashboardUrl}?oauth_error=missing_params&platform=${platform}`
    );
  }

  // Decode state
  let stateData;
  try {
    stateData = JSON.parse(Buffer.from(state, "base64url").toString());
  } catch {
    return NextResponse.redirect(
      `${dashboardUrl}?oauth_error=invalid_state&platform=${platform}`
    );
  }

  const { userId } = stateData;
  const platformConfig = getPlatform(platform);

  if (!platformConfig || !platformConfig.helpers) {
    return NextResponse.redirect(
      `${dashboardUrl}?oauth_error=unsupported_platform&platform=${platform}`
    );
  }

  const { helpers, usesPKCE } = platformConfig;
  const redirectUri = `${baseUrl}/api/oauth/${platform}/callback`;

  try {
    // Exchange code for tokens
    let tokenData;
    if (usesPKCE) {
      const cookieStore = await cookies();
      const verifier = cookieStore.get(`oauth_verifier_${platform}`)?.value;
      if (!verifier) {
        return NextResponse.redirect(
          `${dashboardUrl}?oauth_error=missing_verifier&platform=${platform}`
        );
      }
      tokenData = await helpers.exchangeCode({
        code,
        codeVerifier: verifier,
        redirectUri,
      });
      // Clean up verifier cookie
      cookieStore.delete(`oauth_verifier_${platform}`);
    } else {
      tokenData = await helpers.exchangeCode({ code, redirectUri });
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || "";
    const expiresIn = tokenData.expires_in || 0;

    // Fetch user profile from the platform
    const profile = await helpers.getUserProfile(accessToken);

    // Calculate expiry timestamp
    const expiresAt = expiresIn > 0 ? Date.now() + expiresIn * 1000 : 0;

    // Redirect back to dashboard with account data as query params
    // The client-side code will persist this to Firestore
    const accountData = {
      platform,
      handle: profile.handle,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      accessToken,
      refreshToken,
      expiresAt,
    };

    const encodedData = Buffer.from(JSON.stringify(accountData)).toString("base64url");

    return NextResponse.redirect(
      `${dashboardUrl}?oauth_success=true&account_data=${encodedData}&userId=${userId}`
    );
  } catch (err) {
    console.error(`OAuth callback error for ${platform}:`, err);
    return NextResponse.redirect(
      `${dashboardUrl}?oauth_error=${encodeURIComponent(err.message)}&platform=${platform}`
    );
  }
}
