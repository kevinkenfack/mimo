'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function ReviewsExample() {
  const t = useTranslations('examples.reviews');
  const reviews = [
    {
      name: 'Amina',
      role: t('roles.designer'),
      quote: t('quotes.community'),
      mood: 'happy',
    },
    {
      name: 'Leo',
      role: t('roles.maintainer'),
      quote: t('quotes.product'),
      mood: 'cool',
    },
  ] as const;

  return (
    <section className='min-w-0 md:col-span-2' aria-labelledby='examples-reviews-title'>
      <h2
        id='examples-reviews-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 grid min-w-0 gap-3 sm:grid-cols-2'>
        {reviews.map((review) => (
          <article
            key={review.name}
            className='min-w-0 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'
          >
            <div className='flex min-w-0 items-center gap-3'>
              <span aria-hidden='true' className='shrink-0'>
                <Mimo name={review.name} size={44} shape='circle' detailLevel='basic' mood={review.mood} />
              </span>
              <div className='min-w-0 flex-1'>
                <h3 className='truncate text-sm font-medium text-heading'>{review.name}</h3>
                <p className='truncate text-xs text-foreground-tertiary'>{review.role}</p>
              </div>
              <div role='img' aria-label={t('ratingLabel', { rating: 5 })} className='shrink-0 text-right'>
                <span aria-hidden='true' className='block text-sm tracking-[0.12em] text-accent'>
                  ★★★★★
                </span>
                <span aria-hidden='true' className='block text-[0.625rem] text-foreground-tertiary'>
                  5.0 / 5
                </span>
              </div>
            </div>
            <blockquote className='mt-4 text-sm leading-relaxed text-foreground-secondary'>
              “{review.quote}”
            </blockquote>
          </article>
        ))}
      </div>
    </section>
  );
}
