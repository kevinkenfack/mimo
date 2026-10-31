'use client';

import { useTranslations } from 'next-intl';
import {
  PLAYGROUND_EXPORT_FORMATS,
  PLAYGROUND_EXPORT_SIZES,
  type PlaygroundSettings,
  playgroundExportHref,
} from '@/lib/playground';
import { PlaygroundLinkButton } from './playground-button';

type PlaygroundDownloadsProps = {
  settings: PlaygroundSettings;
  onChange: <Key extends keyof PlaygroundSettings>(key: Key, value: PlaygroundSettings[Key]) => void;
};

export function PlaygroundDownloads({ settings, onChange }: PlaygroundDownloadsProps) {
  const t = useTranslations('playground.export');

  return (
    <section
      className='rounded-2xl border border-border bg-surface-raised p-4 sm:p-5'
      aria-labelledby='playground-export-title'
    >
      <div>
        <h2 id='playground-export-title' className='text-base font-medium tracking-[-0.01em] text-heading'>
          {t('title')}
        </h2>
        <p className='mt-1 text-xs leading-relaxed text-foreground-secondary'>{t('description')}</p>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-3'>
        <label
          htmlFor='playground-export-size'
          className='grid gap-1.5 text-sm font-medium text-heading-secondary'
        >
          <span>{t('scale')}</span>
          <select
            id='playground-export-size'
            value={String(settings.exportSize)}
            onChange={(event) => {
              const size = PLAYGROUND_EXPORT_SIZES.find(
                (option) => String(option) === event.currentTarget.value
              );
              if (size !== undefined) onChange('exportSize', size);
            }}
            className='min-h-11 w-full min-w-0 rounded-xl border border-border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
          >
            {PLAYGROUND_EXPORT_SIZES.map((size) => (
              <option key={size} value={String(size)}>
                {`${size / 256}× (${size} px)`}
              </option>
            ))}
          </select>
        </label>

        <label
          htmlFor='playground-export-format'
          className='grid gap-1.5 text-sm font-medium text-heading-secondary'
        >
          <span>{t('format')}</span>
          <select
            id='playground-export-format'
            value={settings.exportFormat}
            onChange={(event) => {
              const format = PLAYGROUND_EXPORT_FORMATS.find((option) => option === event.currentTarget.value);
              if (format) onChange('exportFormat', format);
            }}
            className='min-h-11 w-full min-w-0 rounded-xl border border-border-input bg-background px-3 py-2 text-sm uppercase text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
          >
            {PLAYGROUND_EXPORT_FORMATS.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className='mt-4 grid gap-3'>
        <PlaygroundLinkButton
          href={playgroundExportHref(settings, settings.exportFormat)}
          download
          variant='primary'
          className='min-h-12 w-full rounded-xl py-3 text-base'
        >
          {t('download', { format: `.${settings.exportFormat.toUpperCase()}` })}
        </PlaygroundLinkButton>
        <PlaygroundLinkButton
          href={playgroundExportHref(settings, 'zip')}
          download
          variant='secondary'
          className='min-h-12 w-full rounded-xl py-3 text-base'
        >
          {t('downloadAll')}
        </PlaygroundLinkButton>
      </div>

      <p className='mt-3 text-xs leading-relaxed text-foreground-tertiary'>{t('downloadAllHint')}</p>
      <p className='mt-1 text-xs leading-relaxed text-foreground-tertiary'>{t('note')}</p>
    </section>
  );
}
