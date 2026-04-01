import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "@/app/context/AuthContext";
import StyledJsxRegistry from "@/components/landing-page-2/registry";

export const metadata = {
  metadataBase: new URL("https://www.socialwing.app"),

  title: {
    default: "Post to all your social accounts from one dashboard | SocialWing",
    template: "%s | SocialWing",
  },

  description:
    "Stop posting content that sounds like AI. SocialWing learns your voice from past posts — so every LinkedIn update is authentically you. Try it free →",

  keywords: [
    "LinkedIn post generator that sounds like me",
    "AI LinkedIn ghostwriter",
    "LinkedIn post in my writing style",
    "AI LinkedIn post generator",
    "LinkedIn personal brand automation",
    "LinkedIn content for founders",
    "LinkedIn ghostwriting tool for executives",
    "consistent LinkedIn presence without writing",
    "LinkedIn post generator for sales teams",
    "AI content that sounds human",
    "SocialWing",
  ],

  authors: [{ name: "SocialWing" }],
  creator: "SocialWing",
  publisher: "SocialWing",

  alternates: {
    canonical: "https://www.socialwing.app",
  },

  openGraph: {
    title: "Post to all your social accounts from one dashboard | SocialWing",
    description:
      "SocialWing reads your old posts, learns how you write, then drafts LinkedIn content in your voice — not a generic AI voice. Used by founders, executives, and sales teams.",
    url: "https://www.socialwing.app",
    siteName: "SocialWing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SocialWing — LinkedIn post generator that sounds like you wrote it",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Post to all your social accounts from one dashboard",
    description:
      "Stop posting content that sounds like AI. draftfor.me learns your voice from past posts — so every LinkedIn update is authentically you. Try it free →",
    creator: "@anmol_biz",
    site: "@anmol_biz",
    images: ["/opengraph-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SocialWing",
    alternateName: "Social Wing",
    description:
      "AI LinkedIn post generator that analyzes your past posts to learn your writing style, vocabulary, and tone — then drafts content that sounds like you, not like AI.",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Content Writing",
    operatingSystem: "Web Browser",
    url: "https://www.socialwing.app",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to try — no credit card required",
    },
    featureList: [
      "Learns your unique writing style from past LinkedIn posts",
      "Generates LinkedIn posts that sound authentically human",
      "Captures your vocabulary, rhythm, humor, and quirks",
      "Built for founders, executives, sales teams, and agencies",
      "Daily LinkedIn content without hours of writing",
    ],
    audience: {
      "@type": "Audience",
      audienceType:
        "Founders, Executives, Sales Teams, Marketing Agencies, Personal Brand Builders",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "85",
    },
    publisher: {
      "@type": "Organization",
      name: "SocialWing",
      url: "https://www.socialwing.app",
      logo: {
        "@type": "ImageObject",
        url: "https://www.socialwing.app/logo.png",
      },
      sameAs: ["https://www.linkedin.com/company/socialwing"],
    },
  };

  // FAQ schema targeting informational keywords
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does SocialWing learn my LinkedIn writing style?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SocialWing analyzes your previous LinkedIn posts to identify your vocabulary, sentence rhythm, tone, humor, and writing quirks. It uses this data to generate new posts that sound like you wrote them — not a generic AI.",
        },
      },
      {
        "@type": "Question",
        name: "Is SocialWing different from ChatGPT for LinkedIn posts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. ChatGPT generates generic content with no knowledge of how you write. SocialWing specifically learns your personal writing style from your past posts, so the output sounds authentically like you rather than obviously AI-written.",
        },
      },
      {
        "@type": "Question",
        name: "Who is SocialWing for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SocialWing is built for founders, executives, sales teams, and agencies who need to maintain a consistent daily LinkedIn presence without spending hours writing. It's especially useful for anyone whose personal brand matters but whose calendar doesn't have room for content creation.",
        },
      },
      {
        "@type": "Question",
        name: "Can draftfor.me write LinkedIn posts in my style?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That's exactly what it does. Feed it your old LinkedIn posts and it learns how you phrase things, what topics you focus on, and how long your posts tend to run. New drafts match your style rather than sounding like a template.",
        },
      },
    ],
  };

  return (
    <html lang="en" className="h-full bg-background">
      <body className="h-full bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <AuthContextProvider>
          <StyledJsxRegistry>{children}</StyledJsxRegistry>
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
