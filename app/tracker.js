"use client";
import { database } from "@/app/firebase";
import {
  ref,
  get,
  set,
  update,
  onValue,
  child,
  getDatabase,
} from "firebase/database";
import { serverTimestamp } from "firebase/firestore";

export async function getIPAddress() {
  const response = await fetch("https://ipapi.co/json/");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  // console.log(data);
  return data;
}

export async function trackVisit(id, to) {
  try {
    const ip = await getIPAddress();
    set(ref(database, `${to}/` + id + "/" + ip.ip.replace(/\./g, "_")), {
      ip: ip.ip,
      city: ip.city,
      country_name: ip.country_name,
      region: ip.region,
      postal: ip.postal,
      latitude: ip.latitude,
      longitude: ip.longitude,
      currency: ip.currency,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
}

export const getFeedbackCount = async (feedbackId, to) => {
  try {
    const db = getDatabase();
    const feedbackRef = ref(db, `${to}/${feedbackId}`);
    const snapshot = await get(child(feedbackRef, "/"));

    if (snapshot.exists()) {
      // Count the total number of feedbacks
      const totalFeedbacks = Object.keys(snapshot.val()).length;

      // console.log("Count", totalFeedbacks);
      if (totalFeedbacks === undefined || totalFeedbacks == null) {
        return 0;
      }

      return totalFeedbacks;
    } else {
      // console.log("No data available");
      return 0;
    }
  } catch (error) {
    console.error("Error retrieving feedback data:", error);
    return null;
  }
};

export async function getFeedbackData(feedbackId, to) {
  try {
    const db = getDatabase();
    const feedbackRef = ref(db, `${to}/${feedbackId}`);
    const snapshot = await get(child(feedbackRef, "/"));

    if (snapshot.exists()) {
      // Count the total number of feedbacks
      const totalFeedbacks = Object.keys(snapshot.val()).length;

      // Extract all the feedback data
      const feedbackData = Object.values(snapshot.val());

      console.log("Count", totalFeedbacks);
      console.log("Data", feedbackData);

      return feedbackData;
    } else {
      // console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving feedback data:", error);
    return null;
  }
}

export async function getAllFeedbackData(feedbackId, to) {
  try {
    const db = getDatabase();
    const feedbackRef = ref(db, `${to}/${feedbackId}`);
    const snapshot = await get(child(feedbackRef, "/"));

    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving feedback data:", error);
    return null;
  }
}
