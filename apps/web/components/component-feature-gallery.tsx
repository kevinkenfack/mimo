'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { COMPONENT_GROUPS, type ComponentFeature, type ComponentGroupId } from '@/lib/component-catalog';

type ComponentFeatureGalleryProps = {
  activeGroupId: ComponentGroupId;
  selectedFeature: ComponentFeature;
  onSelectGroup: (groupId: ComponentGroupId) => void;
  onSelectFeature: (feature: ComponentFeature) => void;
};

export function ComponentFeatureGallery({
  activeGroupId,
  selectedFeature,
  onSelectGroup,
  onSelectFeature,
}: ComponentFeatureGalleryProps) {
  const t = useTranslations('components');
  const activeGroup = COMPONENT_GROUPS.find((group) => group.id === activeGroupId) ?? COMPONENT_GROUPS[0];
  const activeGroupLabel = t(`groups.${activeGroup.id}.label` as never);

  return (
    <div className='min-w-0'>
      <div className='flex flex-wrap gap-2' role='group' aria-label={t('gallery.filtersLabel')}>
        {COMPONENT_GROUPS.map((group) => {
          const isActive = group.id === activeGroupId;
          const label = t(`groups.${group.id}.label` as never);

          return (
            <button
              key={group.id}
              type='button'
              aria-pressed={isActive}
              onClick={() => onSelectGroup(group.id)}
              className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                isActive
                  ? 'border-accent/45 bg-accent/10 text-heading'
                  : 'border-border bg-surface-raised text-foreground-secondary hover:border-border-strong hover:text-heading'
              }`}
            >
              {label}
              <span className='text-[0.6875rem] text-foreground-tertiary'>{group.items.length}</span>
            </button>
          );
        })}
      </div>

      <div className='mb-4 mt-6 flex items-end justify-between gap-4'>
        <div>
          <h3 className='text-base font-medium tracking-[-0.01em] text-heading'>{activeGroupLabel}</h3>
          <p className='mt-1 max-w-lg text-xs leading-relaxed text-foreground-secondary'>
            {t(`groups.${activeGroup.id}.description` as never)}
          </p>
        </div>
        <span className='shrink-0 text-xs text-foreground-tertiary'>
          {t('gallery.variantsCount', { count: activeGroup.items.length })}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3'>
        {activeGroup.items.map((feature) => {
          const isSelected = feature.sampleName === selectedFeature.sampleName;
          const label = t(`items.${activeGroup.id}.${feature.id}` as never);

          return (
            <button
              key={feature.id}
              type='button'
              aria-pressed={isSelected}
              onClick={() => onSelectFeature(feature)}
              className={`group flex min-h-36 flex-col items-center justify-between rounded-2xl border p-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                isSelected
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border bg-surface-raised hover:border-border-strong'
              }`}
            >
              <span className='flex min-h-20 items-center justify-center'>
                <Mimo
                  aria-hidden={true}
                  data-explorer-avatar='true'
                  name={feature.sampleName}
                  size={72}
                  detailLevel={feature.detailLevel}
                  depth='none'
                  interactive={false}
                />
              </span>
              <span className='mt-2 text-[0.8125rem] font-medium text-heading-secondary'>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
