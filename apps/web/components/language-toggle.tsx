'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('languageToggle');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetLocale = locale === 'fr' ? 'en' : 'fr';
  const label = targetLocale === 'fr' ? t('switchToFrench') : t('switchToEnglish');

  function switchLocale() {
    const query = Object.fromEntries(searchParams.entries());
    const href = Object.keys(query).length > 0 ? { pathname, query } : pathname;
    router.replace(href, { locale: targetLocale });
  }

  return (
    <button
      type='button'
      onClick={switchLocale}
      aria-label={label}
      title={label}
      lang={targetLocale}
      className='inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-md px-1.5 font-mono text-[0.625rem] font-medium tracking-wide text-foreground-quaternary transition-colors hover:text-foreground-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground-quaternary'
    >
      {targetLocale.toUpperCase()}
    </button>
  );
}
