'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function SupportInboxExample() {
  const t = useTranslations('examples.support');
  const tickets = [
    {
      customer: 'Mila',
      subject: t('tickets.exportSubject'),
      preview: t('tickets.exportPreview'),
      time: t('times.twoMinutesAgo'),
      agent: 'Nova',
      status: t('statuses.waiting'),
      mood: 'surprised',
    },
    {
      customer: 'Owen',
      subject: t('tickets.paletteSubject'),
      preview: t('tickets.palettePreview'),
      time: t('times.eighteenMinutesAgo'),
      agent: 'Kiko',
      status: t('statuses.assigned'),
      mood: undefined,
    },
  ] as const;

  return (
    <section className='min-w-0' aria-labelledby='examples-support-title'>
      <h2
        id='examples-support-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'>
        <div className='flex items-center justify-between gap-3 border-b border-divider pb-3'>
          <h3 className='text-xs font-medium text-heading'>{t('queue')}</h3>
          <span className='text-xs text-foreground-tertiary'>{t('ticketCount', { count: 2 })}</span>
        </div>
        <ul className='divide-y divide-divider'>
          {tickets.map((ticket) => (
            <li key={ticket.customer} className='flex min-w-0 items-start gap-3 py-3 last:pb-1'>
              <span aria-hidden='true' className='shrink-0'>
                <Mimo
                  name={ticket.customer}
                  size={38}
                  shape='circle'
                  detailLevel='basic'
                  mood={ticket.mood}
                />
              </span>
              <div className='min-w-0 flex-1'>
                <div className='flex min-w-0 items-center justify-between gap-2'>
                  <p className='truncate text-sm font-medium text-heading'>{ticket.customer}</p>
                  <span className='shrink-0 text-xs text-foreground-tertiary'>{ticket.time}</span>
                </div>
                <p className='mt-1 truncate text-sm text-heading-secondary'>{ticket.subject}</p>
                <p className='mt-0.5 truncate text-xs text-foreground-tertiary'>{ticket.preview}</p>
                <div className='mt-2 flex min-w-0 items-center justify-between gap-2'>
                  <span className='shrink-0 rounded-full bg-surface-badge px-2 py-1 text-[0.625rem] text-foreground-secondary'>
                    {ticket.status}
                  </span>
                  <div className='flex min-w-0 items-center gap-1.5'>
                    <span className='shrink-0 text-[0.625rem] text-foreground-tertiary'>
                      {t('assignedTo')}
                    </span>
                    <span aria-hidden='true' className='shrink-0'>
                      <Mimo name={ticket.agent} size={22} shape='circle' detailLevel='basic' />
                    </span>
                    <span className='truncate text-xs text-foreground-secondary'>{ticket.agent}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
