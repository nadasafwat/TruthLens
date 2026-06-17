import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoClip, RoundResult, DifficultyLevel } from '@/types';
import { LEVEL_THRESHOLDS } from '@/constants';

interface GameState {
  // Session Metrics
  username: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  badges: string[]; // Earned badge IDs
  completedClipIds: string[]; // Global log of completed clips across sets
  
  // Active Set Loop
  activeSetClips: VideoClip[];
  currentRoundIndex: number;
  activeRoundAnswers: RoundResult[];
  gameState: 'setup' | 'playing' | 'revealed' | 'completed';
  difficulty: DifficultyLevel | null;

  // Actions
  setUsername: (name: string) => void;
  startGame: (difficulty: DifficultyLevel, clips: VideoClip[]) => void;
  submitAnswer: (userAnswer: 'real' | 'fake', responseTime: number) => { isCorrect: boolean; xpGained: number };
  nextRound: () => 'next' | 'completed';
  resetSet: () => void;
  resetAllProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Default State
      username: '',
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      badges: [],
      completedClipIds: [],
      
      activeSetClips: [],
      currentRoundIndex: 0,
      activeRoundAnswers: [],
      gameState: 'setup',
      difficulty: null,

      setUsername: (name) => set({ username: name }),

      startGame: (difficulty, clips) => {
        set({
          difficulty,
          activeSetClips: clips,
          currentRoundIndex: 0,
          activeRoundAnswers: [],
          gameState: 'playing',
        });
      },

      submitAnswer: (userAnswer, responseTime) => {
        const { activeSetClips, currentRoundIndex, difficulty, currentStreak, totalXP, badges, completedClipIds } = get();
        const currentClip = activeSetClips[currentRoundIndex];
        
        const isCorrect = currentClip.label === userAnswer;
        let xpGained = 0;
        let newStreak = currentStreak;

        if (isCorrect) {
          // 1. Base Reward
          xpGained += 10;
          
          // 2. Speed Bonus (Time threshold < 5 seconds)
          if (responseTime < 5000) {
            xpGained += 5;
          }
          
          // 3. Difficulty Multiplier (Advanced clips get +10 additional)
          if (difficulty === 'advanced') {
            xpGained += 10;
          }
          
          // 4. Increment streak
          newStreak += 1;
          
          // 5. Streak Multiplier (Active correct streak of exactly 3 rounds awards +5 XP)
          if (newStreak > 0 && newStreak % 3 === 0) {
            xpGained += 5;
          }
        } else {
          // Reset streak on wrong answer (No XP penalty)
          newStreak = 0;
        }

        const newTotalXP = totalXP + xpGained;

        // Calculate level progression
        let newLevel = 1;
        for (const entry of LEVEL_THRESHOLDS) {
          if (newTotalXP >= entry.xp) {
            newLevel = entry.level;
          }
        }

        // Evaluate badge unlocks
        const updatedBadges = [...badges];
        
        // Check "First Steps" (5 rounds played in total)
        const totalRoundsPlayed = completedClipIds.length + 1; // including this clip
        if (totalRoundsPlayed >= 5 && !updatedBadges.includes('first_5_rounds')) {
          updatedBadges.push('first_5_rounds');
        }

        // Check if level-up badges are awarded (Level 4 and Level 5 milestones)
        // Note: Experts get cards; Guardians get certificates.
        
        const answer: RoundResult = {
          clipId: currentClip.id,
          isCorrect,
          responseTime,
          xpGained,
        };

        const updatedAnswers = [...get().activeRoundAnswers, answer];

        // Track global completed clips
        const updatedCompletedClips = completedClipIds.includes(currentClip.id)
          ? completedClipIds
          : [...completedClipIds, currentClip.id];

        set({
          totalXP: newTotalXP,
          level: newLevel,
          currentStreak: newStreak,
          badges: updatedBadges,
          activeRoundAnswers: updatedAnswers,
          completedClipIds: updatedCompletedClips,
          gameState: 'revealed',
        });

        return { isCorrect, xpGained };
      },

      nextRound: () => {
        const { currentRoundIndex, activeSetClips, activeRoundAnswers, difficulty, badges } = get();
        const nextIndex = currentRoundIndex + 1;

        if (nextIndex < activeSetClips.length) {
          set({
            currentRoundIndex: nextIndex,
            gameState: 'playing',
          });
          return 'next';
        } else {
          // Completed the set of 10! Perform end-of-set evaluations.
          const updatedBadges = [...badges];
          const correctCount = activeRoundAnswers.filter(a => a.isCorrect).length;
          const accuracy = correctCount / activeSetClips.length;

          // 80% accuracy streak badge check
          if (accuracy >= 0.8 && !updatedBadges.includes('accuracy_streak')) {
            updatedBadges.push('accuracy_streak');
          }

          // Difficulty tier completion badge check
          if (difficulty === 'beginner' && !updatedBadges.includes('tier_complete_beginner')) {
            updatedBadges.push('tier_complete_beginner');
          } else if (difficulty === 'intermediate' && !updatedBadges.includes('tier_complete_intermediate')) {
            updatedBadges.push('tier_complete_intermediate');
          } else if (difficulty === 'advanced' && !updatedBadges.includes('tier_complete_advanced')) {
            updatedBadges.push('tier_complete_advanced');
          }

          set({
            badges: updatedBadges,
            gameState: 'completed',
          });
          return 'completed';
        }
      },

      resetSet: () => {
        set({
          activeSetClips: [],
          currentRoundIndex: 0,
          activeRoundAnswers: [],
          gameState: 'setup',
          difficulty: null,
        });
      },

      resetAllProgress: () => {
        set({
          username: '',
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          badges: [],
          completedClipIds: [],
          activeSetClips: [],
          currentRoundIndex: 0,
          activeRoundAnswers: [],
          gameState: 'setup',
          difficulty: null,
        });
      },
    }),
    {
      name: 'truthlens-game-state',
      partialize: (state) => ({
        username: state.username,
        totalXP: state.totalXP,
        level: state.level,
        currentStreak: state.currentStreak,
        badges: state.badges,
        completedClipIds: state.completedClipIds,
      }),
    }
  )
);
