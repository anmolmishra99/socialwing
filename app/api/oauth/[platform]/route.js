import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlatform, isSupported } from "@/lib/platforms";

export async function GET(request, { params }) {
  const { platform } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  if (!isSupported(platform)) {
    return NextResponse.json(
      { error: `Platform "${platform}" is not yet supported. Coming soon!` },
      { status: 400 }
    );
  }

  const platformConfig = getPlatform(platform);
  const { helpers, usesPKCE } = platformConfig;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/oauth/${platform}/callback`;

  // Encode userId in state so we can retrieve it in callback
  const statePayload = JSON.stringify({ userId, platform });
  const state = Buffer.from(statePayload).toString("base64url");

  const cookieStore = await cookies();

  if (usesPKCE) {
    // Twitter uses PKCE
    const { generatePKCE } = helpers;
    const { verifier, challenge } = generatePKCE();

    // Store verifier in an httpOnly cookie for the callback
    cookieStore.set(`oauth_verifier_${platform}`, verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    const authUrl = helpers.getAuthUrl({
      state,
      codeChallenge: challenge,
      redirectUri,
    });

    return NextResponse.redirect(authUrl);
  } else {
    // LinkedIn and others — standard OAuth
    const authUrl = helpers.getAuthUrl({ state, redirectUri });
    return NextResponse.redirect(authUrl);
  }
}
