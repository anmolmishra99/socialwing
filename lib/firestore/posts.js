import { db } from "@/app/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

/**
 * Creates a new post and its associated platform targets.
 */
export async function createPost(userId, postData) {
  if (!userId) throw new Error("User ID is required");

  const { content, media, scheduledAt, platforms } = postData;

  const postRef = await addDoc(collection(db, "posts"), {
    userId,
    content,
    media: media || [],
    status: scheduledAt ? "scheduled" : "draft",
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const batch = writeBatch(db);
  
  platforms.forEach((platform) => {
    const targetRef = doc(collection(db, "post_targets"));
    batch.set(targetRef, {
      postId: postRef.id,
      userId,
      platform,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
  return postRef.id;
}

/**
 * Fecthes all posts for a user with optional status filtering.
 */
export async function getPosts(userId, status = null) {
  if (!userId) throw new Error("User ID is required");

  let q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  if (status) {
    q = query(q, where("status", "==", status));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Updates an existing post.
 */
export async function updatePost(postId, updateData) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a post and its targets.
 */
export async function deletePost(postId) {
  const postRef = doc(db, "posts", postId);
  
  // Delete targets first
  const targetsQuery = query(collection(db, "post_targets"), where("postId", "==", postId));
  const targetsSnapshot = await getDocs(targetsQuery);
  
  const batch = writeBatch(db);
  targetsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  batch.delete(postRef);
  await batch.commit();
}
