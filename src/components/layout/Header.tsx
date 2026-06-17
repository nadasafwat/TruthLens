'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/TranslationContext';
import { useGameStore } from '@/store/useGameStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { LEVEL_THRESHOLDS } from '@/constants';
import { motion } from 'framer-motion';
import { Globe, Volume2, VolumeX, Shield } from 'lucide-react';

export default function Header() {
  const { locale, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const { totalXP, level, activeRoundAnswers } = useGameStore();
  const { soundEnabled, toggleSound, setLanguage } = useSettingsStore();

  // Calculate progress to next level
  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === level + 1);
  
  const currentThreshold = currentLevelInfo.xp;
  const nextThreshold = nextLevelInfo ? nextLevelInfo.xp : currentThreshold + 500; // soft cap
  const xpInCurrentLevel = totalXP - currentThreshold;
  const xpNeededForNextLevel = nextThreshold - currentThreshold;
  const progressPercent = Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  // Calculate current set accuracy
  const totalAnswers = activeRoundAnswers.length;
  const correctAnswers = activeRoundAnswers.filter(a => a.isCorrect).length;
  const accuracyPercent = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    setLanguage(nextLocale);
    
    // Switch route locale segment (e.g. /en/play -> /ar/play)
    const newPath = pathname.replace(/^\/(en|ar)/, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B132B]/85 backdrop-blur-md px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        
        {/* Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#00D4FF] to-[#2DD881] p-1 shadow-lg shadow-brand-cyan/20">
            <Shield className="h-5 w-5 text-[#0B132B]" />
          </div>
          <span className="hidden text-xl font-bold tracking-wider text-white sm:block">
            {t('common.title')}
          </span>
        </div>

        {/* XP Level Progression Bar */}
        <div className="flex flex-1 max-w-md flex-col justify-center px-2">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span className="font-semibold text-white">
              {currentLevelInfo.title[locale]}
            </span>
            <span className="font-mono text-[#00D4FF]">
              {totalXP} / {nextThreshold} {t('common.xp')}
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#2DD881] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-3">
          {/* Accuracy HUD */}
          {totalAnswers > 0 && (
            <div className="hidden items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs text-white sm:flex">
              <span className="text-white/50">Accuracy:</span>
              <span className={accuracyPercent >= 80 ? 'text-[#2DD881] font-bold' : 'text-white font-bold'}>
                {accuracyPercent}%
              </span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-4.5 w-4.5" />
            ) : (
              <VolumeX className="h-4.5 w-4.5 text-white/50" />
            )}
          </button>

          {/* i18n Switcher */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 rounded-lg border border-[#00D4FF]/30 bg-[#00D4FF]/10 px-3 py-1.5 text-sm font-semibold text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/20"
            aria-label="Switch Language"
          >
            <Globe className="h-4 w-4" />
            <span className="font-sans">
              {locale === 'en' ? 'العربية' : 'English'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
