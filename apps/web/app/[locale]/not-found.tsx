'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export default function LocalizedNotFound() {
  const t = useTranslations('notFound');
  const path = usePathname();

  return (
    <main className='flex min-h-svh flex-col items-center justify-center px-6'>
      {/** biome-ignore lint/performance/noImgElement: not needed */}
      <img
        src={`https://api.mimo.sh/${encodeURIComponent(path.replace('/', ''))}?size=96&detailLevel=full&mood=surprised&animations=blink,float`}
        width={96}
        height={96}
        alt={t('imageAlt')}
      />
      <h1 className='[font-family:var(--font-serif),Georgia,serif] mt-6 text-[2rem] leading-[1.2] font-normal tracking-[-0.02em] text-heading'>
        {t('title')}
      </h1>
      <p className='mt-1 text-[0.9375rem] leading-[1.55] text-foreground-tertiary'>{t('description')}</p>
      <Link
        href='/'
        className='mt-6 text-[0.8125rem] font-medium text-accent! transition-colors hover:text-foreground!'
      >
        {t('home')}
      </Link>
    </main>
  );
}
