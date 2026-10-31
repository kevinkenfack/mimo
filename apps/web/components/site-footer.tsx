'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { IconGitHub } from '@/lib/icons';

type SiteFooterProps = {
  narrow?: boolean;
  fullWidth?: boolean;
};

const VERSION = '1.0.0';

export function SiteFooter({ narrow = false, fullWidth = false }: SiteFooterProps) {
  const t = useTranslations('footer');
  const year = String(new Date().getFullYear());

  return (
    <footer
      className={`mx-auto w-full ${
        fullWidth
          ? 'px-4 sm:px-6 lg:px-8'
          : narrow
            ? 'max-w-5xl px-4 sm:px-6'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
      } border-t border-divider py-5 text-xs text-foreground-tertiary`}
    >
      <div className='flex flex-col items-center gap-4 lg:flex-row lg:justify-between'>
        {/* Left: Crafted by + Pill badge */}
        <div className='flex shrink-0 items-center justify-center gap-2 lg:justify-start'>
          <span className='whitespace-nowrap leading-none'>{t('craftedBy')}</span>
          <a
            href='https://x.com/thekenfack'
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex h-8 items-center gap-2 rounded-full bg-surface px-3 text-xs leading-none text-foreground/90 transition-colors hover:bg-surface-elevated hover:text-foreground'
          >
            <span
              aria-hidden='true'
              className='flex h-4.5 w-4.5 shrink-0 items-center justify-center overflow-hidden rounded-full'
            >
              <Mimo name='Kenfack' size={18} shape='circle' detailLevel='standard' depth='none' />
            </span>
            <span className='whitespace-nowrap'>Kevin Kenfack</span>
            <span className='whitespace-nowrap'>@thekenfack</span>
          </a>
        </div>

        {/* Center: Browser execution tagline */}
        <p className='text-center text-xs text-foreground-tertiary/90 leading-relaxed px-2 lg:whitespace-nowrap lg:px-4'>
          {t('description')}
        </p>

        {/* Right: Version, Year & Links */}
        <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 shrink-0 whitespace-nowrap text-xs lg:justify-end'>
          <span>
            {t('version', { version: VERSION })}, {year}
          </span>
          <span aria-hidden='true' className='opacity-40'>
            ·
          </span>
          <a
            href='https://x.com/thekenfack'
            target='_blank'
            rel='noopener noreferrer'
            className='transition-colors hover:text-heading'
          >
            {t('twitter')}
          </a>
          <span aria-hidden='true' className='opacity-40'>
            ·
          </span>
          <a
            href='https://github.com/kevinkenfack/mimo'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 transition-colors hover:text-heading'
          >
            <IconGitHub className='h-3.5 w-3.5' aria-hidden='true' />
            <span>{t('github')}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
