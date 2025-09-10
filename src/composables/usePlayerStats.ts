import type { ComputedPlayerStats } from '@/types/leaguesComputed';

export default function usePlayerStats() {
  const mergePlayerStats = (items: ComputedPlayerStats[]): ComputedPlayerStats => {
    return items.reduce((acc: ComputedPlayerStats, stats: ComputedPlayerStats) => {
      const mergable = ['gp'];
      Object.keys(stats).forEach((key: string) => {
        if (mergable.includes(key) && typeof stats[key] === 'number') {
          acc[key] = typeof acc[key] === 'number' ? acc[key] + stats[key] : stats[key];
        } else {
          acc[key] = stats[key];
        }
      });
      return acc;
    }, {} as ComputedPlayerStats);
  };

  return {
    mergePlayerStats,
  };
}
