import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCyvhycjt0Dxs2yOQAtHDqg2wyJ7EFr8KY",
  authDomain: "draftfor-me.firebaseapp.com",
  projectId: "draftfor-me",
  storageBucket: "draftfor-me.firebasestorage.app",
  messagingSenderId: "309269115073",
  appId: "1:309269115073:web:5d2c50fe3e192d4cf26440",
  measurementId: "G-MZJM541K93"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
