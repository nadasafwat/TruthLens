import { ClueTaxonomyItem, Badge } from '@/types';

export const LEVEL_THRESHOLDS = [
  { level: 1, title: { en: "Novice Detector", ar: "مكشف مبتدئ" }, xp: 0 },
  { level: 2, title: { en: "Apprentice", ar: "مساعد" }, xp: 100 },
  { level: 3, title: { en: "Analyst", ar: "محلل" }, xp: 300 },
  { level: 4, title: { en: "Expert", ar: "خبير" }, xp: 600 },
  { level: 5, title: { en: "Truth Guardian", ar: "حارس الحقيقة" }, xp: 1000 },
];

export const CLUE_TAXONOMY: Record<string, ClueTaxonomyItem> = {
  facial_artifacts: {
    id: 'facial_artifacts',
    name: { en: 'Facial Artifacts', ar: 'عيوب الوجه البصرية' },
    description: {
      en: 'Unnatural blinking patterns, flat skin texture, or hairline irregularities.',
      ar: 'أنماط رمش غير طبيعية، ملمس بشرة مسطح، أو عدم انتظام في خطوط الشعر.'
    }
  },
  audio_sync: {
    id: 'audio_sync',
    name: { en: 'Audio Sync', ar: 'مزامنة الصوت' },
    description: {
      en: 'Lip movements that do not match speech timing or exhibit robotic prosody.',
      ar: 'حركات الشفاه لا تتطابق مع توقيت الكلام أو تظهر نبرات آلية غير طبيعية.'
    }
  },
  lighting: {
    id: 'lighting',
    name: { en: 'Lighting Inconsistency', ar: 'عدم تطابق الإضاءة' },
    description: {
      en: 'Mismatched shadows, incorrect light directions, or unnatural reflections in the eyes.',
      ar: 'ظلال غير متناسقة، اتجاهات إضاءة خاطئة، أو انعكاسات غير طبيعية داخل العينين.'
    }
  },
  edge_blur: {
    id: 'edge_blur',
    name: { en: 'Edge Blur', ar: 'ضبابية الحواف' },
    description: {
      en: 'Flickering or abnormally soft borders surrounding the face or hair margins.',
      ar: 'حواف مضطربة أو ناعمة بشكل غير طبيعي تحيط بالوجه وخصلات الشعر.'
    }
  },
  background: {
    id: 'background',
    name: { en: 'Background Anomalies', ar: 'عيوب الخلفية' },
    description: {
      en: 'Warping, ghosting, or texture breathing in elements directly behind the subject.',
      ar: 'انحناء، تشوه بصري، أو اهتزاز غير طبيعي في الخلفية المحيطة بالشخص.'
    }
  }
};

export const BADGES: Badge[] = [
  {
    id: 'first_5_rounds',
    name: { en: 'First Steps', ar: 'الخطوات الأولى' },
    description: { en: 'Completed your first 5 rounds of training.', ar: 'أكملت أول ٥ جولات تدريبية لك.' },
    iconUrl: 'first_steps',
    conditionType: 'rounds_played',
    conditionValue: 5
  },
  {
    id: 'accuracy_streak',
    name: { en: 'Sharp Eye', ar: 'العين الحادة' },
    description: { en: 'Completed a set of 10 challenges with 80% accuracy or higher.', ar: 'أنهيت مجموعة من ١٠ جولات بنسبة دقة بلغت ٨٠٪ أو أكثر.' },
    iconUrl: 'sharp_eye',
    conditionType: 'accuracy',
    conditionValue: 0.8
  },
  {
    id: 'tier_complete_beginner',
    name: { en: 'Novice Graduate', ar: 'خريج مبتدئ' },
    description: { en: 'Completed a set on Beginner difficulty.', ar: 'أكملت جولة كاملة في مستوى المبتدئ.' },
    iconUrl: 'novice_graduate',
    conditionType: 'tier_complete',
    conditionValue: 1
  },
  {
    id: 'tier_complete_intermediate',
    name: { en: 'Apprentice Inspector', ar: 'مفتش مساعد' },
    description: { en: 'Completed a set on Intermediate difficulty.', ar: 'أكملت جولة كاملة في المستوى المتوسط.' },
    iconUrl: 'apprentice_inspector',
    conditionType: 'tier_complete',
    conditionValue: 2
  },
  {
    id: 'tier_complete_advanced',
    name: { en: 'Elite Analyst', ar: 'محلل نخبة' },
    description: { en: 'Completed a set on Advanced difficulty.', ar: 'أكملت جولة كاملة في المستوى المتقدم.' },
    iconUrl: 'elite_analyst',
    conditionType: 'tier_complete',
    conditionValue: 3
  }
];
