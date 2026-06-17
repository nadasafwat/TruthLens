'use client';

import React, { useState, useEffect } from 'react';
import { TranslationProvider } from '@/i18n/TranslationContext';
import { useGameStore } from '@/store/useGameStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function RootProvider({
  locale,
  children,
}: {
  locale: 'en' | 'ar';
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Rehydrate stores
    const hydrateStores = async () => {
      try {
        await Promise.all([
          useGameStore.persist.rehydrate(),
          useSettingsStore.persist.rehydrate(),
        ]);
      } catch (err) {
        console.error('Hydration error:', err);
      } finally {
        setHydrated(true);
      }
    };

    hydrateStores();
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0B132B]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D4FF]/30 border-t-[#00D4FF]" />
        <span className="mt-4 font-sans text-sm font-semibold tracking-wider text-white/50 animate-pulse">
          Loading TruthLens...
        </span>
      </div>
    );
  }

  return (
    <TranslationProvider locale={locale}>
      {children}
    </TranslationProvider>
  );
}
