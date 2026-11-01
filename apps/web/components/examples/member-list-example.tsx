'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function MemberListExample() {
  const t = useTranslations('examples.members');
  const members = [
    { name: 'Nova', role: t('roles.product'), status: 'online', mood: 'happy' },
    { name: 'Kiko', role: t('roles.design'), status: 'online', mood: undefined },
    { name: 'Ember', role: t('roles.engineering'), status: 'online', mood: undefined },
    { name: 'Milo', role: t('roles.community'), status: 'offline', mood: 'sleepy' },
  ] as const;

  return (
    <section className='min-w-0' aria-labelledby='examples-members-title'>
      <h2
        id='examples-members-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <ul className='mt-4 divide-y divide-divider rounded-3xl border border-border bg-surface-raised px-4'>
        {members.map((member) => (
          <li key={member.name} className='flex min-w-0 items-center gap-3 py-3 first:pt-4 last:pb-4'>
            <span aria-hidden='true' className='shrink-0'>
              <Mimo name={member.name} size={40} shape='circle' detailLevel='basic' mood={member.mood} />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-heading'>{member.name}</p>
              <p className='truncate text-xs text-foreground-tertiary'>{member.role}</p>
            </div>
            <span className='inline-flex shrink-0 items-center gap-1.5 text-xs text-foreground-secondary'>
              {member.status === 'online' ? (
                <span aria-hidden='true' className='size-2 rounded-full bg-accent' />
              ) : (
                <span aria-hidden='true' className='size-2 rounded-full bg-foreground-quaternary' />
              )}
              {member.status === 'online' ? t('status.online') : t('status.offline')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
