import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/constants';
import ClientGalaxyBackground from '@/components/ClientGalaxyBackground';
import ClientSnowflakes from '@/components/ClientSnowflakes';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const montserrat = Montserrat({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#07251F',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['developer', 'portfolio', 'bitcoin', 'software engineer', 'web development'],
  authors: [{ name: 'Brandon' }],
  creator: 'Brandon',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/family-photo.jpeg',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/family-photo.jpeg`],
    creator: '@Saucy_Tech',
  },
  icons: {
    icon: [{ url: '/icons/github-logo.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/icons/github-logo.svg', type: 'image/svg+xml' }],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Add apple-touch-icon for iOS sharing
  // You may want to use a dedicated icon file (e.g., /apple-touch-icon.png) for best results
  // For now, we'll use the same image as og:image
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={`${SITE_URL}/apple-touch-icon.png`} />
      </head>
      <body className={montserrat.className}>
        {/* Background canvas and content wrapper */}
        <div
          className="relative min-h-screen bg-[var(--background)]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, var(--accent-transparent) 0%, transparent 60%), ' +
              'radial-gradient(circle at 70% 40%, var(--accent-transparent) 0%, transparent 60%), ' +
              'radial-gradient(circle at 40% 80%, var(--accent-transparent) 0%, transparent 60%)',
          }}
        >
          {/* Client-only animated background */}
          <ClientGalaxyBackground />
          {/* Winter snowflakes with toggle */}
          <ClientSnowflakes />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <div className="container mx-auto max-w-5xl">{children}</div>
            </main>
            <Footer />
          </div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
