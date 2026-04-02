import { NextResponse } from "next/server";
import { updatePost, deletePost } from "@/lib/firestore/posts";
import { inngest } from "@/lib/inngest/client";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { userId, ...updateData } = await request.json();

    if (!id || !userId) {
      return NextResponse.json({ error: "Post ID and User ID are required" }, { status: 400 });
    }

    await updatePost(id, updateData);

    // If schedule changed, handle Inngest state if necessary
    // In a production app, we'd cancel the old job and schedule a new one
    if (updateData.scheduledAt) {
      await inngest.send({
        name: "post.updated",
        data: {
          postId: id,
          userId,
          scheduledAt: updateData.scheduledAt,
        },
      });
    }

    return NextResponse.json({ success: true, postId: id });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json({ error: "Post ID and User ID are required" }, { status: 400 });
    }

    await deletePost(id);

    // Tell Inngest to cancel any pending publishing jobs
    await inngest.send({
      name: "post.deleted",
      data: {
        postId: id,
        userId,
      },
    });

    return NextResponse.json({ success: true, postId: id });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
