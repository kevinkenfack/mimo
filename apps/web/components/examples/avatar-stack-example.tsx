'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

const contributors = ['Nova', 'Kiko', 'Ember', 'Zephyr'] as const;

export function AvatarStackExample() {
  const t = useTranslations('examples.stack');

  return (
    <section className='min-w-0' aria-labelledby='examples-stack-title'>
      <h2
        id='examples-stack-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 flex min-h-44 flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface-raised p-4 sm:p-6'>
        <div role='img' aria-label={t('groupLabel')} className='flex items-center pl-3'>
          {contributors.map((name) => (
            <span
              key={name}
              aria-hidden='true'
              className='relative -ml-3 block size-12 shrink-0 rounded-full border-2 border-surface-raised bg-background p-0.5 first:ml-0'
            >
              <Mimo
                name={name}
                size={40}
                shape='circle'
                detailLevel='basic'
                mood={name === 'Nova' ? 'happy' : undefined}
              />
            </span>
          ))}
          <span
            aria-hidden='true'
            className='relative -ml-3 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-surface-raised bg-surface-badge text-xs font-medium text-heading-secondary'
          >
            +3
          </span>
        </div>
        <p className='text-center text-sm text-foreground-secondary'>{t('caption')}</p>
      </div>
    </section>
  );
}
