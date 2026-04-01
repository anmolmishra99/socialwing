import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase";

/**
 * Save a connected social account to Firestore.
 * Path: users/{userId}/social_accounts/{platform}
 */
export async function saveConnectedAccount(userId, accountData) {
  const docRef = doc(db, "users", userId, "social_accounts", accountData.platform);
  await setDoc(docRef, {
    platform: accountData.platform,
    handle: accountData.handle || "",
    displayName: accountData.displayName || "",
    avatarUrl: accountData.avatarUrl || "",
    accessToken: accountData.accessToken || "",
    refreshToken: accountData.refreshToken || "",
    expiresAt: accountData.expiresAt || 0,
    connectedAt: serverTimestamp(),
  });
}

/**
 * Get all connected social accounts for a user.
 */
export async function getConnectedAccounts(userId) {
  const colRef = collection(db, "users", userId, "social_accounts");
  const snapshot = await getDocs(colRef);
  const accounts = [];
  snapshot.forEach((doc) => {
    accounts.push({ id: doc.id, ...doc.data() });
  });
  return accounts;
}

/**
 * Delete (disconnect) a social account.
 */
export async function deleteConnectedAccount(userId, platform) {
  const docRef = doc(db, "users", userId, "social_accounts", platform);
  await deleteDoc(docRef);
}
