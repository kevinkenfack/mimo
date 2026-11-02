'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function ChatExample() {
  const t = useTranslations('examples.chat');
  const messages = [
    {
      author: 'Nova',
      time: '09:41',
      body: t('messages.launch'),
      mood: 'happy',
      animation: 'glance',
    },
    {
      author: 'Zephyr',
      time: '09:42',
      body: t('messages.release'),
      mood: 'surprised',
      animation: 'eyeWander',
    },
    {
      author: 'Nova',
      time: '09:43',
      body: t('messages.sameFace'),
      mood: 'happy',
      animation: 'glance',
    },
  ] as const;

  return (
    <section className='min-w-0' aria-labelledby='examples-chat-title'>
      <h2
        id='examples-chat-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'>
        <div className='flex items-center gap-2 border-b border-divider pb-3'>
          <p className='text-xs font-medium text-heading'>{t('room')}</p>
          <span className='ml-auto text-xs text-foreground-tertiary'>{t('messageCount')}</span>
        </div>
        <ol className='mt-4 flex flex-col gap-4' aria-label={t('messageListLabel')}>
          {messages.map((message) => (
            <li key={`${message.author}-${message.time}`} className='flex min-w-0 items-end gap-2.5'>
              <span aria-hidden='true' className='shrink-0'>
                <Mimo
                  name={message.author}
                  size={40}
                  shape='circle'
                  detailLevel='basic'
                  mood={message.mood}
                  animations={[message.animation]}
                />
              </span>
              <div className='min-w-0'>
                <p className='mb-1 flex items-baseline gap-2 text-[0.6875rem] text-foreground-tertiary'>
                  <span className='font-medium text-heading-secondary'>{message.author}</span>
                  <time dateTime={message.time}>{message.time}</time>
                </p>
                <p className='w-fit max-w-full rounded-2xl rounded-bl-md bg-surface px-3 py-2 text-sm leading-relaxed text-foreground'>
                  {message.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
