'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Share2, Sparkles } from 'lucide-react';
import { Badge } from '@/types';

interface BadgeRevealModalProps {
  isOpen: boolean;
  badge: Badge | null;
  locale: 'en' | 'ar';
  onClose: () => void;
  onViewProfile: () => void;
}

export default function BadgeRevealModal({
  isOpen,
  badge,
  locale,
  onClose,
  onViewProfile,
}: BadgeRevealModalProps) {
  if (!badge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl flex flex-col items-center text-center gap-4 text-[#0B132B]"
          >
            {/* Sparkle effects */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 items-center bg-[#0B132B] text-[#00D4FF] border border-[#00D4FF]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-[#2DD881]" />
              <span>Unlocked</span>
            </div>

            {/* Close Button - 44px Touch Target, Direction Aware */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto w-11 h-11 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Large SVG Emblem badge */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#00D4FF]/20 to-[#2DD881]/20 border-2 border-[#00D4FF] p-2 mt-2">
              <Award className="h-14 w-14 text-[#00D4FF]" />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <h3 className="text-xl font-black text-slate-800">
                {badge.name[locale]}
              </h3>
              <p className="font-sans text-xs font-semibold leading-relaxed text-slate-500 max-w-[260px]">
                {badge.description[locale]}
              </p>
            </div>

            {/* Social Share Callout */}
            <div className="w-full flex gap-3 mt-4 border-t border-slate-100 pt-4">
              <button
                onClick={() => alert('Badge profile share link copied to clipboard!')}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Badge</span>
              </button>
              <button
                onClick={onViewProfile}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#0B132B] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-800"
              >
                <span>View Profile</span>
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
