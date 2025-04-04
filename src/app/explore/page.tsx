import GalaxyBackground from "@/components/GalaxyBackground";
import ExploreContent from "@/components/ExploreContent";
import { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/utils/constants";

export const metadata: Metadata = {
  title: "Explore",
  description: "Explore what I'm currently reading, listening to, and discovering in the worlds of tech, bitcoin, and beyond.",
  openGraph: {
    title: "Explore | What I'm Into",
    description: "Explore what I'm currently reading, listening to, and discovering in the worlds of tech, bitcoin, and beyond.",
    url: `${SITE_URL}/explore`,
    type: "website",
    images: [
      {
        url: "/og-explore.jpg", // You can create a specific OG image for the explore page
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Explore`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore | What I'm Into",
    description: "Explore what I'm currently reading, listening to, and discovering in the worlds of tech, bitcoin, and beyond.",
    images: ["/og-explore.jpg"],
  }
};
export default function Explore() {
  // Personalized content
  const currentlyListening = {
    title: "Knowledge Project with Adam Grant",
    description:
      "Exploring the intersection of psychology and business, with insights on motivation, productivity, and meaningful work.",
    link: "https://fs.blog/knowledge-project-podcast/adam-grant/",
  };

  const currentlyReading = {
    title: "The Sovereign Individual",
    author: "James Dale Davidson & William Rees-Mogg",
    thoughts:
      "A fascinating exploration of how the digital revolution will reshape society, economics, and the nature of government. The parallels with Bitcoin and the current state of the world are striking.",
  };

  return (
    <GalaxyBackground>
      <ExploreContent
        currentlyListening={currentlyListening}
        currentlyReading={currentlyReading}
      />
    </GalaxyBackground>
  );
}
