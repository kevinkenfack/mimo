'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../hooks/use-theme';
import { IconAppearanceDarkMode, IconAppearanceLightMode } from '../lib/icons';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
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
        <span className='h-4.5 w-4.5 block' />
      </span>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      title={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md p-1 text-foreground-quaternary transition-colors hover:text-foreground-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary cursor-pointer ${className}`}
    >
      {isDark ? (
        <IconAppearanceLightMode className='h-4.5 w-4.5' />
      ) : (
        <IconAppearanceDarkMode className='h-4.5 w-4.5' />
      )}
    </button>
  );
}
