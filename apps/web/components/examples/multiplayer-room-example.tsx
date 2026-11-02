'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function MultiplayerRoomExample() {
  const t = useTranslations('examples.multiplayer');
  const participants = [
    { name: 'Nova', speaking: true, mood: 'happy' },
    { name: 'Kiko', speaking: false, mood: undefined },
    { name: 'Milo', speaking: false, mood: 'sleepy' },
    { name: 'Ember', speaking: false, mood: undefined },
  ] as const;

  return (
    <section className='min-w-0' aria-labelledby='examples-multiplayer-title'>
      <h2
        id='examples-multiplayer-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'>
        <div className='flex items-center justify-between gap-3 border-b border-divider pb-3'>
          <h3 className='text-xs font-medium text-heading'>{t('roomName')}</h3>
          <div className='flex shrink-0 items-center gap-3'>
            <span className='text-xs text-foreground-tertiary'>
              {t('participantCount', { count: participants.length })}
            </span>
            <span className='inline-flex items-center gap-1.5 text-xs text-foreground-secondary'>
              <span aria-hidden='true' className='size-2 rounded-full bg-accent' />
              {t('live')}
            </span>
          </div>
        </div>

        <ul
          aria-label={t('participantList', { count: participants.length })}
          className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4'
        >
          {participants.map((participant) => (
            <li
              key={participant.name}
              className={`flex min-w-0 flex-col items-center rounded-2xl border p-3 text-center ${
                participant.speaking ? 'border-accent/50 bg-accent/5' : 'border-border bg-background'
              }`}
            >
              <span aria-hidden='true' className='shrink-0'>
                <Mimo
                  name={participant.name}
                  size={48}
                  shape='circle'
                  detailLevel='basic'
                  mood={participant.mood}
                />
              </span>
              <p className='mt-2 max-w-full truncate text-xs font-medium text-heading'>{participant.name}</p>
              <p
                className={`mt-1 rounded-full px-2 py-1 text-[0.625rem] ${
                  participant.speaking
                    ? 'bg-accent/10 text-heading-secondary'
                    : 'bg-surface-badge text-foreground-tertiary'
                }`}
              >
                {participant.speaking ? t('speaking') : t('listening')}
              </p>
            </li>
          ))}
        </ul>

        <p className='mt-3 border-t border-divider pt-3 text-center text-xs text-foreground-secondary'>
          {t('speakerAnnouncement', { name: 'Nova' })}
        </p>
      </div>
    </section>
  );
}
