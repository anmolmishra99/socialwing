import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

const baseUrl = "https://matrachaya.co.in";

export default async function sitemap() {
  // Fetch blog posts
  let blogPosts = [];
  try {
    const querySnapshot = await getDocs(collection(db, "adminblog"));
    blogPosts = querySnapshot.docs.map((doc) => ({
      url: `${baseUrl}/blog/${doc.id}`,
      lastModified: new Date(
        doc.data().createdAt?.toDate() || new Date()
      ).toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  // Core pages
  const corePages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
   
    {
      url: `${baseUrl}/roi-calculator`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...corePages, ...blogPosts];
}
