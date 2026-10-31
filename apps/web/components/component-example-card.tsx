'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { IconCheck, IconChevronDown, IconCopy } from '@/lib/icons';

type ComponentExampleCardProps = {
  id: string;
  title: string;
  description: string;
  code: string;
  children: ReactNode;
  className?: string;
};

type CopyStatus = 'idle' | 'copied' | 'error';

export function ComponentExampleCard({
  id,
  title,
  description,
  code,
  children,
  className = '',
}: ComponentExampleCardProps) {
  const t = useTranslations('components.examples.controls');
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const codeId = `${id}-code`;

  async function copyCode() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(code);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  }

  return (
    <article
      className={`min-w-0 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5 ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <header className='min-w-0'>
        <h3 id={`${id}-title`} className='break-words text-lg font-semibold tracking-[-0.02em] text-heading'>
          {title}
        </h3>
        <p className='mt-1 max-w-2xl text-xs leading-relaxed text-foreground-secondary sm:text-sm'>
          {description}
        </p>
      </header>

      <div className='mt-4 min-w-0 rounded-2xl border border-border bg-background p-3 sm:p-4'>{children}</div>

      <div className='mt-4 min-w-0 border-t border-divider pt-3'>
        <div className='flex min-w-0 flex-wrap items-center justify-between gap-2'>
          <button
            type='button'
            aria-expanded={isCodeOpen}
            aria-controls={codeId}
            onClick={() => setIsCodeOpen((open) => !open)}
            className='group inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-foreground-secondary transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
          >
            <IconChevronDown
              className='size-4 transition-transform group-aria-expanded:rotate-180'
              aria-hidden='true'
            />
            {isCodeOpen ? t('hideCode') : t('viewCode')}
          </button>

          <button
            type='button'
            onClick={copyCode}
            className='inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-heading-secondary transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
          >
            {copyStatus === 'copied' ? (
              <IconCheck className='size-4 shrink-0' aria-hidden='true' />
            ) : (
              <IconCopy className='size-4 shrink-0' aria-hidden='true' />
            )}
            <span className='break-words'>
              {copyStatus === 'copied'
                ? t('copied')
                : copyStatus === 'error'
                  ? t('copyError')
                  : t('copyCode')}
            </span>
          </button>
        </div>

        <div
          id={codeId}
          hidden={!isCodeOpen}
          className='mt-3 min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-code-background p-3'
        >
          <div className='mb-2 flex flex-wrap items-center justify-between gap-2 text-[0.6875rem] text-foreground-tertiary'>
            <span>React · TSX</span>
            <span className='font-mono'>mimo-id/react</span>
          </div>
          <pre className='max-w-full whitespace-pre-wrap break-words text-[0.6875rem] leading-relaxed text-foreground-secondary sm:text-xs'>
            <code className='block max-w-full break-words'>{code}</code>
          </pre>
        </div>

        <output className='sr-only' aria-live='polite'>
          {copyStatus === 'copied' ? t('copySuccess') : copyStatus === 'error' ? t('copyError') : ''}
        </output>
      </div>
    </article>
  );
}
