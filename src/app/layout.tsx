import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { SITE_NAME, SITE_DESCRIPTION } from "@/utils/constants";
import GalaxyBackground from "@/components/GalaxyBackground";

const montserrat = Montserrat({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#07251F",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: ["developer", "portfolio", "bitcoin", "software engineer", "web development"],
  authors: [{ name: "Brandon" }],
  creator: "Brandon",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/family-photo.jpeg",
        width: 1200,
        height: 630,
        alt: SITE_NAME
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/family-photo.jpeg"],
    creator: "@Saucy_Tech"
  },
  icons: {
    icon: [
      { url: "/icons/github-logo.svg", type: "image/svg+xml" }
    ],
    shortcut: [
      { url: "/icons/github-logo.svg", type: "image/svg+xml" }
    ]
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ErrorBoundary>
          <GalaxyBackground>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <div className="container mx-auto max-w-5xl">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </GalaxyBackground>
        </ErrorBoundary>
      </body>
    </html>
  );
}
