'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/TranslationContext';
import { useGameStore } from '@/store/useGameStore';
import { BADGES } from '@/constants';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, BookOpen, Award } from 'lucide-react';
import dynamic from 'next/dynamic';

const BadgeRevealModal = dynamic(() => import('@/components/summary/BadgeRevealModal'), { ssr: false });

export default function SummaryPage() {
  const { locale, t } = useTranslation();
  const router = useRouter();

  const { activeRoundAnswers, difficulty, badges, resetSet } = useGameStore();

  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [activeRevealBadge, setActiveRevealBadge] = useState<string | null>(null);

  // Compute set statistics
  const totalRounds = activeRoundAnswers.length;
  const correctCount = activeRoundAnswers.filter(a => a.isCorrect).length;
  const accuracyPercent = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
  const totalXpGained = activeRoundAnswers.reduce((sum, item) => sum + item.xpGained, 0);

  // Radial SVG calculation: Radius = 40, Circumference = 251.2
  const strokeCircumference = 251.2;
  const strokeOffset = strokeCircumference - (accuracyPercent / 100) * strokeCircumference;

  // Determine badges unlocked in this set
  useEffect(() => {
    const unlockedThisSet: string[] = [];
    const accuracyDecimal = correctCount / totalRounds;

    // Check Accuracy Streak
    if (accuracyDecimal >= 0.8) {
      unlockedThisSet.push('accuracy_streak');
    }

    // Check difficulty tier complete
    if (difficulty === 'beginner') {
      unlockedThisSet.push('tier_complete_beginner');
    } else if (difficulty === 'intermediate') {
      unlockedThisSet.push('tier_complete_intermediate');
    } else if (difficulty === 'advanced') {
      unlockedThisSet.push('tier_complete_advanced');
    }

    // Filter to only badges actually present in user badges array (to ensure they are locked in)
    const validNewBadges = unlockedThisSet.filter(id => badges.includes(id));
    setNewBadges(validNewBadges);

    // Auto-reveal the first new badge unlocked
    if (validNewBadges.length > 0) {
      setActiveRevealBadge(validNewBadges[0]);
    }
  }, [activeRoundAnswers, badges, difficulty, correctCount, totalRounds]);

  const handleReplay = () => {
    resetSet();
    router.push(`/${locale}/setup`);
  };

  const getBadgeDetails = (id: string) => {
    return BADGES.find(b => b.id === id);
  };

  return (
    <div className="flex flex-col gap-8 py-4 md:py-6 relative">
      
      {/* Title */}
      <div className="flex flex-col items-center justify-center text-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00D4FF] to-[#2DD881] p-1 text-[#0B132B] shadow-lg shadow-brand-cyan/20">
          <Trophy className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {t('summary.completed_title')}
        </h1>
        <p className="text-sm text-white/50 max-w-md">
          {t('summary.completed_desc')}
        </p>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto w-full">
        
        {/* Radial SVG Accuracy Chart Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center text-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/55">
            {t('summary.accuracy')}
          </span>
          <div className="relative flex items-center justify-center h-28 w-28">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="40"
                className="stroke-white/5 fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="40"
                className="stroke-[#2DD881] fill-none"
                strokeWidth="8"
                strokeDasharray={strokeCircumference}
                initial={{ strokeDashoffset: strokeCircumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-2xl font-mono font-black text-[#2DD881]">
              {accuracyPercent}%
            </span>
          </div>
        </div>

        {/* Score & XP details Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-center gap-6 md:col-span-2">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                {t('summary.score')}
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {correctCount} / {totalRounds}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                {t('summary.xp_gained')}
              </span>
              <span className="text-2xl font-black text-[#00D4FF] font-mono">
                +{totalXpGained} XP
              </span>
            </div>
          </div>

          {/* Streaks stats */}
          <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs">
            <span className="text-white/50">Completed Difficulty:</span>
            <span className="capitalize text-white font-bold bg-white/10 px-2.5 py-1 rounded-md">
              {difficulty}
            </span>
          </div>

        </div>

      </div>

      {/* Badges Unlocked Showcase */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-3xl mx-auto w-full">
        <h3 className="text-lg font-bold text-white mb-4">
          {t('summary.badges_earned')}
        </h3>

        {newBadges.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {newBadges.map((badgeId) => {
              const details = getBadgeDetails(badgeId);
              if (!details) return null;

              return (
                <div
                  key={badgeId}
                  onClick={() => setActiveRevealBadge(badgeId)}
                  className="flex items-center gap-4 rounded-xl border border-[#00D4FF]/30 bg-[#00D4FF]/5 p-4 cursor-pointer hover:bg-[#00D4FF]/10 transition-colors select-none"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00D4FF]/25 border border-[#00D4FF]/40 text-[#00D4FF]">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col text-left rtl:text-right">
                    <span className="text-sm font-bold text-white">
                      {details.name[locale]}
                    </span>
                    <span className="text-[10px] text-white/60 leading-normal font-sans">
                      {details.description[locale]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-white/45 italic">
            {t('summary.no_badges')}
          </p>
        )}
      </div>

      {/* Replay / Navigation buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-2">
        <button
          onClick={handleReplay}
          className="flex items-center gap-2 rounded-lg bg-[#00D4FF] text-[#0B132B] font-bold px-6 py-3.5 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00D4FF]/15 transition-all duration-200 select-none"
        >
          <RefreshCw className="h-4.5 w-4.5" />
          <span>{t('summary.play_again')}</span>
        </button>

        <button
          onClick={() => router.push(`/${locale}/learn`)}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition-colors select-none"
        >
          <BookOpen className="h-4.5 w-4.5" />
          <span>{t('summary.review_clues')}</span>
        </button>
      </div>

      <BadgeRevealModal
        isOpen={!!activeRevealBadge}
        badge={activeRevealBadge ? getBadgeDetails(activeRevealBadge) || null : null}
        locale={locale}
        onClose={() => setActiveRevealBadge(null)}
        onViewProfile={() => router.push(`/${locale}/profile`)}
      />

    </div>
  );
}
