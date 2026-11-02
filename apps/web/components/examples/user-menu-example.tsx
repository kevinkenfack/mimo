'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IconChevronDown } from '@/lib/icons';

export function UserMenuExample() {
  const t = useTranslations('examples.menu');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const items = [
    { key: 'profile', label: t('items.profile') },
    { key: 'settings', label: t('items.settings') },
    { key: 'help', label: t('items.help') },
    { key: 'signOut', label: t('items.signOut') },
  ] as const;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <section className='min-w-0' aria-labelledby='examples-menu-title'>
      <h2
        id='examples-menu-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'>
        <nav
          aria-label={t('navigationLabel')}
          className='flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-3 py-2'
        >
          <span className='text-sm font-medium tracking-[-0.01em] text-heading'>Mimo</span>
          <div className='flex items-center gap-3'>
            <span className='text-xs text-foreground-secondary'>{t('workspace')}</span>
            <div ref={menuRef} className='relative'>
              <button
                ref={triggerRef}
                type='button'
                aria-label={isOpen ? t('closeMenu') : t('openMenu')}
                aria-expanded={isOpen}
                aria-controls='examples-account-menu'
                className='inline-flex min-h-9 items-center gap-1 rounded-full border border-border bg-surface-raised p-1 pr-2 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
                onClick={() => setIsOpen((open) => !open)}
              >
                <span aria-hidden='true' className='shrink-0'>
                  <Mimo name='Nova' size={32} shape='circle' mood='happy' detailLevel='basic' />
                </span>
                <IconChevronDown
                  aria-hidden='true'
                  className='h-3.5 w-3.5 shrink-0 text-foreground-tertiary'
                />
              </button>

              {isOpen && (
                <section
                  id='examples-account-menu'
                  aria-labelledby='examples-account-menu-label'
                  className='absolute top-full right-0 z-10 mt-2 w-56 rounded-2xl border border-border bg-surface-raised p-2'
                >
                  <h3 id='examples-account-menu-label' className='sr-only'>
                    {t('menuLabel')}
                  </h3>
                  <div className='flex items-center gap-3 rounded-xl px-2 py-2'>
                    <span aria-hidden='true' className='shrink-0'>
                      <Mimo name='Nova' size={40} shape='circle' mood='happy' detailLevel='basic' />
                    </span>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-heading'>Nova</p>
                      <p className='truncate text-xs text-foreground-tertiary'>{t('email')}</p>
                    </div>
                  </div>
                  <ul className='mt-1 flex flex-col gap-0.5 border-t border-divider pt-2'>
                    {items.map((item) => (
                      <li key={item.key}>
                        <button
                          type='button'
                          className='min-h-9 w-full rounded-xl px-3 text-left text-sm text-foreground-secondary transition-colors hover:bg-surface hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
