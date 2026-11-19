'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import type { FAQItem } from '../lib/seo/structuredData';

interface FAQProps {
  /** Optional custom FAQ items (defaults to the translated `faq.items`) */
  items?: FAQItem[];
  /** Maximum number of items to display initially */
  initialDisplayCount?: number;
}

/**
 * FAQ - Comprehensive FAQ section with pretty collapsible cards
 *
 * Visible questions/answers come from the `conjugator.faq.items`
 * translations so they follow the active locale. The English constants in
 * lib/seo/structuredData are only used for SEO structured data.
 */
export default function FAQ({
  items,
  initialDisplayCount = 10,
}: FAQProps) {
  const t = useTranslations('conjugator');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const faqItems = items ?? (t.raw('faq.items') as FAQItem[]);
  const displayedItems = showAll
    ? faqItems
    : faqItems.slice(0, initialDisplayCount);
  const hasMoreItems = faqItems.length > initialDisplayCount;

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedItems(new Set(displayedItems.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <section
      className='mt-20 flex flex-col gap-12'
      aria-labelledby='faq-heading'
      itemScope
      itemType='https://schema.org/FAQPage'
    >
      <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2 text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase'>
            <div className='h-[1px] w-4 bg-(--main-color)' />
            <span>{t('faq.badge')}</span>
          </div>
          <h2
            id='faq-heading'
            className='text-2xl font-bold tracking-tight text-(--main-color) sm:text-3xl'
          >
            {t('faq.title')}
          </h2>
        </div>

        <div className='flex items-center gap-6'>
          <button
            onClick={expandAll}
            className='text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase transition-colors hover:text-(--main-color)'
          >
            {t('faq.expandAll')}
          </button>
          <div className='h-3 w-[1px] bg-(--border-color)/20' />
          <button
            onClick={collapseAll}
            className='text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase transition-colors hover:text-(--main-color)'
          >
            {t('faq.collapseAll')}
          </button>
        </div>
      </div>

      <div
        className='grid grid-cols-1 gap-4'
        role='list'
        aria-label={t('faq.listAria')}
      >
        {displayedItems.map((item, index) => (
          <FAQItemComponent
            key={index}
            item={item}
            index={index}
            isExpanded={expandedItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>

      {hasMoreItems && (
        <div className='flex justify-center py-4'>
          <button
            onClick={() => setShowAll(!showAll)}
            className='rounded-full border border-(--main-color)/10 px-6 py-2 text-[10px] font-bold tracking-widest text-(--main-color) uppercase transition-colors hover:bg-(--main-color)/5'
          >
            {showAll
              ? t('faq.showLess')
              : t('faq.showMore', {
                  count: faqItems.length - initialDisplayCount,
                })}
          </button>
        </div>
      )}
    </section>
  );
}

/**
 * Individual FAQ item component - Pretty Card Style
 */
function FAQItemComponent({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations('conjugator');
  const answerId = `faq-answer-${index}`;

  return (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border border-(--border-color)/5 transition-all duration-300',
        isExpanded
          ? 'border-(--main-color)/10 bg-(--main-color)/5'
          : 'hover:bg-(--main-color)/2',
      )}
      itemScope
      itemProp='mainEntity'
      itemType='https://schema.org/Question'
      role='listitem'
    >
      <button
        onClick={onToggle}
        className='flex w-full items-center justify-between gap-6 p-6 text-left focus:outline-none'
        aria-expanded={isExpanded}
        aria-controls={answerId}
      >
        <span className='text-lg font-bold tracking-tight text-(--main-color) sm:text-xl'>
          {item.question}
        </span>
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
            isExpanded
              ? 'rotate-180 bg-(--main-color) text-white'
              : 'bg-(--main-color)/10 text-(--main-color)',
          )}
          aria-hidden='true'
        >
          <ChevronDown className='h-4 w-4' />
        </div>
      </button>

      <div
        id={answerId}
        className={cn(
          'grid transition-all duration-500 ease-in-out',
          isExpanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
        role='region'
        aria-label={t('faq.answerTo', { question: item.question })}
      >
        <div className='overflow-hidden'>
          <div className='px-6 pt-0 pb-6'>
            <p className='text-base leading-relaxed font-medium text-(--secondary-color)/70'>
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
