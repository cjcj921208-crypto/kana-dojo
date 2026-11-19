'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import type { VerbInfo } from '../types';

interface SEOContentProps {
  /** Optional verb info for verb-specific content */
  verb?: VerbInfo;
}

/**
 * SEOContent - Educational content about Japanese verb conjugation
 *
 * This section is visible page body content (not hidden SEO text), so all
 * copy comes from the `conjugator.seo.*` translations.
 */
export default function SEOContent({ verb }: SEOContentProps) {
  const t = useTranslations('conjugator');

  return (
    <section className='flex flex-col gap-8 py-12'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2 text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase'>
          <div className='h-[1px] w-4 bg-(--main-color)' />
          <span>{t('seo.badge')}</span>
        </div>
        <h2 className='text-2xl font-bold tracking-tight text-(--main-color)'>
          {t('seo.title')}
        </h2>
      </div>

      <div className='max-w-3xl text-(--secondary-color)/70'>
        <p className='text-base font-medium'>{t('seo.shortIntro')}</p>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold text-blue-500'>
            {t('seo.verbTypesGodan.title')}
          </h3>
          <p className='text-sm text-(--secondary-color)/60'>
            {t('seo.verbTypesGodan.shortDescription')}
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold text-green-500'>
            {t('seo.verbTypesIchidan.title')}
          </h3>
          <p className='text-sm text-(--secondary-color)/60'>
            {t('seo.verbTypesIchidan.shortDescription')}
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold text-purple-500'>
            {t('seo.verbTypesIrregular.title')}
          </h3>
          <p className='text-sm text-(--secondary-color)/60'>
            {t('seo.verbTypesIrregular.shortDescription')}
          </p>
        </div>
      </div>

      <div className='border-t border-(--border-color)/10 pt-8'>
        <p className='text-xs text-(--secondary-color)/40'>
          {t('seo.footerNote')}
        </p>
      </div>
    </section>
  );
}
