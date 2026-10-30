'use client';

import { useTranslations } from 'next-intl';
import { GRADIENTS } from '@/lib/constants';
import { IconShuffle } from '@/lib/icons';
import {
  PLAYGROUND_ANIMATIONS,
  PLAYGROUND_BACKGROUNDS,
  PLAYGROUND_DEPTHS,
  PLAYGROUND_DETAIL_LEVELS,
  PLAYGROUND_EXPORT_SIZES,
  PLAYGROUND_MOODS,
  PLAYGROUND_SHAPES,
  type PlaygroundSettings,
} from '@/lib/playground';
import { PlaygroundButton } from './playground-button';

type SelectOption<Value extends string | number> = {
  value: Value;
  label: string;
};

type SelectFieldProps<Value extends string | number> = {
  id: string;
  label: string;
  value: Value;
  options: SelectOption<Value>[];
  onValueChange: (value: Value) => void;
};

function SelectField<Value extends string | number>({
  id,
  label,
  value,
  options,
  onValueChange,
}: SelectFieldProps<Value>) {
  return (
    <label htmlFor={id} className='grid gap-1.5 text-sm font-medium text-heading-secondary'>
      <span>{label}</span>
      <select
        id={id}
        value={String(value)}
        onChange={(event) => {
          const option = options.find((item) => String(item.value) === event.currentTarget.value);
          if (option) onValueChange(option.value);
        }}
        className='min-h-10 w-full rounded-lg border border-border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

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
  const gradientOptions = GRADIENTS.map((gradient) => ({
    value: gradient.name,
    label: colorNames(gradient.name.toLowerCase()),
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
  const animationOptions = PLAYGROUND_ANIMATIONS.map((value) => ({
    value,
    label: options(`animations.${value}`),
  }));
  const sizeOptions = PLAYGROUND_EXPORT_SIZES.map((value) => ({
    value,
    label: `${value} px`,
  }));

  return (
    <section
      className='rounded-2xl border border-border bg-surface-raised p-3 sm:p-5'
      aria-labelledby='playground-controls-title'
    >
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h2
            id='playground-controls-title'
            className='text-base font-medium tracking-[-0.01em] text-heading'
          >
            {t('title')}
          </h2>
          <p className='mt-1 text-xs leading-relaxed text-foreground-secondary'>{t('description')}</p>
        </div>
        <PlaygroundButton variant='ghost' onClick={onReset} className='min-h-8 shrink-0 px-2.5 text-xs'>
          {t('reset')}
        </PlaygroundButton>
      </div>

      <div className='mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2'>
        <div className='grid gap-1.5 sm:col-span-2'>
          <label htmlFor='playground-name' className='text-sm font-medium text-heading-secondary'>
            {t('name')}
          </label>
          <div className='grid grid-cols-[minmax(0,1fr)_auto] gap-2'>
            <input
              id='playground-name'
              type='text'
              maxLength={64}
              value={settings.name}
              onChange={(event) => onChange('name', event.currentTarget.value)}
              placeholder={t('placeholder')}
              aria-describedby='playground-name-hint'
              className='min-h-10 min-w-0 rounded-lg border border-border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
            />
            <PlaygroundButton
              variant='secondary'
              onClick={onRandomize}
              title={t('randomize')}
              aria-label={t('randomize')}
              className='shrink-0 px-3'
            >
              <IconShuffle className='size-4' aria-hidden='true' />
              <span className='hidden sm:inline'>{t('randomize')}</span>
            </PlaygroundButton>
          </div>
          <p id='playground-name-hint' className='text-xs leading-relaxed text-foreground-tertiary'>
            {t('nameHint')}
          </p>
        </div>

        <SelectField
          id='playground-shape'
          label={t('shape')}
          value={settings.shape}
          options={shapeOptions}
          onValueChange={(value) => onChange('shape', value)}
        />
        <SelectField
          id='playground-background'
          label={t('background')}
          value={settings.background}
          options={backgroundOptions}
          onValueChange={(value) => onChange('background', value)}
        />
        <SelectField
          id='playground-gradient'
          label={t('palette')}
          value={settings.gradient}
          options={gradientOptions}
          onValueChange={(value) => onChange('gradient', value)}
        />
        <SelectField
          id='playground-mood'
          label={t('mood')}
          value={settings.mood}
          options={moodOptions}
          onValueChange={(value) => onChange('mood', value)}
        />
        <SelectField
          id='playground-detail'
          label={t('detail')}
          value={settings.detailLevel}
          options={detailOptions}
          onValueChange={(value) => onChange('detailLevel', value)}
        />
        <SelectField
          id='playground-depth'
          label={t('depth')}
          value={settings.depth}
          options={depthOptions}
          onValueChange={(value) => onChange('depth', value)}
        />
        <SelectField
          id='playground-animation'
          label={t('animation')}
          value={settings.animation}
          options={animationOptions}
          onValueChange={(value) => onChange('animation', value)}
        />
        <SelectField
          id='playground-export-size'
          label={t('exportSize')}
          value={settings.exportSize}
          options={sizeOptions}
          onValueChange={(value) => onChange('exportSize', value)}
        />
      </div>
    </section>
  );
}
