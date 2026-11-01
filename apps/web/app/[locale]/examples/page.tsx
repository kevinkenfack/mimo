import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { AvatarStackExample } from '@/components/examples/avatar-stack-example';
import { ChatExample } from '@/components/examples/chat-example';
import { MemberListExample } from '@/components/examples/member-list-example';
import { ProfileCardExample } from '@/components/examples/profile-card-example';
import { UserMenuExample } from '@/components/examples/user-menu-example';
import { LanguageToggle } from '@/components/language-toggle';
import { SiteFooter } from '@/components/site-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link as LocaleLink } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const NAV_LINK_CLASS =
  'rounded-md px-2 py-1 text-xs text-foreground-secondary transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'examples.metadata' });
  const canonicalPath = locale === 'fr' ? '/fr/examples' : '/examples';
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/examples',
        fr: '/fr/examples',
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

export default async function ExamplesPage() {
  const t = await getTranslations('examples');
  const common = await getTranslations('common');

  return (
    <main className='flex min-h-svh flex-col bg-background'>
      <div className='mx-auto w-full max-w-6xl flex-1 px-3 py-5 sm:px-6 sm:py-8'>
        <header className='flex min-w-0 items-center justify-between gap-2 border-b border-divider pb-4'>
          <LocaleLink
            href='/'
            className='shrink-0 text-[0.9375rem] font-medium tracking-[-0.01em] text-heading'
          >
            Mimo
          </LocaleLink>
          <nav
            className='flex min-w-0 flex-wrap items-center justify-end gap-0.5 sm:gap-1'
            aria-label={t('navLabel')}
          >
            <LocaleLink href='/' className={NAV_LINK_CLASS}>
              {common('home')}
            </LocaleLink>
            <LocaleLink href='/playground' className={NAV_LINK_CLASS}>
              {common('playground')}
            </LocaleLink>
            <LocaleLink href='/components' className={NAV_LINK_CLASS}>
              {common('explore')}
            </LocaleLink>
            <LocaleLink href='/examples' aria-current='page' className={NAV_LINK_CLASS}>
              {common('examples')}
            </LocaleLink>
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </header>

        <section className='border-b border-divider py-8 sm:py-12'>
          <h1 className='[font-family:var(--font-serif),Georgia,serif] max-w-2xl text-[2rem] leading-[1.2] font-normal tracking-[-0.02em] text-heading'>
            {t('hero.title')}
          </h1>
          <p className='mt-4 max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base'>
            {t('hero.description')}
          </p>
        </section>

        <div className='grid min-w-0 gap-x-8 gap-y-9 py-8 sm:gap-y-12 md:grid-cols-2'>
          <ChatExample />
          <AvatarStackExample />
          <ProfileCardExample />
          <MemberListExample />
          <UserMenuExample />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
