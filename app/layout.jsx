import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "@/app/context/AuthContext";
import StyledJsxRegistry from "@/components/landing-page-2/registry";

export const metadata = {
  metadataBase: new URL("https://www.esulabh.in"),
  title: {
    default: "eSulabh | Blockchain-Powered Land Acquisition Management System",
    template: "%s | eSulabh",
  },
  description:
    "Transform government land acquisition with eSulabh - a blockchain-based platform ensuring transparent, immutable, and efficient management of property records, compensation tracking, and compliance for infrastructure projects.",
  keywords: [
    "land acquisition",
    "blockchain land records",
    "government land management",
    "property compensation tracking",
    "transparent land acquisition",
    "digital land records",
    "infrastructure project management",
  ],
  authors: [{ name: "eSulabh Team" }],
  creator: "eSulabh",
  publisher: "eSulabh",
  alternates: {
    canonical: "https://www.esulabh.in",
  },
  openGraph: {
    title: "eSulabh | Blockchain-Powered Land Acquisition Management",
    description:
      "Revolutionize government land acquisition with blockchain technology. Track compensation, manage records, and ensure transparent, immutable documentation for highways, railways, and infrastructure projects.",
    url: "https://www.esulabh.in",
    siteName: "eSulabh",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png", // Relative path works better
        width: 1200,
        height: 630,
        alt: "eSulabh - Blockchain Land Acquisition Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "eSulabh | Blockchain Land Acquisition Management",
    description:
      "Transform government land acquisition with blockchain-powered transparency, immutable records, and efficient compensation tracking.",
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
  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "eSulabh",
    description:
      "Blockchain-powered land acquisition management system for government infrastructure projects.",
    applicationCategory: "GovernmentApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    url: "https://www.esulabh.in",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "85",
    },
    publisher: {
      "@type": "Organization",
      name: "eSulabh",
      url: "https://www.esulabh.in",
      logo: {
        "@type": "ImageObject",
        url: "https://www.esulabh.in/logo.png",
      },
    },
  };

  return (
    <html lang="en" className="h-full bg-background">
      <body className="h-full bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthContextProvider>
          <StyledJsxRegistry>{children} </StyledJsxRegistry>
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
