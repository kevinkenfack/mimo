'use client';

import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { LanguageToggle } from '@/components/language-toggle';
import { SiteFooter } from '@/components/site-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link as LocaleLink } from '@/i18n/navigation';
import { GRADIENTS, HERO_NAMES, VARIETY_NAMES } from '@/lib/constants';
import {
  DEFAULT_PLAYGROUND_SETTINGS,
  PLAYGROUND_ANIMATIONS,
  PLAYGROUND_BACKGROUNDS,
  PLAYGROUND_DEPTHS,
  PLAYGROUND_DETAIL_LEVELS,
  PLAYGROUND_EXPORT_FORMATS,
  PLAYGROUND_EXPORT_SIZES,
  PLAYGROUND_MOODS,
  PLAYGROUND_SHAPES,
  type PlaygroundSettings,
} from '@/lib/playground';
import { PlaygroundControls } from './playground-controls';
import { PlaygroundDownloads } from './playground-downloads';
import { PlaygroundPreview } from './playground-preview';

function pickRandom<Value>(values: readonly Value[]): Value {
  return values[Math.floor(Math.random() * values.length)]!;
}

export function PlaygroundExperience() {
  const t = useTranslations('playground');
  const common = useTranslations('common');
  const [querySettings, setQuerySettings] = useQueryStates(
    {
      name: parseAsString.withDefault(DEFAULT_PLAYGROUND_SETTINGS.name),
      shape: parseAsStringLiteral(PLAYGROUND_SHAPES).withDefault(DEFAULT_PLAYGROUND_SETTINGS.shape),
      background: parseAsStringLiteral(PLAYGROUND_BACKGROUNDS).withDefault(
        DEFAULT_PLAYGROUND_SETTINGS.background
      ),
      gradient: parseAsString.withDefault(DEFAULT_PLAYGROUND_SETTINGS.gradient),
      mood: parseAsStringLiteral(PLAYGROUND_MOODS).withDefault(DEFAULT_PLAYGROUND_SETTINGS.mood),
      detailLevel: parseAsStringLiteral(PLAYGROUND_DETAIL_LEVELS).withDefault(
        DEFAULT_PLAYGROUND_SETTINGS.detailLevel
      ),
      depth: parseAsStringLiteral(PLAYGROUND_DEPTHS).withDefault(DEFAULT_PLAYGROUND_SETTINGS.depth),
      animation: parseAsStringLiteral(PLAYGROUND_ANIMATIONS).withDefault(
        DEFAULT_PLAYGROUND_SETTINGS.animation
      ),
      exportSize: parseAsInteger.withDefault(DEFAULT_PLAYGROUND_SETTINGS.exportSize),
      exportFormat: parseAsStringLiteral(PLAYGROUND_EXPORT_FORMATS).withDefault(
        DEFAULT_PLAYGROUND_SETTINGS.exportFormat
      ),
    },
    { history: 'replace', clearOnDefault: true }
  );
  const gradient =
    GRADIENTS.find((option) => option.name === querySettings.gradient)?.name ??
    DEFAULT_PLAYGROUND_SETTINGS.gradient;
  const exportSize =
    PLAYGROUND_EXPORT_SIZES.find((size) => size === querySettings.exportSize) ??
    DEFAULT_PLAYGROUND_SETTINGS.exportSize;
  const exportFormat =
    PLAYGROUND_EXPORT_FORMATS.find((format) => format === querySettings.exportFormat) ??
    DEFAULT_PLAYGROUND_SETTINGS.exportFormat;
  const settings: PlaygroundSettings = {
    ...querySettings,
    name: querySettings.name.slice(0, 64),
    gradient,
    exportSize,
    exportFormat,
  };

  function updateSetting<Key extends keyof PlaygroundSettings>(key: Key, value: PlaygroundSettings[Key]) {
    void setQuerySettings({ [key]: value } as Partial<typeof querySettings>);
  }

  function randomize() {
    void setQuerySettings({
      name: pickRandom([...HERO_NAMES, ...VARIETY_NAMES]),
      shape: pickRandom(PLAYGROUND_SHAPES),
      background: pickRandom(PLAYGROUND_BACKGROUNDS),
      gradient: pickRandom(GRADIENTS).name,
      mood: pickRandom(PLAYGROUND_MOODS),
      detailLevel: pickRandom(PLAYGROUND_DETAIL_LEVELS),
      depth: pickRandom(PLAYGROUND_DEPTHS),
      animation: pickRandom(PLAYGROUND_ANIMATIONS),
    });
  }

  function reset() {
    void setQuerySettings(DEFAULT_PLAYGROUND_SETTINGS);
  }

  return (
    <main className='flex min-h-svh flex-col bg-background'>
      <div className='mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-6 sm:py-10'>
        <header className='flex items-center justify-between border-b border-divider pb-4'>
          <LocaleLink href='/' className='text-[0.9375rem] font-medium tracking-[-0.01em] text-heading'>
            Mimo
          </LocaleLink>
          <div className='flex items-center gap-1'>
            <LocaleLink
              href='/'
              className='rounded-md px-2 py-1 text-xs text-foreground-secondary transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary'
            >
              {t('home')}
            </LocaleLink>
            <LocaleLink
              href='/components'
              className='rounded-md px-2 py-1 text-xs text-foreground-secondary transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary'
            >
              {common('explore')}
            </LocaleLink>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        <section className='max-w-3xl pb-6 pt-8 sm:pb-8 sm:pt-12'>
          <p className='text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-foreground-tertiary'>
            {t('eyebrow')}
          </p>
          <h1 className='[font-family:var(--font-serif),Georgia,serif] mt-2 text-[2.25rem] leading-[1.12] font-normal tracking-[-0.03em] text-heading sm:text-[3.25rem]'>
            {t('title')}
          </h1>
          <p className='mt-3 max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base'>
            {t('description')}
          </p>
        </section>

        <div className='grid items-start gap-4 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)] lg:gap-6'>
          <div className='order-1 lg:order-2'>
            <PlaygroundPreview settings={settings} />
          </div>
          <div className='order-2 lg:order-1'>
            <PlaygroundControls
              settings={settings}
              onChange={updateSetting}
              onRandomize={randomize}
              onReset={reset}
            />
          </div>
        </div>

        <div className='mt-4 sm:mt-6'>
          <PlaygroundDownloads settings={settings} onChange={updateSetting} />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
