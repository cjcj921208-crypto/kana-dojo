'use client';
import clsx from 'clsx';
import { useState } from 'react';
import { useClick } from '@/shared/hooks/generic/useAudio';
import { cardBorderStyles } from '@/shared/utils/styles';
import { ChevronUp } from 'lucide-react';
import translationGen from '@/shared/utils/info';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { removeLocaleFromPath } from '@/shared/utils/pathUtils';
import { useTranslations } from 'next-intl';
import DevNotice from '@/shared/ui-composite/misc/DevNotice';
import RandomFact from '@/shared/ui-composite/misc/RandomFact';
// Temporarily disabled AdSense placement.
// import AdSenseDisplay from '@/shared/ui-composite/Ads/AdSenseDisplay';
// const KANA_INFO_AD_SLOT = '5772398513';
// const isKanaInfoAdEnabled =
//   process.env.NODE_ENV === 'production' &&
//   process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

const Info = () => {
  const pathname = usePathname();
  const t = useTranslations('menuInfo');
  const tKana = useTranslations('kana');
  const tKanji = useTranslations('kanji');
  const tVocabulary = useTranslations('vocabulary');

  // Remove locale from pathname (e.g., /en/kana -> /kana)
  const pathWithoutLocale = removeLocaleFromPath(pathname);
  const normalizedPath = pathWithoutLocale.startsWith('/kana/')
    ? '/kana'
    : pathWithoutLocale.startsWith('/kanji/')
      ? '/kanji'
      : pathWithoutLocale.startsWith('/vocabulary/')
        ? '/vocabulary'
        : pathWithoutLocale;

  // Get translations object, passing the translation function
  const translations = translationGen(t);

  // Get page data with fallback to home
  const pageData =
    translations[normalizedPath as keyof typeof translations] ||
    translations['/'];

  // Provide default values to avoid destructuring undefined
  const { header, content } = pageData || { header: '', content: '' };

  // Dojo intro copy lives in the kana/kanji/vocabulary namespaces
  // (translationGen's entries for these routes are legacy hard-coded English).
  const dojoInfo =
    normalizedPath === '/kana'
      ? {
          header: <span>{tKana('info.header')}</span>,
          content: (
            <>
              <p className='text-lg text-(--secondary-color)'>
                {tKana('info.description')}
              </p>
              <p className='text-lg text-(--secondary-color)'>
                {tKana.rich('info.instructions', {
                  b: chunks => <b>{chunks}</b>,
                })}
              </p>
            </>
          ),
        }
      : normalizedPath === '/kanji'
        ? {
            header: <span>{tKanji('info.header')}</span>,
            content: (
              <>
                <p className='text-lg text-(--secondary-color)'>
                  {tKanji('info.description')}
                </p>
                <p className='text-lg text-(--secondary-color)'>
                  {tKanji.rich('info.instructions', {
                    b: chunks => <b>{chunks}</b>,
                  })}
                </p>
                <p className='text-lg italic'>
                  {tKanji('info.tip')}{' '}
                  <a
                    href='http://kanjiheatmap.com/'
                    className='hover:underline'
                    rel='noopener'
                    target='_blank'
                  >
                    Kanji Heatmap!
                  </a>
                </p>
              </>
            ),
          }
        : normalizedPath === '/vocabulary'
          ? {
              header: <span>{tVocabulary('info.header')}</span>,
              content: (
                <>
                  <p className='text-lg text-(--secondary-color)'>
                    {tVocabulary('info.description')}
                  </p>
                  <p className='text-lg text-(--secondary-color)'>
                    {tVocabulary.rich('info.instructions', {
                      b: chunks => <b>{chunks}</b>,
                    })}
                  </p>
                  <p className='text-lg italic'>
                    {tVocabulary('info.tip')}{' '}
                    <a
                      href='https://jisho.org/'
                      className='hover:underline'
                      rel='noopener'
                      target='_blank'
                    >
                      Jisho!
                    </a>
                  </p>
                </>
              ),
            }
          : null;
  const displayHeader = dojoInfo ? dojoInfo.header : header;
  const displayContent = dojoInfo ? dojoInfo.content : content;

  const { playClick } = useClick();

  const [showInfo, setShowInfo] = useState(
    [
      '/kana',
      '/kana/learn-hiragana',
      '/kana/learn-katakana',
      '/kanji',
      '/vocabulary',
      '/',
      '/sentences',
    ].includes(normalizedPath)
      ? true
      : false,
  );

  return (
    <>
      <div
        className={clsx(
          'flex w-full flex-col gap-1 overflow-hidden rounded-2xl p-4',
          cardBorderStyles,
        )}
      >
        <motion.h3
          className={clsx(
            'group text-xl hover:cursor-pointer',
            'flex flex-row items-center gap-1',
          )}
          onClick={() => {
            playClick();
            setShowInfo(showInfo => !showInfo);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'linear' }}
        >
          <ChevronUp
            className={clsx(
              'duration-250',
              'text-(--border-color)',
              'max-md:group-active:text-(--secondary-color)',
              'md:group-hover:text-(--secondary-color)',
              !showInfo && 'rotate-180',
            )}
            size={24}
          />
          {displayHeader}
        </motion.h3>
        <motion.div
          className={clsx(
            'overflow-hidden duration-300',
            showInfo ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
            // 'text-(--secondary-color)'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'linear' }}
        >
          {displayContent}
          {normalizedPath === '/' && (
            <>
              <DevNotice />
              <RandomFact />
            </>
          )}
        </motion.div>
      </div>
      {/* {normalizedPath === '/kana' &&
        isKanaInfoAdEnabled &&
        KANA_INFO_AD_SLOT && (
          <div className='mt-4 w-full'>
            <AdSenseDisplay slot={KANA_INFO_AD_SLOT} />
          </div>
        )} */}
    </>
  );
};

export default Info;

