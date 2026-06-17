import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'en' | 'ar';
  soundEnabled: boolean;
  theme: 'dark';

  setLanguage: (lang: 'en' | 'ar') => void;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      soundEnabled: true,
      theme: 'dark',

      setLanguage: (language) => set({ language }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'truthlens-settings',
    }
  )
);
