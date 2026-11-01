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
      setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 3000);
    }
  }

  return (
    <div className='flex h-full min-h-0 flex-col rounded-2xl border border-border bg-surface-raised p-3.5 sm:p-5 shadow-xs'>
      {/* Top Header */}
      <div className='mb-3 flex items-center justify-between text-xs'>
        <div className='flex items-center gap-2'>
          <span className='font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-foreground-tertiary'>
            PREVIEW
          </span>
        </div>

        <div className='flex items-center gap-1.5'>
          <button
            type='button'
            onClick={() => void copyPngToClipboard()}
            disabled={copyState === 'copying'}
            aria-label={copyLabel}
            title={copyLabel}
            className='inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-2.5 py-1 text-xs text-foreground-secondary transition-colors hover:bg-surface-elevated hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 disabled:opacity-50'
          >
            {copyState === 'copied' ? (
              <>
                <IconCheck className='size-3.5 text-emerald-500' aria-hidden='true' />
                <span className='text-emerald-500'>Copied</span>
              </>
            ) : (
              <>
                <IconCopy className='size-3.5' aria-hidden='true' />
                <span>Copy PNG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center Canvas */}
      <figure
        className='relative flex flex-1 min-h-0 items-center justify-center overflow-hidden rounded-xl border border-border-strong'
        aria-label={t('canvasLabel')}
        style={{
          backgroundColor: 'var(--surface-raised)',
          backgroundImage:
            'conic-gradient(color-mix(in srgb, var(--foreground) 7%, var(--surface-raised)) 25%, transparent 0 50%, color-mix(in srgb, var(--foreground) 7%, var(--surface-raised)) 0 75%, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className='flex size-full items-center justify-center transition-transform duration-200 ease-out'
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <Mimo
            name={name}
            size={240}
            shape={settings.shape}
            background={settings.background}
            gradients={gradient.pair}
            mood={settings.mood === 'none' ? undefined : settings.mood}
            detailLevel={settings.detailLevel}
            depth={settings.depth}
            animations={settings.animation === 'none' ? [] : [settings.animation]}
            interactive={settings.interactive}
            role='img'
            aria-label={t('ariaLabel', { name })}
          />
        </div>

        {/* Bottom Left Zoom Indicator */}
        <span className='absolute bottom-3 left-3 rounded-full border border-border-strong bg-surface-raised/90 px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-foreground-secondary shadow-xs backdrop-blur-xs'>
          {zoom}%
        </span>

        {/* Bottom Right Zoom Controls */}
        <div className='absolute bottom-3 right-3 flex items-center overflow-hidden rounded-xl border border-border-strong bg-surface-raised/95 shadow-md backdrop-blur-xs'>
          <button
            type='button'
            onClick={() => setZoom((current) => Math.max(50, current - 25))}
            disabled={zoom <= 50}
            aria-label={t('zoomOut')}
            title={t('zoomOut')}
            className='grid size-8 place-items-center text-foreground-secondary transition-colors hover:bg-surface hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 disabled:opacity-40'
          >
            <IconMinus className='size-3.5' aria-hidden='true' />
          </button>
          <div className='h-4 w-px bg-divider' />
          <button
            type='button'
            onClick={() => setZoom((current) => Math.min(200, current + 25))}
            disabled={zoom >= 200}
            aria-label={t('zoomIn')}
            title={t('zoomIn')}
            className='grid size-8 place-items-center text-foreground-secondary transition-colors hover:bg-surface hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 disabled:opacity-40'
          >
            <IconPlus className='size-3.5' aria-hidden='true' />
          </button>
        </div>

        <output className='sr-only' aria-live='polite'>
          {copyStatus}
        </output>
      </figure>

      {/* Bottom Settings Tags */}
      <ul className='mt-3.5 flex flex-wrap gap-1.5' aria-label={t('settingsLabel')}>
        <li className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
          {options(`shapes.${settings.shape}`)}
        </li>
        <li className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
          {colorNames(gradient.name.toLowerCase())}
        </li>
        <li className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
          {moodLabel}
        </li>
        <li className='rounded-full bg-surface-badge px-2.5 py-1 text-xs text-foreground-secondary'>
          {options(`animations.${settings.animation}`)}
        </li>
      </ul>
    </div>
  );
}
