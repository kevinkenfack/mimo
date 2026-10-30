import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { routing } from '@/i18n/routing';
import { PageContent } from './page-content';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ locale: requestedLocale }, queryParams] = await Promise.all([params, searchParams]);
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const ogParams = new URLSearchParams();
  for (const key of ['name', 'shape', 'depth', 'detail', 'mood', 'bg']) {
    const val = queryParams[key];
    if (typeof val === 'string' && val) ogParams.set(key, val);
  }
  const ogQuery = ogParams.size > 0 ? `?${ogParams.toString()}` : '';
  const ogUrl = `/api/og${ogQuery}`;

  const name = typeof queryParams.name === 'string' && queryParams.name ? queryParams.name : undefined;
  const title = name ? `${name} — Mimo` : t('title');
  const description = t('openGraphDescription');
  const openGraphLocale = locale === 'fr' ? 'fr_FR' : 'en_US';

  return {
    title,
    description: t('description'),
    openGraph: {
      title,
      description,
      siteName: 'Mimo',
      locale: openGraphLocale,
      type: 'website',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default function Home() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
