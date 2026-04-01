import StyledJsxRegistry from "@/components/landing-page-2/registry";

export const metadata = {
  title: "Post to all your social accounts from one dashboard",
  description:
    "Stop posting generic AI content. SocialWing learns your unique voice and drafts LinkedIn posts that your followers will never suspect were AI-generated.",
};

export default function LandingPage2Layout({ children }) {
  return <StyledJsxRegistry>{children}</StyledJsxRegistry>;
}
