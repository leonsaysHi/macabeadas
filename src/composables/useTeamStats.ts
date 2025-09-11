import type { ComputedTeamStats } from '@/types/leaguesComputed';

export default function useTeamStats() {
  const mergeTeamStats = (items: ComputedTeamStats[]): ComputedTeamStats => {
    return items.reduce((acc: ComputedTeamStats, stats: ComputedTeamStats) => {
      Object.keys(stats).forEach((key: string) => {
        switch (key) {
          // Addition
          case 'gp':
          case 'w':
            if (typeof stats[key] === 'number') {
              acc[key] = typeof acc[key] === 'number' ? acc[key] + stats[key] : stats[key];
            }
            break;
          // Concat
          case 'last5':
            if (Array.isArray(stats[key])) {
              acc[key] = Array.isArray(acc[key])
                ? [
                    ...(Array.isArray(stats[key]) ? stats[key] : []),
                    ...(Array.isArray(acc[key]) ? acc[key] : []),
                  ].slice(-5)
                : Array.isArray(stats[key])
                  ? stats[key]
                  : [];
            }
            break;
          default:
            acc[key] = stats[key];
        }
      });
      return acc;
    }, {} as ComputedTeamStats);
  };

  return {
    mergeTeamStats,
  };
}
