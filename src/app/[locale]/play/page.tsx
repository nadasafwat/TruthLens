'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/TranslationContext';
import { useGameStore } from '@/store/useGameStore';
import { playAudioChime } from '@/utils/audio';
import { CLUE_TAXONOMY } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

const CLUE_REGIONS: Record<string, { top: string; left: string; width: string; height: string }> = {
  facial_artifacts: { top: '25%', left: '40%', width: '20%', height: '28%' },
  audio_sync: { top: '54%', left: '43%', width: '14%', height: '14%' },
  lighting: { top: '35%', left: '44%', width: '12%', height: '10%' },
  edge_blur: { top: '18%', left: '35%', width: '30%', height: '40%' },
  background: { top: '8%', left: '8%', width: '84%', height: '84%' }
};

export default function PlayPage() {
  const { locale, t } = useTranslation();
  const router = useRouter();

  // Store variables
  const {
    activeSetClips,
    currentRoundIndex,
    gameState,
    difficulty,
    submitAnswer,
    nextRound
  } = useGameStore();

  const activeClip = activeSetClips[currentRoundIndex];
  
  // Timer & Play states
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [activeHighlightClue, setActiveHighlightClue] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [xpEarnedThisRound, setXpEarnedThisRound] = useState<number | null>(null);
  const [roundVerdict, setRoundVerdict] = useState<{ isCorrect: boolean; choice: 'real' | 'fake' } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const roundStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Guard check: Redirect to setup if no clips loaded
  useEffect(() => {
    if (activeSetClips.length === 0) {
      router.push(`/${locale}/setup`);
    }
  }, [activeSetClips, locale, router]);

  // 2. Start round timer when clip changes and is loaded
  useEffect(() => {
    if (!activeClip || gameState !== 'playing' || !videoLoaded) return;

    setSecondsLeft(10);
    roundStartTimeRef.current = Date.now();
    
    // Auto play video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.log('Autoplay play error:', err));
    }

    timerIntervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerIntervalRef.current!);
          handleAnswerSelection(null); // Timeout locks choice
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoundIndex, gameState, videoLoaded]);

  // 3. Keystroke listeners (1 for Real, 2 for Fake, Space/Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'playing' && videoLoaded) {
        if (e.key === '1') {
          handleAnswerSelection('real');
        } else if (e.key === '2') {
          handleAnswerSelection('fake');
        }
      } else if (gameState === 'revealed') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, videoLoaded]);

  if (!activeClip) return null;

  const handleAnswerSelection = (choice: 'real' | 'fake' | null) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (videoRef.current) videoRef.current.pause();

    // Calculate response time
    const responseTime = Date.now() - roundStartTimeRef.current;

    // Handle locked timeout selection
    const finalChoice = choice || (activeClip.label === 'real' ? 'fake' : 'real'); // force failure on timeout
    
    const { isCorrect, xpGained } = submitAnswer(finalChoice, responseTime);

    setXpEarnedThisRound(xpGained);
    setRoundVerdict({ isCorrect: choice === null ? false : isCorrect, choice: finalChoice });
    playAudioChime(choice !== null && isCorrect ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    setVideoLoaded(false);
    setActiveHighlightClue(null);
    setXpEarnedThisRound(null);
    setRoundVerdict(null);

    const step = nextRound();
    if (step === 'completed') {
      router.push(`/${locale}/summary`);
    }
  };

  const isPlaying = gameState === 'playing';
  const isRevealed = gameState === 'revealed';

  return (
    <div className="flex flex-col gap-6 py-2 md:py-4">
      
      {/* Top Progress bar HUD */}
      <div className="flex items-center justify-between text-xs text-white/60 font-medium">
        <span>
          {t('common.menu.train')} &bull; <span className="capitalize text-[#00D4FF] font-semibold">{difficulty}</span>
        </span>
        <span className="font-mono">
          Round {currentRoundIndex + 1} of {activeSetClips.length}
        </span>
      </div>

      {/* Main Grid Viewport */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Left Video viewport block (Col span 7) */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-2xl">
            {/* Custom html5 video */}
            <video
              ref={videoRef}
              src={activeClip.videoUrl}
              poster={activeClip.thumbnailUrl}
              className="h-full w-full object-cover"
              preload="auto"
              muted
              playsInline
              onCanPlay={() => setVideoLoaded(true)}
            />

            {/* Video Buffering Overlay */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B132B] gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00D4FF]/20 border-t-[#00D4FF]" />
                <span className="text-xs text-white/40">{t('common.loading')}</span>
              </div>
            )}

            {/* Absolute visual coordinates markers on paused frame */}
            {isRevealed && activeClip.clues.map((clueKey) => {
              const region = CLUE_REGIONS[clueKey];
              if (!region) return null;

              const isHighlighted = activeHighlightClue === clueKey;

              return (
                <motion.div
                  key={clueKey}
                  style={{
                    position: 'absolute',
                    top: region.top,
                    left: region.left,
                    width: region.width,
                    height: region.height
                  }}
                  className={clsx(
                    "rounded border-2 pointer-events-none transition-all duration-300",
                    isHighlighted 
                      ? "border-[#00D4FF] bg-[#00D4FF]/10 shadow-[0_0_15px_rgba(0,212,255,0.4)] scale-105" 
                      : "border-orange-500/40 bg-orange-500/5"
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="absolute -top-5 left-0 rounded bg-[#0B132B]/80 px-1 py-0.5 text-[8px] font-bold text-white border border-white/10">
                    {CLUE_TAXONOMY[clueKey]?.name[locale]}
                  </span>
                </motion.div>
              );
            })}

            {/* Big Verdict Overlay HUD */}
            <AnimatePresence>
              {isRevealed && roundVerdict && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={clsx(
                    "absolute inset-0 flex flex-col items-center justify-center gap-4 text-center select-none backdrop-blur-[1px]",
                    roundVerdict.isCorrect 
                      ? "bg-[#2DD881]/15 border border-[#2DD881]/20" 
                      : "bg-red-500/15 border border-red-500/20"
                  )}
                >
                  {/* Floating XP increment reward overlay */}
                  {roundVerdict.isCorrect && xpEarnedThisRound && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -40 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute font-mono text-2xl font-black text-[#2DD881] drop-shadow-[0_2px_8px_rgba(45,216,129,0.4)]"
                    >
                      +{xpEarnedThisRound} XP
                    </motion.div>
                  )}

                  <div className={clsx(
                    "flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl",
                    roundVerdict.isCorrect ? "text-[#2DD881]" : "text-red-500"
                  )}>
                    {roundVerdict.isCorrect ? (
                      <ShieldCheck className="h-10 w-10" />
                    ) : (
                      <AlertCircle className="h-10 w-10" />
                    )}
                  </div>
                  
                  <h2 className="text-3xl font-black tracking-wide text-white uppercase drop-shadow-md">
                    {roundVerdict.isCorrect ? t('play.correct') : t('play.incorrect')}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Time Countdown Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                style={{ width: isPlaying ? `${(secondsLeft / 10) * 100}%` : '0%' }}
                className={clsx(
                  "h-full rounded-full transition-all duration-100 ease-linear",
                  secondsLeft > 3 ? "bg-[#2DD881]" : "bg-red-500 animate-pulse"
                )}
              />
            </div>
            {isPlaying && (
              <span className="self-end font-mono text-[10px] text-white/50">
                {t('play.sec_left', { seconds: secondsLeft })}
              </span>
            )}
          </div>

        </div>

        {/* Right Interactions Block (Col span 5) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          
          {/* Decision Buttons when playing */}
          {isPlaying && (
            <div className="flex flex-col gap-4">
              <button
                disabled={!videoLoaded}
                onClick={() => handleAnswerSelection('real')}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-4 text-center font-bold text-white transition-all hover:bg-white/10 hover:border-white/15 focus:ring-2 focus:ring-[#00D4FF] focus:outline-none"
              >
                {t('play.btn_real')}
              </button>
              
              <button
                disabled={!videoLoaded}
                onClick={() => handleAnswerSelection('fake')}
                className="w-full rounded-xl border border-white/10 bg-[#00D4FF] py-4 text-center font-bold text-[#0B132B] transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-[#00D4FF]/15 focus:ring-2 focus:ring-[#00D4FF] focus:outline-none"
              >
                {t('play.btn_fake')}
              </button>

              <div className="text-center text-[10px] text-white/40 leading-relaxed font-sans">
                {t('play.press_key_hint')}
              </div>
            </div>
          )}

          {/* Verdict Explanations card when revealed */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-white p-6 shadow-xl flex flex-col gap-6"
            >
              
              {/* Verdict Header info */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ground Truth
                </span>
                <span className={clsx(
                  "rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider",
                  activeClip.label === 'real'
                    ? "bg-[#2DD881]/15 text-[#2DD881]"
                    : "bg-[#00D4FF]/15 text-[#00D4FF]"
                )}>
                  {activeClip.label === 'real' ? t('play.btn_real') : t('play.btn_fake')}
                </span>
              </div>

              {/* Explanation Text */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0b132b]/40">
                  Explanation
                </span>
                <p className="font-sans text-sm font-medium leading-relaxed text-[#0B132B]/85">
                  {activeClip.explanation[locale]}
                </p>
              </div>

              {/* Clue taxonomies items */}
              {activeClip.clues.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0b132b]/40">
                    {t('play.clues_title')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeClip.clues.map((clueKey) => {
                      const item = CLUE_TAXONOMY[clueKey];
                      if (!item) return null;

                      return (
                        <button
                          key={clueKey}
                          onMouseEnter={() => setActiveHighlightClue(clueKey)}
                          onMouseLeave={() => setActiveHighlightClue(null)}
                          className={clsx(
                            "rounded-lg border px-3 py-2 text-left transition-all duration-200 w-full text-xs hover:border-[#00D4FF] hover:bg-[#00D4FF]/5 rtl:text-right",
                            activeHighlightClue === clueKey 
                              ? "border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]" 
                              : "border-slate-200 text-slate-700"
                          )}
                        >
                          <div className="font-bold flex items-center gap-1.5 mb-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            {item.name[locale]}
                          </div>
                          <p className="text-[10px] leading-relaxed text-slate-500 select-none">
                            {item.description[locale]}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next Challenge CTA */}
              <button
                onClick={handleNext}
                className="w-full rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#2DD881] py-4 text-center font-extrabold text-[#0B132B] shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('play.next_btn')}
              </button>

            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
