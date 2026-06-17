'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/TranslationContext';
import { useGameStore } from '@/store/useGameStore';
import { datasetService } from '@/services/datasetService';
import { DifficultyLevel, VideoClip } from '@/types';
import { Lock, Award, ChevronRight, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function SetupPage() {
  const { locale, t } = useTranslation();
  const router = useRouter();

  // Store metrics
  const { level, username, setUsername, startGame } = useGameStore();

  const [inputName, setInputName] = useState(username || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const [manifest, setManifest] = useState<VideoClip[]>([]);

  // Load manifest manifest on mount
  useEffect(() => {
    const fetchManifest = async () => {
      const clips = await datasetService.getManifest();
      setManifest(clips);
    };
    fetchManifest();
  }, []);

  const difficultyCards = [
    {
      id: 'beginner' as DifficultyLevel,
      title: t('setup.beginner_title'),
      desc: t('setup.beginner_desc'),
      unlocked: true,
      requiredLevel: 1,
      requiredXp: 0,
      activeColor: 'border-[#2DD881] shadow-[#2DD881]/10 text-[#2DD881]',
      hoverColor: 'hover:border-[#2DD881]/50'
    },
    {
      id: 'intermediate' as DifficultyLevel,
      title: t('setup.intermediate_title'),
      desc: t('setup.intermediate_desc'),
      unlocked: level >= 2,
      requiredLevel: 2,
      requiredXp: 100,
      activeColor: 'border-[#00D4FF] shadow-[#00D4FF]/10 text-[#00D4FF]',
      hoverColor: 'hover:border-[#00D4FF]/50'
    },
    {
      id: 'advanced' as DifficultyLevel,
      title: t('setup.advanced_title'),
      desc: t('setup.advanced_desc'),
      unlocked: level >= 3,
      requiredLevel: 3,
      requiredXp: 300,
      activeColor: 'border-orange-500 shadow-orange-500/10 text-orange-500',
      hoverColor: 'hover:border-orange-500/50'
    }
  ];

  const handleLaunch = () => {
    if (!selectedDifficulty || manifest.length === 0) return;

    setLoading(true);
    
    // Save username
    setUsername(inputName);

    // Pick 10 clips matching difficulty and previous progress
    const completedClipIds = useGameStore.getState().completedClipIds;
    const selectedClips = datasetService.filterClipsForSet(
      manifest,
      selectedDifficulty,
      completedClipIds
    );

    if (selectedClips.length > 0) {
      startGame(selectedDifficulty, selectedClips);
      router.push(`/${locale}/play`);
    } else {
      alert('Error assembling challenges. Check manifest content.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4 md:py-6">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {t('setup.title')}
        </h1>
        <p className="text-sm text-white/60 max-w-xl leading-relaxed">
          {t('setup.desc')}
        </p>
      </div>

      {/* Username Setup Card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 max-w-lg">
        <label htmlFor="username-field" className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-3">
          <User className="h-4.5 w-4.5 text-[#00D4FF]" />
          <span>{t('setup.username_placeholder')}</span>
        </label>
        <input
          id="username-field"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Anonymous Detector"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]"
          maxLength={25}
        />
      </div>

      {/* Difficulty Card Selectors Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {difficultyCards.map((card) => {
          const isSelected = selectedDifficulty === card.id;
          const isLocked = !card.unlocked;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (!isLocked) {
                  setSelectedDifficulty(card.id);
                }
              }}
              onKeyDown={(e) => {
                if (!isLocked && (e.key === ' ' || e.key === 'Enter')) {
                  e.preventDefault();
                  setSelectedDifficulty(card.id);
                }
              }}
              tabIndex={isLocked ? -1 : 0}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isLocked}
              className={clsx(
                "relative flex flex-col gap-4 rounded-2xl border bg-white/5 p-6 transition-all duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B132B]",
                isLocked
                  ? "border-white/5 opacity-40 cursor-not-allowed"
                  : "cursor-pointer border-white/10",
                !isLocked && !isSelected && card.hoverColor,
                isSelected ? `border-2 ${card.activeColor} bg-white/[0.02] scale-[1.02] shadow-xl` : ""
              )}
            >
              {/* Lock Indicator */}
              {isLocked && (
                <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <Lock className="h-4 w-4 text-white/70" />
                </div>
              )}

              {/* Title & Icons */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">
                    {card.title}
                  </span>
                </div>
                
                <p className="text-xs leading-relaxed text-white/50 min-h-[40px]">
                  {card.desc}
                </p>
              </div>

              {/* Locked Helper Info Banner */}
              {isLocked && (
                <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-black/20 p-2 text-[10px] text-white/60 font-medium">
                  <Award className="h-3.5 w-3.5 text-[#00D4FF]" />
                  <span>
                    {t('setup.locked_label', { level: card.requiredLevel, xp: card.requiredXp })}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Launch CTA Trigger */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleLaunch}
          disabled={!selectedDifficulty || loading}
          className={clsx(
            "group flex items-center gap-2 rounded-lg px-6 py-3.5 text-base font-bold select-none transition-all duration-200",
            selectedDifficulty && !loading
              ? "bg-[#00D4FF] text-[#0B132B] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00D4FF]/20 cursor-pointer"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          )}
        >
          <span>{loading ? t('common.loading') : t('setup.launch_game')}</span>
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1 rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
}
