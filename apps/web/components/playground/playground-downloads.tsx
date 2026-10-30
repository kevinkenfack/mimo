'use client';

import { useTranslations } from 'next-intl';
import type { PlaygroundSettings } from '@/lib/playground';
import { PlaygroundLinkButton } from './playground-button';

function downloadHref(settings: PlaygroundSettings, format: 'png' | 'svg') {
  const params = new URLSearchParams({
    format,
    name: settings.name.trim() || 'Mimo',
    shape: settings.shape,
    background: settings.background,
    gradient: settings.gradient.toLowerCase(),
    mood: settings.mood,
    detail: settings.detailLevel,
    depth: settings.depth,
    size: String(settings.exportSize),
  });

  return `/api/playground?${params.toString()}`;
}

export function PlaygroundDownloads({ settings }: { settings: PlaygroundSettings }) {
  const t = useTranslations('playground.preview');

  return (
    <div className='mt-5 grid gap-3 sm:grid-cols-2'>
      <PlaygroundLinkButton
        href={downloadHref(settings, 'png')}
        download
        variant='primary'
        className='w-full'
      >
        {t('downloadPng')}
      </PlaygroundLinkButton>
      <PlaygroundLinkButton
        href={downloadHref(settings, 'svg')}
        download
        variant='secondary'
        className='w-full'
      >
        {t('downloadSvg')}
      </PlaygroundLinkButton>
      <p className='text-xs leading-relaxed text-foreground-tertiary sm:col-span-2'>{t('exportNote')}</p>
    </div>
  );
}
