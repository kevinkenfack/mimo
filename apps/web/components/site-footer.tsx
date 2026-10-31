'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { IconGitHub } from '@/lib/icons';

type SiteFooterProps = {
  narrow?: boolean;
};

const VERSION = '1.0.0';

export function SiteFooter({ narrow = false }: SiteFooterProps) {
  const t = useTranslations('footer');
  const year = String(new Date().getFullYear());

  return (
    <footer
      className={`mx-auto w-full ${narrow ? 'max-w-152 px-6' : 'max-w-6xl px-3 sm:px-6'} border-t border-divider py-6 text-xs text-foreground-tertiary`}
    >
      <div className='flex flex-col items-center gap-3 text-center'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <span>{t('madeBy')}</span>
          <span className='inline-flex items-center gap-1 rounded-full border border-divider bg-foreground/5 py-1 pl-1 pr-3 transition-colors hover:bg-foreground/10'>
            <span aria-hidden='true'>
              <Mimo name='Kevin' size={20} shape='circle' detailLevel='standard' depth='none' />
            </span>
            <span className='inline-flex items-baseline gap-1.5 whitespace-nowrap leading-tight'>
              <span className='text-sm font-medium text-heading'>Kevin</span>
              <span className='text-[0.6875rem] text-foreground-tertiary'>@kevinkznfack</span>
            </span>
          </span>
        </div>

        <p className='max-w-lg text-center leading-relaxed'>{t('description')}</p>

        <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1'>
          <span>{t('version', { version: VERSION })}</span>
          <span aria-hidden='true'>·</span>
          <span>{t('copyright', { year })}</span>
          <span aria-hidden='true'>·</span>
          <a
            href='https://x.com/kevinkznfack'
            target='_blank'
            rel='noopener noreferrer'
            className='transition-colors hover:text-heading'
          >
            {t('twitter')}
          </a>
          <span aria-hidden='true'>·</span>
          <a
            href='https://github.com/kevinkenfack/mimo'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 transition-colors hover:text-heading'
          >
            <IconGitHub className='size-3.5' aria-hidden='true' />
            {t('github')}
          </a>
        </div>
      </div>
    </footer>
  );
}
