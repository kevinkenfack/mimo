'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function ProfileCardExample() {
  const t = useTranslations('examples.profile');

  return (
    <section className='min-w-0 md:col-span-2' aria-labelledby='examples-profile-title'>
      <h2
        id='examples-profile-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 rounded-3xl border border-border bg-surface-raised p-5 sm:p-7'>
        <div className='flex flex-col items-center gap-5 text-center md:flex-row md:gap-8 md:text-left'>
          <span aria-hidden='true' className='shrink-0'>
            <Mimo
              name='Nova'
              size={136}
              shape='circle'
              background='gradient'
              mood='happy'
              detailLevel='full'
              depth='subtle'
              animations={['float']}
            />
          </span>
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center justify-center gap-2 md:justify-start'>
              <h3 className='text-xl font-semibold tracking-[-0.02em] text-heading'>Nova</h3>
              <span className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
                {t('availability')}
              </span>
            </div>
            <p className='mt-3 max-w-lg text-sm leading-relaxed text-foreground-secondary'>{t('bio')}</p>
            <div className='mt-5 flex flex-wrap justify-center gap-2 md:justify-start'>
              <button
                type='button'
                className='inline-flex min-h-10 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
              >
                {t('follow')}
              </button>
              <button
                type='button'
                className='inline-flex min-h-10 items-center justify-center rounded-full border border-border px-4 text-xs font-medium text-heading-secondary transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
              >
                {t('message')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
