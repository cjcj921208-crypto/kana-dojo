'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import type { VerbInfo, VerbType, IrregularType } from '../types';

interface VerbInfoCardProps {
  /** Verb information from classification */
  verb: VerbInfo;
}

/** Translation key suffix under `verbTypes.*` for each verb classification */
type VerbTypeKey =
  | 'godan'
  | 'ichidan'
  | 'irregular'
  | 'suru'
  | 'kuru'
  | 'aru'
  | 'iku'
  | 'honorific'
  | 'unknown';

/**
 * VerbInfoCard - Displays detected verb type and stem information
 *
 * Features:
 * - Shows verb type (Godan/Ichidan/Irregular)
 * - Displays verb stem
 * - Expandable section with conjugation rule explanation
 * - Proper ARIA labels and roles
 *
 * Requirements: 9.1, 9.2, 9.3, 10.2
 */
export default function VerbInfoCard({ verb }: VerbInfoCardProps) {
  const t = useTranslations('conjugator');
  const [isExpanded, setIsExpanded] = useState(false);

  const { key: verbTypeKey, colorClass } = getVerbTypeInfo(
    verb.type,
    verb.irregularType,
  );
  const verbTypeLabel = t(`verbTypes.${verbTypeKey}.label`);
  const verbTypeDescription = t(`verbTypes.${verbTypeKey}.description`);
  const verbTypeRules = t.raw(`verbTypes.${verbTypeKey}.rules`) as string[];

  return (
    <div
      className='flex flex-col gap-6'
      role='region'
      aria-label={t('accessibility.verbInfoRegion', {
        verb: verb.dictionaryForm,
      })}
    >
      {/* Main info header */}
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <span className='text-[10px] font-bold tracking-widest text-(--secondary-color) uppercase opacity-50'>
                {t('verbInfo.dictionaryEntry')}
              </span>
              <div className='h-[1px] w-8 bg-(--main-color)/10' />
            </div>

            <div className='flex flex-col'>
              <h3
                className='font-japanese text-3xl font-bold text-(--main-color) sm:text-4xl'
                lang='ja'
              >
                {verb.dictionaryForm}
              </h3>
              <div className='flex items-center gap-4 text-base font-medium text-(--secondary-color) opacity-60'>
                <span className='font-japanese' lang='ja'>
                  {verb.reading}
                </span>
                <span className='opacity-20'>/</span>
                <span className='italic'>{verb.romaji}</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end gap-1 pb-2 text-right'>
            <span className='text-[10px] font-bold tracking-widest text-(--main-color) uppercase opacity-30'>
              {t('verbInfo.statusLabel')}
            </span>
            <span className='text-xl font-bold tracking-tight text-(--main-color)/80'>
              {t('verbInfo.verifiedAnalysis')}
            </span>
          </div>
        </div>

        <div
          className='flex flex-wrap items-center gap-8'
          role='group'
          aria-label={t('accessibility.classificationDetails')}
        >
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase'>
              {t('verbInfo.type')}
            </span>
            <span className={cn('text-xl font-bold', colorClass)}>
              {verbTypeLabel}
            </span>
          </div>

          <div className='hidden h-8 w-[1px] bg-(--border-color)/10 sm:block' />

          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase'>
              {t('verbInfo.stem')}
            </span>
            <span
              className='font-japanese text-xl font-bold text-(--main-color)'
              lang='ja'
            >
              {verb.stem || '—'}
            </span>
          </div>

          <div className='hidden h-8 w-[1px] bg-(--border-color)/10 sm:block' />

          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase'>
              {t('verbInfo.ending')}
            </span>
            <span
              className='font-japanese text-xl font-bold text-(--main-color)'
              lang='ja'
            >
              {verb.ending || '—'}
            </span>
          </div>
        </div>

        {/* Compound Alert - Minimalist Integrated Line */}
        {verb.compoundPrefix && (
          <div className='flex items-center gap-8 border-l border-(--main-color)/20 py-2 pl-8'>
            <div className='flex h-2 w-2 rounded-full bg-(--main-color)' />
            <div className='flex items-baseline gap-4'>
              <span className='text-[10px] font-black tracking-widest text-(--main-color) uppercase opacity-40'>
                {t('verbInfo.compoundPrefix')}
              </span>
              <span
                className='font-japanese text-xl font-black text-(--main-color) opacity-80'
                lang='ja'
              >
                {verb.compoundPrefix}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Conjugation Rules */}
      <section className='border-t border-(--border-color)/10 pt-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <h4 className='text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase'>
              {t('verbInfo.conjugationRules')}
            </h4>
            <p className='text-base font-medium text-(--secondary-color)/70'>
              {verbTypeDescription}
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {verbTypeRules.map((rule, idx) => (
              <div
                key={idx}
                className='flex gap-3 text-sm font-medium text-(--secondary-color)/60'
              >
                <span className='text-(--main-color)/20'>{idx + 1}.</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Get the translation key and color for a verb type.
 * Labels, descriptions and rules live in `verbTypes.*` translations.
 */
function getVerbTypeInfo(
  type: VerbType,
  irregularType?: IrregularType,
): {
  key: VerbTypeKey;
  colorClass: string;
} {
  if (type === 'irregular' && irregularType) {
    return getIrregularTypeInfo(irregularType);
  }

  switch (type) {
    case 'godan':
      return { key: 'godan', colorClass: 'text-blue-500' };
    case 'ichidan':
      return { key: 'ichidan', colorClass: 'text-green-500' };
    case 'irregular':
      return { key: 'irregular', colorClass: 'text-purple-500' };
    default:
      return { key: 'unknown', colorClass: 'text-(--secondary-color)' };
  }
}

/**
 * Get the translation key and color for specific irregular verb types
 */
function getIrregularTypeInfo(irregularType: IrregularType): {
  key: VerbTypeKey;
  colorClass: string;
} {
  switch (irregularType) {
    case 'suru':
      return { key: 'suru', colorClass: 'text-purple-500' };
    case 'kuru':
      return { key: 'kuru', colorClass: 'text-purple-500' };
    case 'aru':
      return { key: 'aru', colorClass: 'text-orange-500' };
    case 'iku':
      return { key: 'iku', colorClass: 'text-orange-500' };
    case 'honorific':
      return { key: 'honorific', colorClass: 'text-pink-500' };
    default:
      return { key: 'irregular', colorClass: 'text-purple-500' };
  }
}
