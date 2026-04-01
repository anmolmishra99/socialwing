import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase";

/**
 * Create or update a user document in Firestore.
 * Path: users/{userId}
 * Only creates if the document doesn't already exist.
 */
export async function createUserDocument(user) {
  if (!user?.uid) return null;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // First time — create the user document
    const userData = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      provider: user.providerData?.[0]?.providerId || "unknown",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      plan: "free",
    };

    await setDoc(userRef, userData);
    return userData;
  } else {
    // Existing user — update last login
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
      // Keep displayName / photoURL in sync with auth
      displayName: user.displayName || userSnap.data().displayName || "",
      photoURL: user.photoURL || userSnap.data().photoURL || "",
    });
    return userSnap.data();
  }
}

/**
 * Get a user document from Firestore.
 */
export async function getUserDocument(userId) {
  if (!userId) return null;
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
}
