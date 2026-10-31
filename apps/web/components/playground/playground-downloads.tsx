'use client';

import { useTranslations } from 'next-intl';
import { IconChevronDown } from '@/lib/icons';
import {
  type PLAYGROUND_EXPORT_FORMATS,
  type PLAYGROUND_EXPORT_SIZES,
  type PlaygroundSettings,
  playgroundExportHref,
} from '@/lib/playground';
import { PlaygroundLinkButton } from './playground-button';
import { PlaygroundCard } from './playground-card';

interface PlaygroundDownloadsProps {
  settings: PlaygroundSettings;
  onChange: <Key extends keyof PlaygroundSettings>(key: Key, value: PlaygroundSettings[Key]) => void;
}

export function PlaygroundDownloads({ settings, onChange }: PlaygroundDownloadsProps) {
  const t = useTranslations('playground.export');

  const downloadFilename = `mimo-${(settings.name.trim() || 'avatar').toLowerCase()}.${settings.exportFormat}`;
  const zipFilename = `mimo-${(settings.name.trim() || 'avatar').toLowerCase()}.zip`;

  const scaleOptions = [
    { value: 256, label: '1x' },
    { value: 512, label: '2x' },
    { value: 1024, label: '4x' },
  ];

  const formatOptions = [
    { value: 'png', label: 'PNG' },
    { value: 'svg', label: 'SVG' },
  ];

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
            className='h-10 w-full appearance-none rounded-xl border border-border/80 bg-surface px-3 pr-8 text-xs font-medium text-heading transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer'
          >
            {scaleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
            className='h-10 w-full appearance-none rounded-xl border border-border/80 bg-surface px-3 pr-8 text-xs font-semibold uppercase text-heading transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer'
          >
            {formatOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
        <PlaygroundLinkButton
          href={playgroundExportHref(settings, settings.exportFormat)}
          download={downloadFilename}
          className='min-h-10 w-full justify-center rounded-xl bg-heading text-background font-semibold text-xs transition-opacity hover:opacity-90 shadow-xs'
        >
          {t('download', { format: `.${settings.exportFormat.toUpperCase()}` })}
        </PlaygroundLinkButton>

        <PlaygroundLinkButton
          href={playgroundExportHref(settings, 'zip')}
          download={zipFilename}
          variant='ghost'
          className='min-h-9 w-full justify-center rounded-xl text-xs text-foreground-secondary hover:text-heading transition-colors'
        >
          {t('downloadAll')}
        </PlaygroundLinkButton>
      </div>
    </PlaygroundCard>
  );
}
