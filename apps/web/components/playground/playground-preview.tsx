'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GRADIENTS } from '@/lib/constants';
import { IconCheck, IconCopy, IconMinus, IconPlus } from '@/lib/icons';
import { type PlaygroundSettings, playgroundExportHref } from '@/lib/playground';

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

export function PlaygroundPreview({ settings }: { settings: PlaygroundSettings }) {
  const t = useTranslations('playground.preview');
  const options = useTranslations('playground.options');
  const colorNames = useTranslations('colors.names');
  const [zoom, setZoom] = useState(100);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const name = settings.name.trim() || 'Mimo';
  const gradient = GRADIENTS.find((option) => option.name === settings.gradient) ?? GRADIENTS[0]!;
  const moodLabel = settings.mood === 'none' ? options('moods.none') : options(`moods.${settings.mood}`);
  const copyLabel =
    copyState === 'copied'
      ? t('copySuccess')
      : copyState === 'error'
        ? t('copyError')
        : copyState === 'copying'
          ? t('copying')
          : t('copyPng');
  const copyStatus = copyState === 'copied' ? t('copySuccess') : copyState === 'error' ? t('copyError') : '';

  async function copyPngToClipboard() {
    setCopyState('copying');

    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
        throw new Error('Image clipboard is not supported');
      }

      const response = await fetch(playgroundExportHref(settings, 'png'));
      if (!response.ok) throw new Error('PNG export failed');

      const png = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [png.type]: png })]);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }

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

      <div className='relative mt-5 rounded-2xl border border-border-strong bg-surface-raised p-1.5 shadow-sm'>
        <figure
          className='relative flex aspect-square items-center justify-center overflow-hidden rounded-xl'
          aria-label={t('canvasLabel')}
          style={{
            backgroundColor: 'var(--surface-raised)',
            backgroundImage:
              'conic-gradient(color-mix(in srgb, var(--foreground) 7%, var(--surface-raised)) 25%, transparent 0 50%, color-mix(in srgb, var(--foreground) 7%, var(--surface-raised)) 0 75%, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        >
          <div
            className='flex size-full items-center justify-center transition-transform duration-200 ease-out'
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <Mimo
              name={name}
              size={236}
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

          <fieldset className='absolute right-3 top-3 z-10 flex min-w-0 flex-col overflow-hidden rounded-xl border border-border-strong bg-surface-raised shadow-md'>
            <legend className='sr-only'>{t('canvasTools')}</legend>
            <button
              type='button'
              onClick={() => void copyPngToClipboard()}
              disabled={copyState === 'copying'}
              aria-label={copyLabel}
              title={copyLabel}
              className='grid size-10 place-items-center text-heading-secondary transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 disabled:opacity-50'
            >
              {copyState === 'copied' ? (
                <IconCheck className='size-5' aria-hidden='true' />
              ) : (
                <IconCopy className='size-5' aria-hidden='true' />
              )}
            </button>
            <div className='h-px bg-divider' />
            <button
              type='button'
              onClick={() => setZoom((current) => Math.min(200, current + 25))}
              disabled={zoom >= 200}
              aria-label={t('zoomIn')}
              title={t('zoomIn')}
              className='grid size-10 place-items-center text-heading-secondary transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 disabled:opacity-40'
            >
              <IconPlus className='size-5' aria-hidden='true' />
            </button>
            <div className='h-px bg-divider' />
            <button
              type='button'
              onClick={() => setZoom((current) => Math.max(50, current - 25))}
              disabled={zoom <= 50}
              aria-label={t('zoomOut')}
              title={t('zoomOut')}
              className='grid size-10 place-items-center text-heading-secondary transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 disabled:opacity-40'
            >
              <IconMinus className='size-5' aria-hidden='true' />
            </button>
          </fieldset>

          <span className='absolute bottom-3 left-3 rounded-full border border-border-strong bg-surface-raised px-3 py-1 text-xs font-medium text-foreground-secondary shadow-sm'>
            {zoom}%
          </span>
          <output className='sr-only' aria-live='polite'>
            {copyStatus}
          </output>
        </figure>
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
    </section>
  );
}
