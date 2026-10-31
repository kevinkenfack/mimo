'use client';

import { Mimo } from 'mimo-id/react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@/i18n/navigation';
import type { ComponentFeature, ComponentGroupId } from '@/lib/component-catalog';
import { CodeBlock } from './shared';

type ComponentFeaturePreviewProps = {
  groupId: ComponentGroupId;
  feature: ComponentFeature;
};

type CopyResult = {
  sampleName: string;
  status: 'copied' | 'error';
};

export function ComponentFeaturePreview({ groupId, feature }: ComponentFeaturePreviewProps) {
  const t = useTranslations('components');
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);
  const featureLabel = t(`items.${groupId}.${feature.id}` as never);
  const groupLabel = t(`groups.${groupId}.label` as never);
  const code = `import { Mimo } from "mimo-id/react";\n\n<Mimo\n  name="${feature.sampleName}"\n  size={96}\n  detailLevel="${feature.detailLevel}"\n/>`;
  const copyStatus = copyResult?.sampleName === feature.sampleName ? copyResult.status : 'idle';

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyResult({ sampleName: feature.sampleName, status: 'copied' });
    } catch {
      setCopyResult({ sampleName: feature.sampleName, status: 'error' });
    }
  }

  return (
    <aside
      className='rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'
      aria-labelledby='component-feature-preview-title'
    >
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-[0.6875rem] font-medium uppercase tracking-[0.13em] text-foreground-tertiary'>
            {t('preview.eyebrow')}
          </p>
          <h3
            id='component-feature-preview-title'
            className='mt-1 text-xl font-medium tracking-[-0.02em] text-heading'
          >
            {featureLabel}
          </h3>
        </div>
        <span className='rounded-full bg-surface-badge px-2.5 py-1 text-[0.6875rem] text-foreground-secondary'>
          {groupLabel}
        </span>
      </div>

      <p className='mt-2 text-xs leading-relaxed text-foreground-secondary'>
        {t('preview.description', { feature: featureLabel, group: groupLabel })}
      </p>

      <div className='mt-4 flex min-h-48 items-center justify-center rounded-2xl border border-border bg-background p-5'>
        <Mimo
          aria-hidden={true}
          data-explorer-avatar='true'
          name={feature.sampleName}
          size={136}
          shape='squircle'
          detailLevel={feature.detailLevel}
          depth='medium'
          animations={['blink', 'float']}
          interactive={false}
        />
      </div>

      <div className='mt-4 rounded-xl border border-border bg-code-background p-2.5'>
        <div className='flex items-center justify-between gap-2 px-1'>
          <span className='text-[0.6875rem] font-medium text-foreground-tertiary'>React</span>
          <button
            type='button'
            onClick={copyCode}
            className='rounded-md px-2 py-1 text-[0.6875rem] font-medium text-foreground-secondary transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
          >
            {copyStatus === 'copied' ? t('preview.copied') : t('preview.copyCode')}
          </button>
        </div>
        <CodeBlock>{code}</CodeBlock>
        <p className='sr-only' aria-live='polite'>
          {copyStatus === 'copied'
            ? t('preview.copySuccess')
            : copyStatus === 'error'
              ? t('preview.copyError')
              : ''}
        </p>
      </div>

      <LocaleLink
        href={{
          pathname: '/playground',
          query: {
            name: feature.sampleName,
            detailLevel: feature.detailLevel,
            depth: 'medium',
          },
        }}
        className='mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
      >
        {t('preview.tryInPlayground')}
        <span aria-hidden='true'>→</span>
      </LocaleLink>
    </aside>
  );
}
