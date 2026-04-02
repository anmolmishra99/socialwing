import { NextResponse } from "next/server";
import { createPost, getPosts } from "@/lib/firestore/posts";
import { inngest } from "@/lib/inngest/client";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const posts = await getPosts(userId, status);
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, ...postData } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const postId = await createPost(userId, postData);

    // Trigger Inngest event (handles both immediate and scheduled distribution)
    console.log("Triggering Inngest for postId:", postId);
    await inngest.send({
      name: "post.scheduled",
      data: {
        postId,
        userId,
        scheduledAt: postData.scheduledAt,
      },
    });
    console.log("Inngest event sent successfully!");

    return NextResponse.json({ success: true, postId });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
