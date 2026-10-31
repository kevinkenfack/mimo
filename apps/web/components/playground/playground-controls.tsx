'use client';

import { useTranslations } from 'next-intl';
import { GRADIENTS } from '@/lib/constants';
import { IconChevronDown, IconShuffle, IconUndo } from '@/lib/icons';
import {
  DEFAULT_PLAYGROUND_SETTINGS,
  PLAYGROUND_ANIMATIONS,
  PLAYGROUND_BACKGROUNDS,
  PLAYGROUND_DEPTHS,
  PLAYGROUND_DETAIL_LEVELS,
  PLAYGROUND_MOODS,
  PLAYGROUND_SHAPES,
  type PlaygroundSettings,
} from '@/lib/playground';
import { PlaygroundCard } from './playground-card';
import { PlaygroundDownloads } from './playground-downloads';
import { PlaygroundSegmented } from './playground-segmented';

interface PlaygroundControlsProps {
  settings: PlaygroundSettings;
  onChange: <Key extends keyof PlaygroundSettings>(key: Key, value: PlaygroundSettings[Key]) => void;
  onRandomize: () => void;
  onReset: () => void;
}

export function PlaygroundControls({ settings, onChange, onRandomize, onReset }: PlaygroundControlsProps) {
  const t = useTranslations('playground.controls');
  const options = useTranslations('playground.options');
  const colorNames = useTranslations('colors.names');

  const shapeOptions = PLAYGROUND_SHAPES.map((value) => ({
    value,
    label: options(`shapes.${value}`),
  }));

  const backgroundOptions = PLAYGROUND_BACKGROUNDS.map((value) => ({
    value,
    label: options(`backgrounds.${value}`),
  }));

  const moodOptions = PLAYGROUND_MOODS.map((value) => ({
    value,
    label: options(`moods.${value}`),
  }));

  const detailOptions = PLAYGROUND_DETAIL_LEVELS.map((value) => ({
    value,
    label: options(`details.${value}`),
  }));

  const depthOptions = PLAYGROUND_DEPTHS.map((value) => ({
    value,
    label: options(`depths.${value}`),
  }));

  const mainAnimationOptions = PLAYGROUND_ANIMATIONS.slice(0, 5).map((value) => ({
    value,
    label: options(`animations.${value}`),
  }));

  return (
    <div className='flex h-full flex-col'>
      <div className='mb-3 flex items-center justify-between px-1 text-xs'>
        <span className='font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-foreground-tertiary'>
          CONTROLS
        </span>
        <button
          type='button'
          onClick={onReset}
          className='inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground-tertiary transition-colors hover:bg-surface hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50'
        >
          <IconUndo className='size-3.5' aria-hidden='true' />
          <span>{t('reset')}</span>
        </button>
      </div>

      <div className='flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 pb-0 scrollbar-thin'>
        <PlaygroundCard title={t('name')}>
          <div className='space-y-2'>
            <div className='grid grid-cols-[minmax(0,1fr)_auto] gap-2'>
              <input
                id='playground-name'
                type='text'
                maxLength={64}
                value={settings.name}
                onChange={(event) => onChange('name', event.currentTarget.value)}
                placeholder={t('placeholder')}
                className='min-h-9 min-w-0 rounded-xl border border-border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-foreground-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
              />
              <button
                type='button'
                onClick={onRandomize}
                className='inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border-strong bg-surface px-3 py-1.5 text-xs font-medium text-heading transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
              >
                <IconShuffle className='size-3.5 text-foreground-secondary' aria-hidden='true' />
                <span>{t('randomize')}</span>
              </button>
            </div>
            <p className='text-[0.6875rem] leading-relaxed text-foreground-tertiary'>{t('nameHint')}</p>
          </div>
        </PlaygroundCard>

        <PlaygroundCard
          title={t('mood')}
          onReset={() => {
            onChange('mood', DEFAULT_PLAYGROUND_SETTINGS.mood);
            onChange('detailLevel', DEFAULT_PLAYGROUND_SETTINGS.detailLevel);
          }}
          resetTitle='Reset expression'
        >
          <div className='space-y-3'>
            <PlaygroundSegmented
              label={t('mood')}
              value={settings.mood}
              options={moodOptions}
              onChange={(value) => onChange('mood', value)}
              columns={3}
            />
            <PlaygroundSegmented
              label={t('detail')}
              value={settings.detailLevel}
              options={detailOptions}
              onChange={(value) => onChange('detailLevel', value)}
              columns={4}
            />
          </div>
        </PlaygroundCard>

        <PlaygroundCard
          title={t('shape')}
          onReset={() => {
            onChange('shape', DEFAULT_PLAYGROUND_SETTINGS.shape);
            onChange('depth', DEFAULT_PLAYGROUND_SETTINGS.depth);
          }}
          resetTitle='Reset geometry'
        >
          <div className='space-y-3'>
            <PlaygroundSegmented
              label={t('shape')}
              value={settings.shape}
              options={shapeOptions}
              onChange={(value) => onChange('shape', value)}
              columns={3}
            />
            <PlaygroundSegmented
              label={t('depth')}
              value={settings.depth}
              options={depthOptions}
              onChange={(value) => onChange('depth', value)}
              columns={4}
            />
          </div>
        </PlaygroundCard>

        <PlaygroundCard
          title={t('palette')}
          onReset={() => {
            onChange('background', DEFAULT_PLAYGROUND_SETTINGS.background);
            onChange('gradient', DEFAULT_PLAYGROUND_SETTINGS.gradient);
          }}
          resetTitle='Reset appearance'
        >
          <div className='space-y-3'>
            <PlaygroundSegmented
              label={t('background')}
              value={settings.background}
              options={backgroundOptions}
              onChange={(value) => onChange('background', value)}
              columns={2}
            />

            <div className='space-y-3'>
              <div>
                <span className='mb-2 block text-xs font-medium text-foreground-secondary'>
                  {t('palette')}
                </span>
                <div className='grid grid-cols-8 gap-1.5'>
                  {GRADIENTS.map((grad) => {
                    const isSelected = grad.name === settings.gradient;
                    const firstPair = grad.pair[0];
                    const fromColor = firstPair?.from ?? '#E8D5F5';
                    const toColor = firstPair?.to ?? '#C7A4E0';
                    const label = colorNames(grad.name.toLowerCase());

                    return (
                      <button
                        key={grad.name}
                        type='button'
                        onClick={() => onChange('gradient', grad.name)}
                        title={label}
                        aria-label={label}
                        aria-pressed={isSelected}
                        className={`relative flex aspect-square items-center justify-center rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                          isSelected
                            ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface-raised scale-110'
                            : 'opacity-75 hover:opacity-100 hover:scale-105'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
                        }}
                      >
                        <span className='sr-only'>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className='relative'>
                <select
                  id='playground-palette-select'
                  value={settings.gradient}
                  onChange={(e) => onChange('gradient', e.currentTarget.value)}
                  className='h-9 w-full appearance-none rounded-xl border border-border/80 bg-surface px-3 pr-8 text-xs font-medium text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer scheme-light dark:scheme-dark'
                  style={{ colorScheme: 'inherit' }}
                >
                  {GRADIENTS.map((grad) => (
                    <option key={grad.name} value={grad.name}>
                      {colorNames(grad.name.toLowerCase())}
                    </option>
                  ))}
                </select>
                <IconChevronDown
                  className='pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-tertiary'
                  aria-hidden='true'
                />
              </div>
            </div>
          </div>
        </PlaygroundCard>

        <PlaygroundCard
          title={t('animation')}
          onReset={() => onChange('animation', DEFAULT_PLAYGROUND_SETTINGS.animation)}
          resetTitle='Reset motion'
        >
          <PlaygroundSegmented
            value={settings.animation}
            options={mainAnimationOptions}
            onChange={(value) => onChange('animation', value)}
            columns={3}
          />
        </PlaygroundCard>

        <PlaygroundDownloads settings={settings} onChange={onChange} />
      </div>
    </div>
  );
}
