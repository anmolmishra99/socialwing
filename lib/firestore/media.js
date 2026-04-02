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
} from "firebase/firestore";

/**
 * Saves a new media asset reference to Firestore.
 */
export async function saveMediaAsset(userId, mediaData) {
  if (!userId) throw new Error("User ID is required");

  const { url, fileId, name, type, size } = mediaData;

  const mediaRef = await addDoc(collection(db, "media_assets"), {
    userId,
    url,
    fileId,
    name,
    type,
    size,
    createdAt: serverTimestamp(),
  });

  return mediaRef.id;
}

/**
 * Fetches all media assets for a user.
 */
export async function getMediaAssets(userId) {
  if (!userId) throw new Error("User ID is required");

  const q = query(
    collection(db, "media_assets"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Deletes a media asset reference.
 */
export async function deleteMediaAsset(assetId) {
  const assetRef = doc(db, "media_assets", assetId);
  await deleteDoc(assetRef);
}
