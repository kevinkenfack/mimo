'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useTheme } from '../hooks/use-theme';
import { IconAppearanceDarkMode, IconAppearanceLightMode } from '../lib/icons';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const t = useTranslations('themeToggle');
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden='true'
        className={`inline-flex h-7 w-7 items-center justify-center p-1 text-foreground-quaternary ${className}`}
      >
        <span className='h-4 w-4 block' />
      </span>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={isDark ? t('switchToLight') : t('switchToDark')}
      title={isDark ? t('switchToLight') : t('switchToDark')}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md p-1 text-foreground-quaternary transition-colors hover:text-foreground-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary cursor-pointer ${className}`}
    >
      {isDark ? (
        <IconAppearanceLightMode className='h-4 w-4' />
      ) : (
        <IconAppearanceDarkMode className='h-4 w-4' />
      )}
    </button>
  );
}
