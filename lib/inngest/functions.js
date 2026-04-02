import { inngest } from "./client";
import { db } from "@/app/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";
import { getPlatform } from "@/lib/platforms";

export const publishPostScheduled = inngest.createFunction(
  { id: "publish-post", triggers: { event: "post.scheduled" } },
  async ({ event, step }) => {
    const { postId, userId, scheduledAt } = event.data;

    // Wait until the scheduled time if it's in the future
    if (scheduledAt) {
      const scheduleTime = new Date(scheduledAt).getTime();
      const now = Date.now();
      // Only sleep if the scheduled time is more than 1 second in the future
      if (scheduleTime > now + 1000) {
        await step.sleepUntil("wait-for-schedule", scheduledAt);
      }
    }

    // Fetch post and targets
    const postData = await step.run("fetch-post", async () => {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) throw new Error("Post not found");
      return { id: postSnap.id, ...postSnap.data() };
    });

    const targets = await step.run("fetch-targets", async () => {
      const q = query(collection(db, "post_targets"), where("postId", "==", postId));
      const snap = await getDocs(q);
      const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // If no targets found, it might be an indexing delay. Throwing here will trigger an Inngest retry.
      if (results.length === 0) {
        throw new Error(`No targets found for postId ${postId}. Waiting for Firestore indexing...`);
      }
      
      return results;
    });

    // Attempt to publish to each target
    const results = [];
    for (const target of targets) {
      const result = await step.run(`publish-to-${target.platform}`, async () => {
        try {
          // Get the connected account for this user+platform
          const accountRef = doc(db, "users", userId, "social_accounts", target.platform);
          const accountSnap = await getDoc(accountRef);
          
          if (!accountSnap.exists()) throw new Error(`No connected account for ${target.platform}`);
          let account = accountSnap.data();

          const platformConfig = getPlatform(target.platform);
          if (!platformConfig || !platformConfig.helpers) throw new Error(`Unsupported platform: ${target.platform}`);

          // --- TOKEN REFRESH LOGIC ---
          const bufferTime = 5 * 60 * 1000; // 5 minute buffer
          const isExpired = account.expiresAt > 0 && (Date.now() + bufferTime) > account.expiresAt;
          
          if (isExpired && account.refreshToken && platformConfig.helpers.refreshToken) {
            console.log(`Refreshing token for ${target.platform}...`);
            const tokenData = await platformConfig.helpers.refreshToken(account.refreshToken);
            
            // Update Firestore with new tokens
            const newExpiresAt = tokenData.expires_in > 0 ? Date.now() + tokenData.expires_in * 1000 : 0;
            const updatedData = {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || account.refreshToken,
                expiresAt: newExpiresAt,
                updatedAt: serverTimestamp(),
            };
            
            await updateDoc(accountRef, updatedData);
            
            // Update local account object for immediate use in publish
            account = { ...account, ...updatedData };
          }

          // --- PUBLISH STEP ---
          const response = await platformConfig.helpers.publishPost({
            accessToken: account.accessToken,
            content: postData.content,
            media: postData.media,
            authorId: account.platformUserId, // Vital for LinkedIn
          });

          // Update target status in Firestore
          const targetRef = doc(db, "post_targets", target.id);
          await updateDoc(targetRef, {
            status: "published",
            remotePostId: response.id || response.remoteId,
            publishedAt: serverTimestamp(),
          });

          return { success: true, platform: target.platform };
        } catch (error) {
          console.error(`Publish error for ${target.platform}:`, error);
          const targetRef = doc(db, "post_targets", target.id);
          await updateDoc(targetRef, {
            status: "failed",
            error: error.message,
          });
          return { success: false, platform: target.platform, error: error.message };
        }
      });
      results.push(result);
    }

    // Finalize post status
    await step.run("finalize-post", async () => {
      if (results.length === 0) {
        throw new Error("Cannot finalize post: No platform distribution results available.");
      }
      const postRef = doc(db, "posts", postId);
      const overallStatus = results.every(r => r.success) ? "published" : "failed";
      await updateDoc(postRef, {
        status: overallStatus,
        updatedAt: serverTimestamp(),
      });
      return { overallStatus };
    });

    return { postId, results };
  }
);
