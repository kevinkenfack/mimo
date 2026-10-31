import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ComponentExplorer } from '@/components/component-explorer';
import { routing } from '@/i18n/routing';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'components.metadata' });
  const canonicalPath = locale === 'fr' ? '/fr/components' : '/components';
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/components',
        fr: '/fr/components',
      },
    },
    openGraph: {
      title,
      description,
      siteName: 'Mimo',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      url: canonicalPath,
      images: [{ url: '/api/og', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/api/og'],
    },
  };
}

export default function ComponentsPage() {
  return <ComponentExplorer />;
}
