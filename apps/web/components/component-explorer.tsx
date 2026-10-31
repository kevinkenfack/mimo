'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from '@/components/language-toggle';
import { SiteFooter } from '@/components/site-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link as LocaleLink } from '@/i18n/navigation';
import { ComponentUsageShowcase } from './component-usage-showcase';

const NAV_LINK_CLASS =
  'rounded-md px-2 py-1 text-xs text-foreground-secondary transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary';

export function ComponentExplorer() {
  const t = useTranslations('components');
  const common = useTranslations('common');
  const previewTags = [
    t('examples.chat.title'),
    t('examples.team.title'),
    t('examples.leaderboard.title'),
    t('examples.comments.title'),
    t('examples.stack.title'),
  ];

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
            <LocaleLink href='/components' aria-current='page' className={NAV_LINK_CLASS}>
              {common('explore')}
            </LocaleLink>
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </header>

        <section className='grid min-w-0 items-center gap-7 border-b border-divider py-8 sm:py-12 md:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] md:gap-10'>
          <div className='min-w-0'>
            <h1 className='[font-family:var(--font-serif),Georgia,serif] max-w-2xl break-words text-[2rem] leading-[1.2] font-normal tracking-[-0.02em] text-heading'>
              {t('hero.title')}
            </h1>
            <p className='mt-4 max-w-xl text-sm leading-relaxed text-foreground-secondary sm:text-base'>
              {t('hero.description')}
            </p>
            <div className='mt-5 flex flex-wrap gap-2'>
              <a
                href='#usage-examples'
                className='inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
              >
                {t('hero.exploreCta')}
                <span aria-hidden='true'>↓</span>
              </a>
              <LocaleLink
                href='/playground'
                className='inline-flex min-h-10 items-center rounded-full border border-border px-4 text-xs font-medium text-heading-secondary transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
              >
                {common('playground')}
              </LocaleLink>
            </div>
          </div>

          <div className='min-w-0 rounded-3xl border border-border bg-surface-raised p-4 sm:p-6'>
            <div className='flex min-w-0 flex-wrap items-center justify-between gap-2'>
              <p className='text-xs font-medium text-heading-secondary'>{t('hero.previewLabel')}</p>
              <span className='rounded-full bg-surface-badge px-2.5 py-1 font-mono text-[0.6875rem] text-foreground-secondary'>
                mimo-id/react
              </span>
            </div>
            <div className='mt-5 flex min-w-0 items-center justify-center gap-2 sm:gap-4'>
              {['Kevin', 'Manon', 'Sarah', 'Hugo'].map((name, index) => (
                <Mimo
                  key={name}
                  aria-hidden={true}
                  name={name}
                  size={index === 0 ? 66 : 54}
                  shape={index === 0 ? 'squircle' : 'circle'}
                  detailLevel='full'
                  depth='subtle'
                  animations={index % 2 === 0 ? ['blink', 'float'] : ['sway']}
                  interactive={false}
                />
              ))}
            </div>
            <div className='mt-4 rounded-xl border border-border bg-background px-3 py-2 text-center'>
              <code className='break-words text-xs text-foreground-secondary'>
                {'<Mimo name="Kevin" size={40} />'}
              </code>
            </div>
            <div className='mt-4 flex min-w-0 flex-wrap justify-center gap-2'>
              {previewTags.map((tag) => (
                <span
                  key={tag}
                  className='max-w-full rounded-full border border-border px-2.5 py-1 text-[0.6875rem] text-foreground-tertiary'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ComponentUsageShowcase />

        <section className='mt-9 grid min-w-0 gap-4 rounded-3xl border border-border bg-surface p-5 sm:mt-12 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'>
          <div className='min-w-0'>
            <h2 className='[font-family:var(--font-serif),Georgia,serif] mt-2 break-words text-[1.625rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading sm:text-[2rem]'>
              {t('next.title')}
            </h2>
            <p className='mt-2 max-w-2xl text-sm leading-relaxed text-foreground-secondary'>
              {t('next.description')}
            </p>
          </div>
          <LocaleLink
            href='/playground'
            className='inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
          >
            {t('next.cta')}
            <span aria-hidden='true'>→</span>
          </LocaleLink>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
