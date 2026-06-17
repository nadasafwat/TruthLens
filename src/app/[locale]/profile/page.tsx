'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/i18n/TranslationContext';
import { useGameStore } from '@/store/useGameStore';
import { BADGES, LEVEL_THRESHOLDS } from '@/constants';
import { motion } from 'framer-motion';
import { User, Award, Flame, Trophy, Lock, Download, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';

const BadgeDetailsModal = dynamic(() => import('@/components/profile/BadgeDetailsModal'), { ssr: false });
import { clsx } from 'clsx';

export default function ProfilePage() {
  const { locale, t } = useTranslation();

  const { username, level, totalXP, currentStreak, badges, resetAllProgress } = useGameStore();

  const [activeBadgeModal, setActiveBadgeModal] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetModal(false);
    window.location.reload();
  };

  // Get current and next level info
  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === level + 1);

  const currentThreshold = currentLevelInfo.xp;
  const nextThreshold = nextLevelInfo ? nextLevelInfo.xp : currentThreshold + 500;
  const xpInCurrentLevel = totalXP - currentThreshold;
  const xpNeededForNextLevel = nextThreshold - currentThreshold;
  const progressPercent = Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const handleDownloadShareCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#0B132B';
      ctx.fillRect(0, 0, 600, 600);
      
      // Outer borders
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 560, 560);

      ctx.strokeStyle = '#2DD881';
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 35, 530, 530);

      // App Header title
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRUTHLENS MEDIA EDUCATION', 300, 80);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'extrabold 32px sans-serif';
      ctx.fillText('EXPERT DETECTOR', 300, 140);

      // Name
      ctx.fillStyle = '#00D4FF';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(username || 'Anonymous Detector', 300, 230);

      // Performance stats
      ctx.fillStyle = '#2DD881';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`Level ${level} rank  •  ${totalXP} total XP`, 300, 300);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Successfully completed the training sets.`, 300, 370);
      ctx.fillText(`Demonstrated excellent visual artifact spotting skills.`, 300, 395);

      // Seal ring
      ctx.strokeStyle = 'rgba(45, 216, 129, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(300, 485, 45, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = '#2DD881';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('EXPERT SEAL', 300, 488);

      // Download trigger
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `truthlens_share_card_${username || 'user'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#0B132B';
      ctx.fillRect(0, 0, 1200, 800);
      
      // Double borders
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = '#2DD881';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, 1100, 700);

      // Header logo insignia
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRUTHLENS', 600, 130);

      // Certificate title
      ctx.fillStyle = '#00D4FF';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('CERTIFICATE OF MEDIA RESILIENCE', 600, 240);

      // Presents to
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = 'italic 20px sans-serif';
      ctx.fillText('This certifies that the media literacy student', 600, 330);

      // Student name
      ctx.fillStyle = '#2DD881';
      ctx.font = 'bold 52px sans-serif';
      ctx.fillText(username || 'Anonymous Detector', 600, 410);

      // Validations
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '16px sans-serif';
      ctx.fillText('has successfully reached Level 5 and unlocked the rank of Truth Guardian,', 600, 480);
      ctx.fillText('demonstrating outstanding critical evaluation skills to identify synthetic AI deepfakes.', 600, 510);

      // Insignia seal stamp
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(600, 630, 45, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = '#00D4FF';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('TRUTH GUARDIAN', 600, 634);

      // Download trigger
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `truthlens_certificate_${username || 'user'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const activeBadgeInfo = BADGES.find(b => b.id === activeBadgeModal);

  return (
    <div className="flex flex-col gap-8 py-4 md:py-6 relative">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {t('profile.title')}
        </h1>
        <p className="text-sm text-white/60 leading-relaxed max-w-xl">
          {t('profile.desc')}
        </p>
      </div>

      {/* Profile Details stats layout */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/45 uppercase tracking-wider mb-0.5">
              {t('profile.username')}
            </h4>
            <p className="text-lg font-bold text-white truncate max-w-[150px]">
              {username || 'Anonymous'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/45 uppercase tracking-wider mb-0.5">
              {t('profile.streak')}
            </h4>
            <p className="text-lg font-bold text-white font-mono">
              {currentStreak} Rounds
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2DD881]/10 text-[#2DD881] border border-[#2DD881]/20">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/45 uppercase tracking-wider mb-0.5">
              {t('profile.level_rank')}
            </h4>
            <p className="text-lg font-bold text-[#2DD881]">
              Level {level} ({totalXP} XP)
            </p>
          </div>
        </div>
      </div>

      {/* Progression Bar details Card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 max-w-lg">
        <div className="flex items-center justify-between text-xs text-white/70 mb-2 font-medium">
          <span>{currentLevelInfo.title[locale]}</span>
          <span className="font-mono text-[#00D4FF]">{totalXP} / {nextThreshold} XP</span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10 mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#2DD881] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Cabinet Badges Showcase */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Award className="h-5 w-5 text-[#00D4FF]" />
          {t('profile.badges')}
        </h3>
        <p className="text-xs text-white/50 leading-relaxed font-sans mb-6">
          {t('profile.no_badges_desc')}
        </p>

        {/* Badge Grid cabinet layout */}
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-5">
          {BADGES.map((badge) => {
            const isUnlocked = badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => {
                  if (isUnlocked) {
                    setActiveBadgeModal(badge.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (isUnlocked && (e.key === ' ' || e.key === 'Enter')) {
                    e.preventDefault();
                    setActiveBadgeModal(badge.id);
                  }
                }}
                tabIndex={isUnlocked ? 0 : -1}
                role="button"
                aria-label={badge.name[locale]}
                className={clsx(
                  "flex flex-col items-center text-center gap-3 p-4 rounded-2xl border transition-all duration-300 select-none focus:outline-none focus:ring-2 focus:ring-[#00D4FF]",
                  isUnlocked
                    ? "border-[#00D4FF]/30 bg-[#00D4FF]/5 hover:bg-[#00D4FF]/10 hover:border-[#00D4FF]/40 cursor-pointer"
                    : "border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed"
                )}
              >
                <div className={clsx(
                  "flex h-14 w-14 items-center justify-center rounded-full border border-dashed text-white",
                  isUnlocked ? "bg-[#00D4FF]/15 border-[#00D4FF]/40 text-[#00D4FF]" : "bg-black/20 border-white/10 text-white/45"
                )}>
                  {isUnlocked ? (
                    <Award className="h-7 w-7" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                
                <span className="text-xs font-bold text-white truncate w-full px-1">
                  {badge.name[locale]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone rewards exporter triggers */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 max-w-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Milestone Rewards</h3>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          
          {/* Share Card Download */}
          <button
            onClick={handleDownloadShareCard}
            disabled={level < 4}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-3 px-4 text-xs font-bold transition-all duration-200 select-none",
              level >= 4
                ? "bg-[#00D4FF] text-[#0B132B] hover:scale-[1.01] hover:shadow-lg hover:shadow-[#00D4FF]/15"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            )}
          >
            {level >= 4 ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span>{level >= 4 ? t('profile.download_share') : t('profile.locked_reward', { level: 4 })}</span>
          </button>

          {/* Certificate Download */}
          <button
            onClick={handleDownloadCertificate}
            disabled={level < 5}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-3 px-4 text-xs font-bold transition-all duration-200 select-none",
              level >= 5
                ? "bg-[#2DD881] text-[#0B132B] hover:scale-[1.01] hover:shadow-lg hover:shadow-[#2DD881]/15"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            )}
          >
            {level >= 5 ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span>{level >= 5 ? t('profile.download_cert') : t('profile.locked_reward', { level: 5 })}</span>
          </button>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col gap-4 max-w-lg">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
            <span>{t('profile.danger_zone')}</span>
          </h3>
          <p className="text-xs text-white/50 leading-relaxed font-sans">
            {t('profile.reset_desc')}
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setShowResetModal(true)}
            className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 text-xs transition-all duration-200 select-none shadow-lg shadow-red-600/15 hover:shadow-red-600/30 hover:scale-[1.01]"
          >
            {t('profile.reset_btn')}
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B132B] p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Red top border gradient highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
            
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {t('profile.reset_confirm_title')}
            </h3>
            
            <p className="text-sm text-white/60 leading-relaxed mb-6 font-sans">
              {t('profile.reset_confirm_desc')}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-white transition-all duration-200"
              >
                {t('profile.cancel')}
              </button>
              
              <button
                onClick={handleConfirmReset}
                className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white transition-all duration-200 select-none shadow-lg shadow-red-600/20"
              >
                {t('profile.confirm_reset')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <BadgeDetailsModal
        isOpen={!!activeBadgeModal}
        badge={activeBadgeModal ? activeBadgeInfo || null : null}
        locale={locale}
        onClose={() => setActiveBadgeModal(null)}
      />

    </div>
  );
}
