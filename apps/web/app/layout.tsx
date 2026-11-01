import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Instrument_Serif } from 'next/font/google';
import localFont from 'next/font/local';
import { getLocale, getTranslations } from 'next-intl/server';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from '../components/theme-provider';
import './globals.css';

const openRunde = localFont({
  src: [
    { path: '../public/OpenRunde-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/OpenRunde-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/OpenRunde-Semibold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-open-runde',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
});

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const title = t('title');
  const description = t('description');
  const openGraphDescription = t('openGraphDescription');

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      languages: {
        en: '/',
        fr: '/fr',
      },
    },
    openGraph: {
      title,
      description: openGraphDescription,
      siteName: 'Mimo',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [{ url: '/api/og', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: openGraphDescription,
      images: ['/api/og'],
    },
    keywords: ['avatar', 'generative', 'animated', 'deterministic', 'open-source', 'react', 'svg'],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('mimo-theme') || localStorage.getItem('theme');
                var isDark = theme === 'dark' || ((theme == null || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                var color = isDark ? '#0a0a0a' : '#faf9f7';
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
                var meta = document.querySelector('meta[name="theme-color"]');
                if (meta) {
                  meta.setAttribute('content', color);
                } else {
                  meta = document.createElement('meta');
                  meta.name = 'theme-color';
                  meta.content = color;
                  document.head.appendChild(meta);
                }
                var style = localStorage.getItem('app-style');
                if (style && style !== 'neutral') {
                  document.documentElement.setAttribute('data-style', style);
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${openRunde.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}>
        <ThemeProvider>
          <Analytics />
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
