import StyledJsxRegistry from "@/components/landing-page-2/registry";

export const metadata = {
  title: "Draftfor.me — LinkedIn Posts That Sound Like You",
  description:
    "Stop posting generic AI content. draftfor.me learns your unique voice and drafts LinkedIn posts that your followers will never suspect were AI-generated.",
};

export default function LandingPage2Layout({ children }) {
  return <StyledJsxRegistry>{children}</StyledJsxRegistry>;
}
