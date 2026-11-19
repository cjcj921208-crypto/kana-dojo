'use client';

import { useState, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Edit3,
  Languages,
  XCircle,
  History,
  Lightbulb,
  Zap,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  GitBranch,
  Heart,
  PlayCircle,
  Crown,
  FileText,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import type {
  ConjugationCategory as CategoryType,
  ConjugationForm,
} from '../types';

interface ConjugationCategoryProps {
  /** Category identifier */
  category: CategoryType;
  /** Forms in this category */
  forms: ConjugationForm[];
  /** Whether the category is expanded */
  isExpanded: boolean;
  /** Callback when category is toggled */
  onToggle: () => void;
  /** Callback when a form is copied */
  onCopy: (form: ConjugationForm) => void;
}

/**
 * ConjugationCategory - Collapsible card displaying conjugation forms by category
 *
 * Features:
 * - Collapsible card with smooth animation
 * - Category name in English and Japanese
 * - Forms with kanji, hiragana, romaji
 * - Copy button for each form
 * - Hover/focus highlighting
 * - Proper ARIA labels and roles
 *
 * Requirements: 5.2, 5.3, 5.7, 6.1, 10.2
 */
export default function ConjugationCategory({
  category,
  forms,
  isExpanded,
  onToggle,
  onCopy,
}: ConjugationCategoryProps) {
  const t = useTranslations('conjugator');
  const categoryStyle = getCategoryStyle(category);
  const isKnownCategory = categoryStyle !== null;
  const categoryName = isKnownCategory
    ? t(`categories.${category}.name`)
    : category;
  const categoryNameJa = isKnownCategory
    ? t(`categories.${category}.nameJa`)
    : category;
  const colorClass = categoryStyle?.colorClass ?? 'text-gray-500';
  const color = categoryStyle?.color ?? '#6b7280';
  const formsLabel = `${forms.length} ${
    forms.length === 1 ? t('forms.form') : t('forms.forms')
  }`;

  if (forms.length === 0) {
    return null;
  }

  return (
    <div
      className='group flex flex-col transition-all duration-1000'
      role='listitem'
    >
      {/* Category header - Pure Alignment */}
      <div
        className='flex items-center justify-between border-b border-(--border-color)/10 py-4'
        aria-label={`${categoryName} (${categoryNameJa}), ${formsLabel}.`}
      >
        <div className='flex items-center gap-4'>
          <div
            className={cn('h-1.5 w-1.5 rounded-full', colorClass)}
            style={{ backgroundColor: color }}
            aria-hidden='true'
          />

          <div className='flex items-center gap-4'>
            <h4 className='text-xl font-bold tracking-tight text-(--main-color)'>
              {categoryName}
            </h4>
            <span className='font-japanese text-xs font-bold text-(--main-color) opacity-20'>
              {categoryNameJa}
            </span>
          </div>
        </div>
      </div>

      <div
        id={`category-${category}`}
        className='opacity-100'
        role='region'
        aria-label={`${categoryName}: ${formsLabel}`}
      >
        <div
          className='flex flex-col'
          role='list'
          aria-label={`${categoryName}: ${formsLabel}`}
        >
          {forms.map((form, index) => (
            <FormRow key={form.id} form={form} onCopy={onCopy} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual form row component
 */
function FormRow({
  form,
  onCopy,
  index,
}: {
  form: ConjugationForm;
  onCopy: (form: ConjugationForm) => void;
  index: number;
}) {
  const t = useTranslations('conjugator');
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    onCopy(form);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [form, onCopy]);

  return (
    <div
      className={cn(
        'group flex items-center justify-between gap-4 py-3 transition-colors duration-200',
        'border-b border-(--border-color)/5 last:border-0',
      )}
      role='listitem'
    >
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <div className='flex items-baseline gap-3'>
          <span
            className='font-japanese text-xl font-bold text-(--main-color)'
            lang='ja'
          >
            {form.kanji}
          </span>
          {form.kanji !== form.hiragana && (
            <span
              className='font-japanese text-xl font-medium text-(--secondary-color) opacity-30'
              lang='ja'
            >
              {form.hiragana}
            </span>
          )}
        </div>
        <div className='flex flex-wrap items-center gap-6'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-black tracking-[0.4em] text-(--secondary-color) uppercase opacity-40'>
              {form.name}
            </span>
          </div>
          <div className='h-3 w-[1px] bg-(--border-color)/20' />
          <span className='font-mono text-[11px] font-bold tracking-widest text-(--secondary-color) opacity-30'>
            {form.romaji}
          </span>
          {form.formality === 'polite' && (
            <div className='flex items-center gap-2'>
              <div className='h-1.5 w-1.5 rounded-full bg-blue-500/40' />
              <span className='text-[9px] font-black tracking-[0.3em] text-blue-500/60 uppercase'>
                {t('forms.polite')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Copy icon button - Pure Icon */}
      <button
        onClick={handleCopy}
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center transition-all duration-500 active:scale-90',
          'text-(--secondary-color) opacity-0 group-hover:opacity-100 focus:opacity-100',
          copied && 'text-green-500 opacity-100',
        )}
        aria-label={copied ? t('results.copied') : t('forms.copy')}
      >
        {copied ? (
          <Check className='h-6 w-6' aria-hidden='true' />
        ) : (
          <Copy
            className='h-5 w-5 hover:text-(--main-color)'
            aria-hidden='true'
          />
        )}
      </button>
    </div>
  );
}

/**
 * Get display styling for a category (names come from translations)
 */
function getCategoryStyle(category: CategoryType): {
  colorClass: string;
  color: string;
} | null {
  const categories: Record<CategoryType, { colorClass: string; color: string }> = {
    basic: {
      colorClass: 'text-blue-500',
      color: '#3b82f6',
    },
    polite: {
      colorClass: 'text-purple-500',
      color: '#a855f7',
    },
    negative: {
      colorClass: 'text-red-500',
      color: '#ef4444',
    },
    past: {
      colorClass: 'text-amber-500',
      color: '#f59e0b',
    },
    volitional: {
      colorClass: 'text-cyan-500',
      color: '#06b6d4',
    },
    potential: {
      colorClass: 'text-green-500',
      color: '#22c55e',
    },
    passive: {
      colorClass: 'text-indigo-500',
      color: '#6366f1',
    },
    causative: {
      colorClass: 'text-orange-500',
      color: '#f97316',
    },
    'causative-passive': {
      colorClass: 'text-pink-500',
      color: '#ec4899',
    },
    imperative: {
      colorClass: 'text-yellow-500',
      color: '#eab308',
    },
    conditional: {
      colorClass: 'text-teal-500',
      color: '#14b8a6',
    },
    'tai-form': {
      colorClass: 'text-rose-500',
      color: '#f43f5e',
    },
    progressive: {
      colorClass: 'text-sky-500',
      color: '#0ea5e9',
    },
    honorific: {
      colorClass: 'text-violet-500',
      color: '#8b5cf6',
    },
  };

  return categories[category] ?? null;
}
