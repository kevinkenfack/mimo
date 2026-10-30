'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { GRADIENTS } from '@/lib/constants';
import type { PlaygroundSettings } from '@/lib/playground';
import { PlaygroundDownloads } from './playground-downloads';

export function PlaygroundPreview({ settings }: { settings: PlaygroundSettings }) {
  const t = useTranslations('playground.preview');
  const options = useTranslations('playground.options');
  const colorNames = useTranslations('colors.names');
  const name = settings.name.trim() || 'Mimo';
  const gradient = GRADIENTS.find((option) => option.name === settings.gradient) ?? GRADIENTS[0]!;
  const moodLabel = settings.mood === 'none' ? options('moods.none') : options(`moods.${settings.mood}`);

  return (
    <section
      className='rounded-2xl border border-border bg-surface-raised p-3 sm:p-5'
      aria-labelledby='playground-preview-title'
    >
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-foreground-tertiary'>
            {t('eyebrow')}
          </p>
          <h2
            id='playground-preview-title'
            className='mt-1 text-base font-medium tracking-[-0.01em] text-heading'
          >
            {t('title')}
          </h2>
          <p className='mt-1 text-xs text-foreground-secondary'>{t('description')}</p>
        </div>
        <span className='shrink-0 rounded-full bg-surface-badge px-2.5 py-1 font-mono text-[0.625rem] text-badge-foreground'>
          SVG
        </span>
      </div>

      <div className='mt-5 flex aspect-square w-full items-center justify-center rounded-xl bg-surface-placeholder p-2'>
        <Mimo
          name={name}
          size={256}
          shape={settings.shape}
          background={settings.background}
          gradients={gradient.pair}
          mood={settings.mood === 'none' ? undefined : settings.mood}
          detailLevel={settings.detailLevel}
          depth={settings.depth}
          animations={settings.animation === 'none' ? [] : [settings.animation]}
          role='img'
          aria-label={t('ariaLabel', { name })}
        />
      </div>

      <ul className='mt-4 flex flex-wrap gap-2' aria-label={t('settingsLabel')}>
        <li className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
          {options(`shapes.${settings.shape}`)}
        </li>
        <li className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
          {colorNames(gradient.name.toLowerCase())}
        </li>
        <li className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
          {moodLabel}
        </li>
      </ul>

      <PlaygroundDownloads settings={settings} />
    </section>
  );
}
