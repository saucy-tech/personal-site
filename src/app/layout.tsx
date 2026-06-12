import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getFooterNavItems, getSiteNavItems } from '@/config/site-nav';
import { SITE_NAME, SITE_DESCRIPTION_HIRING, SITE_URL } from '@/utils/constants';
import { getSiteJsonLd } from '@/utils/structured-data';
import { APPEARANCE_STORAGE_KEY, THEME_STORAGE_KEY } from '@/utils/theme';
import ClientGalaxyBackground from '@/components/ClientGalaxyBackground';

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
  alternates: {
    canonical: '/',
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_HIRING,
  keywords: [
    'software engineer',
    'IT development manager',
    'government technology',
    'GIS',
    'full-stack developer',
    'Next.js',
    'Brandon Sauceda',
  ],
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
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION_HIRING,
    images: [
      {
        url: '/headshot.jpeg',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION_HIRING,
    images: ['/headshot.jpeg'],
    creator: '@Saucy_Tech',
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const navItems = getSiteNavItems();
  const footerNavItems = getFooterNavItems();
  // Site-level structured data (Person + WebSite). Rendered here, in the dynamic
  // layout, so it carries the per-request nonce and stays CSP-compliant. The home
  // page is statically prerendered and cannot emit a nonced inline script.
  const siteJsonLd = getSiteJsonLd({
    authorName: 'Brandon',
    authorImagePath: '/headshot.jpeg',
    sameAs: [
      'https://x.com/Saucy_Tech',
      'https://github.com/saucy-tech',
      'https://primal.net/p/nprofile1qqsvzs8gfntzjs2wg8670nrfy64h44zy69kc3r8rp5wd7kw6t6njsassf62c7',
    ],
  });
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          {...(nonce ? { nonce } : {})}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=${JSON.stringify(THEME_STORAGE_KEY)};var a=${JSON.stringify(APPEARANCE_STORAGE_KEY)};if(localStorage.getItem(t)==='green')document.documentElement.setAttribute('data-theme','green');if(localStorage.getItem(a)==='light')document.documentElement.setAttribute('data-appearance','light');}catch(e){}})();`,
          }}
        />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          {...(nonce ? { nonce } : {})}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className={`${ibmSans.variable} ${ibmMono.variable} font-sans antialiased`}>
        {/* Background canvas and content wrapper */}
        <div className="shell-backdrop relative min-h-screen bg-(--background)">
          {/* Client-only animated background */}
          <ClientGalaxyBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header navItems={navItems} />
            <main id="main-content" className="grow">
              <div className="container mx-auto max-w-[min(100%,80rem)] px-4 sm:px-6">
                {children}
              </div>
            </main>
            <Footer navItems={footerNavItems} />
          </div>
        </div>
      </body>
    </html>
  );
}
