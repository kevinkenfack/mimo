'use client';

import type { ReactNode } from 'react';
import { IconGrip, IconUndo } from '@/lib/icons';

interface PlaygroundCardProps {
  title: string;
  badge?: ReactNode;
  onReset?: () => void;
  resetTitle?: string;
  children: ReactNode;
  className?: string;
}

export function PlaygroundCard({
  title,
  badge,
  onReset,
  resetTitle = 'Reset section',
  children,
  className = '',
}: PlaygroundCardProps) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface-raised p-3.5 sm:p-4 shadow-xs transition-colors ${className}`}
    >
      <header className='flex items-center justify-between pb-3 text-xs'>
        <div className='flex items-center gap-2 text-foreground-secondary'>
          <IconGrip className='size-3.5 text-foreground-tertiary/70' aria-hidden='true' />
          <h3 className='font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-heading'>
            {title}
          </h3>
        </div>
        <div className='flex items-center gap-2'>
          {badge}
          {onReset && (
            <button
              type='button'
              onClick={onReset}
              title={resetTitle}
              aria-label={resetTitle}
              className='grid size-6 place-items-center rounded-md text-foreground-tertiary transition-colors hover:bg-surface hover:text-heading focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50'
            >
              <IconUndo className='size-3.5' aria-hidden='true' />
            </button>
          )}
        </div>
      </header>
      <div className='space-y-3'>{children}</div>
    </section>
  );
}
