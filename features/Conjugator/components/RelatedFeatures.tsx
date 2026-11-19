'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Keyboard,
  Book,
  BookOpen,
  BrainCircuit,
  Sparkles,
  Zap,
  Layout,
  Info,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/utils/utils';
import { ReactNode } from 'react';

interface InternalLink {
  href: string;
  icon: ReactNode;
  id: 'kana' | 'kanji' | 'gauntlet';
}

const links: InternalLink[] = [
  {
    id: 'kana',
    href: '/kana',
    icon: <Keyboard className='h-4 w-4' />,
  },
  {
    id: 'kanji',
    href: '/kanji',
    icon: <BookOpen className='h-4 w-4' />,
  },
  {
    id: 'gauntlet',
    href: '/gauntlet',
    icon: <Zap className='h-4 w-4' />,
  },
];

export default function RelatedFeatures() {
  const t = useTranslations('conjugator');
  const pathname = usePathname();

  const getLocalizedHref = (href: string) => {
    const locale = pathname.split('/')[1];
    return `/${locale}${href}`;
  };

  return (
    <section
      className='flex flex-col gap-6 pt-12'
      aria-labelledby='related-heading'
    >
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2 text-[10px] font-bold tracking-widest text-(--secondary-color)/40 uppercase'>
          <div className='h-[1px] w-4 bg-(--main-color)' />
          <span>{t('relatedFeatures.badge')}</span>
        </div>
        <h2
          id='related-heading'
          className='text-xl font-bold tracking-tight text-(--main-color)'
        >
          {t('relatedFeatures.heading')}
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {links.map(link => (
          <Link
            key={link.id}
            href={getLocalizedHref(link.href)}
            className='group flex flex-col gap-2 rounded-lg border border-(--border-color)/5 p-4 transition-colors duration-200 hover:bg-(--main-color)/5'
          >
            <div className='flex items-center gap-2 text-(--main-color)'>
              {link.icon}
              <span className='text-sm font-bold'>
                {t(`relatedFeatures.links.${link.id}.title`)}
              </span>
            </div>
            <p className='text-xs leading-relaxed text-(--secondary-color)/60'>
              {t(`relatedFeatures.links.${link.id}.description`)}
            </p>
          </Link>
        ))}
      </div>

      <div className='pt-8 text-center text-[10px] font-bold tracking-widest text-(--secondary-color)/20 uppercase'>
        {t('relatedFeatures.tagline')}
      </div>
    </section>
  );
}
