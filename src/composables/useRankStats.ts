import type { ComputedTeamStats } from '@/types/leaguesComputed';

export default function useRankStats() {
  const mergeRankStats = (items: ComputedTeamStats[]): ComputedTeamStats => {
    return items.reduce((acc: ComputedTeamStats, stats: ComputedTeamStats) => {
      const mergable = ['gp', 'w'];
      Object.keys(stats).forEach((key: string) => {
        if (mergable.includes(key) && typeof stats[key] === 'number') {
          acc[key] = typeof acc[key] === 'number' ? acc[key] + stats[key] : stats[key];
        } else {
          acc[key] = stats[key];
        }
      });
      return acc;
    }, {} as ComputedTeamStats);
  };

  return {
    mergeRankStats,
  };
}
