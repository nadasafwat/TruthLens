export interface BilingualText {
  en: string;
  ar: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ClueCategory = 'facial_artifacts' | 'audio_sync' | 'lighting' | 'edge_blur' | 'background';

export interface VideoClip {
  id: string;
  label: 'real' | 'fake';
  difficulty: DifficultyLevel;
  videoUrl: string;
  thumbnailUrl: string;
  clues: ClueCategory[];
  explanation: BilingualText;
  source: string;
}

export interface ClueTaxonomyItem {
  id: ClueCategory;
  name: BilingualText;
  description: BilingualText;
}

export interface Badge {
  id: string;
  name: BilingualText;
  description: BilingualText;
  iconUrl: string;
  conditionType: 'rounds_played' | 'streak' | 'accuracy' | 'tier_complete';
  conditionValue: number;
}

export interface RoundResult {
  clipId: string;
  isCorrect: boolean;
  responseTime: number;
  xpGained: number;
}
