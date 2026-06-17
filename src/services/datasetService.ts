import { VideoClip, DifficultyLevel } from '@/types';

export const datasetService = {
  async getManifest(): Promise<VideoClip[]> {
    try {
      const res = await fetch('/dataset.json', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load dataset manifest');
      }
      const data = await res.json();
      return data.clips || [];
    } catch (error) {
      console.error('Error fetching manifest:', error);
      return [];
    }
  },

  filterClipsForSet(
    manifest: VideoClip[],
    difficulty: DifficultyLevel,
    completedIds: string[]
  ): VideoClip[] {
    // 1. Filter by difficulty
    const targetClips = manifest.filter((c) => c.difficulty === difficulty);
    if (targetClips.length === 0) return [];

    // 2. Separate into "unplayed" and "played" to prioritize fresh content
    const unplayed = targetClips.filter((c) => !completedIds.includes(c.id));
    const played = targetClips.filter((c) => completedIds.includes(c.id));

    // 3. Shuffle helper
    const shuffle = (arr: VideoClip[]) => [...arr].sort(() => Math.random() - 0.5);

    // Join prioritising unplayed, then shuffle both groups internally
    const selected = [...shuffle(unplayed), ...shuffle(played)];

    // 4. Return exactly 10 clips (or max available)
    return selected.slice(0, 10);
  }
};
