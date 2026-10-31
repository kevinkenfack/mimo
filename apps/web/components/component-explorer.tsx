'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LanguageToggle } from '@/components/language-toggle';
import { SiteFooter } from '@/components/site-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link as LocaleLink } from '@/i18n/navigation';
import { COMPONENT_GROUPS, type ComponentFeature, type ComponentGroupId } from '@/lib/component-catalog';
import { HERO_NAMES } from '@/lib/constants';
import { ComponentFeatureGallery } from './component-feature-gallery';
import { ComponentFeaturePreview } from './component-feature-preview';

const NAV_LINK_CLASS =
  'rounded-md px-2 py-1 text-xs text-foreground-secondary transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary';

export function ComponentExplorer() {
  const t = useTranslations('components');
  const common = useTranslations('common');
  const [activeGroupId, setActiveGroupId] = useState<ComponentGroupId>('eyes');
  const [selectedFeature, setSelectedFeature] = useState<ComponentFeature>(COMPONENT_GROUPS[0].items[0]);

  function selectGroup(groupId: ComponentGroupId) {
    const group = COMPONENT_GROUPS.find((item) => item.id === groupId);
    if (!group) return;

    setActiveGroupId(groupId);
    setSelectedFeature(group.items[0]);
  }

  return (
    <main className='flex min-h-svh flex-col bg-background'>
      <div className='mx-auto w-full max-w-6xl flex-1 px-3 py-5 sm:px-6 sm:py-8'>
        <header className='flex items-center justify-between border-b border-divider pb-4'>
          <LocaleLink href='/' className='text-[0.9375rem] font-medium tracking-[-0.01em] text-heading'>
            Mimo
          </LocaleLink>
          <nav className='flex items-center gap-0.5 sm:gap-1' aria-label={t('navLabel')}>
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

        <section className='grid items-center gap-7 border-b border-divider py-9 sm:py-12 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-10'>
          <div>
            <p className='text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-foreground-tertiary'>
              {t('hero.eyebrow')}
            </p>
            <h1 className='[font-family:var(--font-serif),Georgia,serif] mt-3 max-w-2xl text-[2.625rem] leading-[1.04] font-normal tracking-[-0.04em] text-heading sm:text-6xl'>
              {t('hero.title')}
            </h1>
            <p className='mt-4 max-w-xl text-sm leading-relaxed text-foreground-secondary sm:text-base'>
              {t('hero.description')}
            </p>
            <div className='mt-5 flex flex-wrap gap-2'>
              <a
                href='#feature-browser'
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

          <div className='rounded-3xl border border-border bg-surface-raised p-4 sm:p-6'>
            <div className='flex items-center justify-between gap-3'>
              <p className='text-xs font-medium text-heading-secondary'>{t('hero.previewLabel')}</p>
              <span className='rounded-full bg-surface-badge px-2.5 py-1 font-mono text-[0.6875rem] text-foreground-secondary'>
                {t('stats.combinationsValue')}
              </span>
            </div>
            <div className='mt-6 flex min-h-32 flex-wrap items-end justify-center gap-2.5 sm:min-h-40 sm:gap-4'>
              {HERO_NAMES.slice(0, 4).map((name, index) => (
                <Mimo
                  key={name}
                  aria-hidden={true}
                  data-explorer-avatar='true'
                  name={name}
                  size={index === 0 || index === 3 ? 84 : 68}
                  detailLevel='full'
                  depth='subtle'
                  animations={index % 2 === 0 ? ['blink', 'float'] : ['sway']}
                  interactive={false}
                  className={index % 2 === 0 ? '-translate-y-1' : 'translate-y-2'}
                />
              ))}
            </div>
          </div>
        </section>

        <dl className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>
          {COMPONENT_GROUPS.map((group) => (
            <div key={group.id} className='rounded-xl border border-border bg-surface p-3'>
              <dt className='text-[0.6875rem] text-foreground-tertiary'>
                {t(`groups.${group.id}.label` as never)}
              </dt>
              <dd className='mt-1 text-lg font-medium tracking-[-0.03em] text-heading'>
                {group.items.length}
              </dd>
            </div>
          ))}
          <div className='rounded-xl border border-border bg-surface p-3'>
            <dt className='text-[0.6875rem] text-foreground-tertiary'>{t('stats.combinations')}</dt>
            <dd className='mt-1 text-lg font-medium tracking-[-0.03em] text-heading'>
              {t('stats.combinationsValue')}
            </dd>
          </div>
        </dl>

        <section id='feature-browser' className='scroll-mt-6 pt-10 sm:pt-12'>
          <div className='mb-5 max-w-2xl'>
            <p className='text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-foreground-tertiary'>
              {t('gallery.eyebrow')}
            </p>
            <h2 className='[font-family:var(--font-serif),Georgia,serif] mt-2 text-3xl leading-tight font-normal tracking-[-0.03em] text-heading sm:text-4xl'>
              {t('gallery.title')}
            </h2>
            <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>
              {t('gallery.description')}
            </p>
          </div>

          <div className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] lg:gap-6'>
            <div className='order-2 min-w-0 lg:order-1'>
              <ComponentFeatureGallery
                activeGroupId={activeGroupId}
                selectedFeature={selectedFeature}
                onSelectGroup={selectGroup}
                onSelectFeature={setSelectedFeature}
              />
            </div>
            <div className='order-1 lg:order-2'>
              <ComponentFeaturePreview groupId={activeGroupId} feature={selectedFeature} />
            </div>
          </div>
        </section>

        <section className='mt-10 grid gap-4 rounded-3xl border border-border bg-surface p-5 sm:mt-12 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'>
          <div>
            <p className='text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-foreground-tertiary'>
              {t('next.eyebrow')}
            </p>
            <h2 className='[font-family:var(--font-serif),Georgia,serif] mt-2 text-2xl font-normal tracking-[-0.03em] text-heading sm:text-3xl'>
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
