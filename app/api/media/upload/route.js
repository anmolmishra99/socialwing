import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit/client";
import { saveMediaAsset } from "@/lib/firestore/media";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Missing file or user ID" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: `/users/${userId}/media`,
    });

    const mediaId = await saveMediaAsset(userId, {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      type: file.type,
      size: file.size,
    });

    return NextResponse.json({
      success: true,
      mediaId,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload to ImageKit" },
      { status: 500 }
    );
  }
}
