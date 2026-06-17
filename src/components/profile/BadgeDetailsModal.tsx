'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Share2 } from 'lucide-react';
import { Badge } from '@/types';

interface BadgeDetailsModalProps {
  isOpen: boolean;
  badge: Badge | null;
  locale: 'en' | 'ar';
  onClose: () => void;
}

export default function BadgeDetailsModal({
  isOpen,
  badge,
  locale,
  onClose,
}: BadgeDetailsModalProps) {
  if (!badge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl flex flex-col items-center text-center gap-4 text-[#0B132B]"
          >
            {/* Close Button - 44px Touch Target, Direction Aware */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto w-11 h-11 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 p-2 mt-2">
              <Award className="h-10 w-10" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl font-black text-slate-800">
                {badge.name[locale]}
              </h3>
              <p className="font-sans text-xs font-semibold leading-relaxed text-slate-500 max-w-[260px]">
                {badge.description[locale]}
              </p>
            </div>

            <div className="w-full flex gap-3 border-t border-slate-100 pt-4 mt-1">
              <button
                onClick={() => alert('Credentials sharing template copied!')}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <Share2 className="h-4 w-4" />
                <span>Copy Link</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
