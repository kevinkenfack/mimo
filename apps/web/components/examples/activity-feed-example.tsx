'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function ActivityFeedExample() {
  const t = useTranslations('examples.activity');
  const activities = [
    { name: 'Nova', event: t('events.release'), time: t('times.justNow'), mood: 'happy' },
    { name: 'Kiko', event: t('events.joined'), time: t('times.twelveMinutesAgo'), mood: undefined },
    { name: 'Milo', event: t('events.feedback'), time: t('times.oneHourAgo'), mood: 'sleepy' },
  ] as const;

  return (
    <section className='min-w-0' aria-labelledby='examples-activity-title'>
      <h2
        id='examples-activity-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'>
        <ol aria-label={t('listLabel')} className='divide-y divide-divider'>
          {activities.map((activity) => (
            <li key={activity.name} className='flex min-w-0 items-center gap-3 py-3 first:pt-1 last:pb-1'>
              <span aria-hidden='true' className='shrink-0'>
                <Mimo
                  name={activity.name}
                  size={40}
                  shape='circle'
                  detailLevel='basic'
                  mood={activity.mood}
                />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='text-sm leading-relaxed text-foreground'>
                  <span className='font-medium text-heading'>{activity.name}</span> {activity.event}
                </p>
                <p className='mt-1 text-xs text-foreground-tertiary'>{activity.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
