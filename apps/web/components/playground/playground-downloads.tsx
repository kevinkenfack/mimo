'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { IconChevronDown } from '@/lib/icons';
import {
  type PLAYGROUND_EXPORT_FORMATS,
  type PLAYGROUND_EXPORT_SIZES,
  type PlaygroundSettings,
  playgroundExportHref,
} from '@/lib/playground';
import { PlaygroundCard } from './playground-card';

interface PlaygroundDownloadsProps {
  settings: PlaygroundSettings;
  onChange: <Key extends keyof PlaygroundSettings>(key: Key, value: PlaygroundSettings[Key]) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function makeDateTag() {
  const now = new Date();
  return `${now.getDate()}${MONTHS[now.getMonth()]}`;
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
}

export function PlaygroundDownloads({ settings, onChange }: PlaygroundDownloadsProps) {
  const t = useTranslations('playground.export');
  const counter = useRef(0);

  const dateTag = makeDateTag();

  const scaleOptions = [
    { value: 256, label: '1x' },
    { value: 512, label: '2x' },
    { value: 1024, label: '4x' },
  ];

  const formatOptions = [
    { value: 'png', label: 'PNG' },
    { value: 'svg', label: 'SVG' },
  ];

  function handleDownload() {
    counter.current += 1;
    const seq = String(counter.current).padStart(3, '0');
    const ts = `${dateTag}_${seq}`;
    const filename = `mimo_${ts}.${settings.exportFormat}`;
    triggerDownload(playgroundExportHref(settings, settings.exportFormat, ts), filename);
  }

  function handleDownloadAll() {
    counter.current += 1;
    const seq = String(counter.current).padStart(3, '0');
    const ts = `${dateTag}_${seq}`;
    const filename = `mimo_${ts}.zip`;
    triggerDownload(playgroundExportHref(settings, 'zip', ts), filename);
  }

  return (
    <PlaygroundCard
      title={t('eyebrow')}
      badge={<span className='font-mono text-[0.6875rem] text-foreground-tertiary'>3/5</span>}
    >
      <div className='flex items-center gap-2'>
        <div className='relative w-28 shrink-0'>
          <select
            id='playground-export-scale'
            value={String(settings.exportSize)}
            onChange={(e) => {
              const val = Number(e.currentTarget.value) as (typeof PLAYGROUND_EXPORT_SIZES)[number];
              onChange('exportSize', val);
            }}
            aria-label={t('scale')}
            className='h-10 w-full appearance-none rounded-xl border border-border/80 bg-surface px-3 pr-8 text-xs font-medium text-heading transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer scheme-light dark:scheme-dark'
          >
            {scaleOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className='bg-white text-zinc-900 dark:bg-[#1d1d1c] dark:text-[#f2f1ed]'
              >
                {opt.label}
              </option>
            ))}
          </select>
          <IconChevronDown
            className='pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground-tertiary'
            aria-hidden='true'
          />
        </div>

        <div className='relative flex-1'>
          <select
            id='playground-export-format'
            value={settings.exportFormat}
            onChange={(e) => {
              const val = e.currentTarget.value as (typeof PLAYGROUND_EXPORT_FORMATS)[number];
              onChange('exportFormat', val);
            }}
            aria-label={t('format')}
            className='h-10 w-full appearance-none rounded-xl border border-border/80 bg-surface px-3 pr-8 text-xs font-semibold uppercase text-heading transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer scheme-light dark:scheme-dark'
          >
            {formatOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className='bg-white text-zinc-900 dark:bg-[#1d1d1c] dark:text-[#f2f1ed]'
              >
                {opt.label}
              </option>
            ))}
          </select>
          <IconChevronDown
            className='pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-tertiary'
            aria-hidden='true'
          />
        </div>
      </div>

      <div className='mt-2.5 space-y-1.5'>
        <button
          type='button'
          id='playground-download-btn'
          onClick={handleDownload}
          className='flex min-h-10 w-full items-center justify-center rounded-xl bg-heading px-4 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90'
        >
          {t('download', { format: `.${settings.exportFormat.toUpperCase()}` })}
        </button>

        <button
          type='button'
          id='playground-download-all-btn'
          onClick={handleDownloadAll}
          className='flex min-h-9 w-full items-center justify-center rounded-xl px-4 text-xs text-foreground-secondary transition-colors hover:text-heading'
        >
          {t('downloadAll')}
        </button>
      </div>
    </PlaygroundCard>
  );
}
