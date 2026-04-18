import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/constants';
import ClientGalaxyBackground from '@/components/ClientGalaxyBackground';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const ibmSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0a0e0c',
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
    icon: [{ url: '/favicon.ico' }],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
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
      <body className={`${ibmSans.variable} ${ibmMono.variable} font-sans antialiased`}>
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
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-grow">
              <div className="container mx-auto max-w-[min(100%,80rem)] px-4 sm:px-6">{children}</div>
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
