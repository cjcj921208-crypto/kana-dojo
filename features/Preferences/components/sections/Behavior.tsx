'use client';
import { useTranslations } from 'next-intl';
import usePreferencesStore from '@/features/Preferences/store/usePreferencesStore';
import { useClick } from '@/shared/hooks/generic/useAudio';
import { AudioLines, Ellipsis, Settings2, VolumeX, Volume2 } from 'lucide-react';
import { useJapaneseTTS } from '@/features/Preferences/hooks/useJapaneseTTS';
import { ActionButton } from '@/shared/ui/components/ActionButton';
import CollapsibleSection from '../shared/CollapsibleSection';
// import{Command, KeyboardOff} from 'lucide-react'
// import HotkeyReference from './HotkeyReference';

interface BehaviorProps {
  useNewIconDesign?: boolean;
}

const Behavior = ({ useNewIconDesign = false }: BehaviorProps) => {
  const t = useTranslations('settings');
  const { playClick } = useClick();

  const displayKana = usePreferencesStore(state => state.displayKana);
  const setDisplayKana = usePreferencesStore(state => state.setDisplayKana);
  const silentMode = usePreferencesStore(state => state.silentMode);
  const setSilentMode = usePreferencesStore(state => state.setSilentMode);
  const pronunciationEnabled = usePreferencesStore(
    state => state.pronunciationEnabled,
  );
  const setPronunciationEnabled = usePreferencesStore(
    state => state.setPronunciationEnabled,
  );
  const pronunciationAutoPlay = usePreferencesStore(
    state => state.pronunciationAutoPlay,
  );
  const setPronunciationAutoPlay = usePreferencesStore(
    state => state.setPronunciationAutoPlay,
  );
  const furiganaEnabled = usePreferencesStore(state => state.furiganaEnabled);
  const setFuriganaEnabled = usePreferencesStore(
    state => state.setFuriganaEnabled,
  );
  const showExperimentalModes = usePreferencesStore(
    state => state.showExperimentalModes,
  );
  const setShowExperimentalModes = usePreferencesStore(
    state => state.setShowExperimentalModes,
  );

  // Unused but kept for future TTS voice panel
  const {
    availableVoices,
    currentVoice,
    setVoice,
    speak,
    refreshVoices,
    hasJapaneseVoices,
  } = useJapaneseTTS();

  /*   const hotkeysOn = useThemeStore(state => state.hotkeysOn);
  const setHotkeys = useThemeStore(state => state.setHotkeys);
  const hotkeys = [
    { key: 'Esc', action: 'Back' },
    { key: 'H', action: 'Home' },
    { key: 'P', action: 'Open Preferences' },
    { key: 'Enter \u23CE', action: 'Start Training' },
  ]; */

  const options = [
    {
      section: 'core',
      label: t('behavior.displayKanaLabel'),
      value: displayKana,
      choices: [
        {
          label: <>{t('behavior.romaji')}&nbsp;🇺🇸</>,
          selectedWhen: false,
          onClick: () => setDisplayKana(false),
        },
        {
          label: <>{t('behavior.kana')}&nbsp;🇯🇵</>,
          selectedWhen: true,
          onClick: () => setDisplayKana(true),
        },
      ],
    },
    {
      section: 'core',
      label: t('behavior.furiganaLabel'),
      value: furiganaEnabled,
      choices: [
        {
          label: (
            <>
              <span>{t('behavior.on')}</span>
              <span className='mb-0.5 text-sm'>ふり</span>
            </>
          ),
          selectedWhen: true,
          onClick: () => setFuriganaEnabled(true),
        },
        {
          label: <span>{t('behavior.off')}</span>,
          selectedWhen: false,
          onClick: () => setFuriganaEnabled(false),
        },
      ],
    },
    {
      section: 'core',
      label: t('behavior.soundEffectsLabel'),
      value: silentMode,
      choices: [
        {
          label: (
            <>
              <span>{t('behavior.on')}</span>
              <AudioLines size={20} className='mb-0.5' />
            </>
          ),
          selectedWhen: false,
          onClick: () => setSilentMode(false),
        },
        {
          label: (
            <>
              <span>{t('behavior.off')}</span>
              <VolumeX size={20} className='mb-0.5' />
            </>
          ),
          selectedWhen: true,
          onClick: () => setSilentMode(true),
        },
      ],
    },
    {
      section: 'other',
      label: t('behavior.pronunciationLabel'),
      value: pronunciationEnabled,
      choices: [
        {
          label: (
            <>
              <span>{t('behavior.on')}</span>
              <Volume2 size={20} className='mb-0.5' />
            </>
          ),
          selectedWhen: true,
          onClick: () => setPronunciationEnabled(true),
        },
        {
          label: (
            <>
              <span>{t('behavior.off')}</span>
              <VolumeX size={20} className='mb-0.5' />
            </>
          ),
          selectedWhen: false,
          onClick: () => setPronunciationEnabled(false),
        },
      ],
    },
    {
      section: 'other',
      label: t('behavior.pronunciationAutoPlayLabel'),
      value: pronunciationAutoPlay,
      choices: [
        {
          label: (
            <>
              <span>{t('behavior.on')}</span>
              <Volume2 size={20} className='mb-0.5' />
            </>
          ),
          selectedWhen: true,
          onClick: () => setPronunciationAutoPlay(true),
        },
        {
          label: (
            <>
              <span>{t('behavior.off')}</span>
              <VolumeX size={20} className='mb-0.5' />
            </>
          ),
          selectedWhen: false,
          onClick: () => setPronunciationAutoPlay(false),
        },
      ],
    },
    {
      section: 'other',
      label: t('behavior.experimentalModesLabel'),
      value: showExperimentalModes,
      choices: [
        {
          label: <span>{t('behavior.on')}</span>,
          selectedWhen: true,
          onClick: () => setShowExperimentalModes(true),
        },
        {
          label: <span>{t('behavior.off')}</span>,
          selectedWhen: false,
          onClick: () => setShowExperimentalModes(false),
        },
      ],
    },
  ] as const;

  const renderOptions = (section: 'core' | 'other') =>
    options
      .filter(option => option.section === section)
      .map(({ label, value, choices }) => (
        <div key={label} className='flex flex-col gap-2'>
          <h4 className='text-lg'>{label}</h4>
          <div className='flex flex-row gap-6 p-1 md:gap-12'>
            {choices.map((choice, i) => {
              const selected = value === choice.selectedWhen;
              return (
                <ActionButton
                  key={i}
                  colorScheme={selected ? 'main' : 'secondary'}
                  borderColorScheme={selected ? 'main' : 'secondary'}
                  borderBottomThickness={16}
                  borderRadius='3xl'
                  className={`flex-1 items-end p-4 text-lg text-(--background-color) ${!selected ? 'opacity-40' : ''}`}
                  onClick={() => {
                    playClick();
                    choice.onClick();
                  }}
                >
                  {choice.label}
                </ActionButton>
              );
            })}
          </div>
        </div>
      ));

  return (
    <div className='flex flex-col gap-6'>
      <CollapsibleSection
        title={t('behavior.core')}
        icon={<Settings2 size={18} />}
        useNewIconDesign={useNewIconDesign}
        level='subsection'
        defaultOpen={true}
        storageKey='prefs-behavior-core'
      >
        <div className='flex flex-col gap-6'>{renderOptions('core')}</div>
      </CollapsibleSection>

      <CollapsibleSection
        title={t('behavior.other')}
        icon={<Ellipsis size={18} />}
        useNewIconDesign={useNewIconDesign}
        level='subsection'
        defaultOpen={false}
        storageKey='prefs-behavior-other'
      >
        <div className='flex flex-col gap-6'>{renderOptions('other')}</div>
      </CollapsibleSection>

      {/* TTS voice settings (disabled until polished)
      {pronunciationEnabled && ( ... )} */}

      {/* Theme preview & hotkeys (disabled)
      <h4 className='text-lg'>Enable theme preview on hover:</h4>
      <h4 className='text-lg'>Enable hotkeys (desktop only):</h4>
      <HotkeyReference hotkeys={hotkeys} />
      */}
    </div>
  );
};

export default Behavior;

