import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { leagueProvided } from '@/types/injections';
import type { TeamId } from '@/types/teams';
import type {
  LeagueComputedFase,
  LeagueComputedGroup,
  LeagueComputedPlayerStats,
  LeagueComputedTeam,
  LeagueComputedTeamStats,
} from '@/types/leaguesComputed';
import type { FaseId } from '@/types/fases';
import useTeamStats from './useTeamStats';
import usePlayerStats from './usePlayerStats';
import type { StatsPlayer } from '@/components/tables/StatsComp.vue';
import type { RankTeam } from '@/components/tables/RankComp.vue';
import useRootProvided from './useRootProvided';
import type { LeagueDetails } from '@/types/leagues';

export default function useLeagueComputed() {
  const { mergeTeamStats } = useTeamStats();
  const { getLeagueDetails, getCourtDetails } = useRootProvided();
  const { mergePlayerStats } = usePlayerStats();

  const route = useRoute();
  const leagueId = route.params.leagueId as string;

  if (!leagueId) {
    console.warn('Should be called within a league. !!');
  }

  const leagueDetails: LeagueDetails = getLeagueDetails(leagueId);

  // computed
  const injectedLeagueData = inject(leagueProvided);
  const gamesComputed = injectedLeagueData?.gamesComputed;
  const leagueComputed = injectedLeagueData?.leagueComputed;

  const teamsComputed = computed<LeagueComputedTeam[]>(() =>
    Array.isArray(leagueComputed?.value?.teams) ? leagueComputed.value.teams : [],
  );
  const fases = computed<LeagueComputedFase[]>(() =>
    Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed.value.fases.reduce((acc: LeagueComputedFase[], fase: LeagueComputedFase) => {
          acc.push(fase);
          return acc;
        }, [])
      : [],
  );
  const getGroups = (faseId: FaseId): LeagueComputedGroup[] | undefined =>
    leagueComputed?.value?.fases.find((item) => item.faseId === faseId)?.groups;

  const getTeamComputed = (id: TeamId): LeagueComputedTeam | undefined =>
    teamsComputed.value.find((item: LeagueComputedTeam) => item.teamId === id);

  const getRank = (faseId: FaseId | '' = '', groupIdx: number = -1): RankTeam[] => {
    return Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed?.value?.fases
          .reduce((acc: RankTeam[], fase: LeagueComputedFase) => {
            if (faseId === '' || fase.faseId === faseId) {
              const groups =
                groupIdx > -1 ? fase.groups.slice(groupIdx, groupIdx + 1) : fase.groups.slice();
              groups.forEach((group: LeagueComputedGroup) => {
                group.teams.forEach((team: LeagueComputedTeamStats) => {
                  const tIdx = acc.findIndex((item) => item.teamId === team.teamId);
                  // merging stats here
                  if (acc[tIdx]?.stats) {
                    acc[tIdx].stats = mergeTeamStats([acc[tIdx].stats, team.stats]);
                  } else {
                    acc.push({
                      ...team,
                      stats: team.stats,
                    } as RankTeam);
                  }
                });
              });
            }
            return acc;
          }, [])
          .toSorted((a: RankTeam, b: RankTeam) => {
            return a.stats.gp / a.stats.w - b.stats.gp / b.stats.w;
          })
          .map((item: RankTeam, idx: number) => {
            item.stats.pos = idx + 1;
            return item;
          })
      : [];
  };

  const getStats = (faseId: FaseId | '' = '', groupIdx: number = -1): StatsPlayer[] => {
    return Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed?.value?.fases.reduce((acc: StatsPlayer[], fase: LeagueComputedFase) => {
          if (faseId === '' || fase.faseId === faseId) {
            const groups =
              groupIdx > -1 ? fase.groups.slice(groupIdx, groupIdx + 1) : fase.groups.slice();
            groups.forEach((group: LeagueComputedGroup) => {
              group.players.forEach((player: LeagueComputedPlayerStats) => {
                const pIdx = acc.findIndex((item) => item.playerId === player.playerId);
                // merging stats here
                if (acc[pIdx]?.stats) {
                  acc[pIdx].stats = mergePlayerStats([acc[pIdx].stats, player.stats]);
                } else {
                  acc.push({
                    ...player,
                    stats: player.stats,
                  } as StatsPlayer);
                }
              });
            });
          }
          return acc;
        }, [])
      : [];
  };

  return {
    leagueDetails,
    leagueId,

    // League
    leagueComputed,
    teamsComputed,
    fases,
    getGroups,
    // games
    gamesComputed,

    getRank,
    getStats,
    getTeamComputed,
    getCourtDetails,
  };
}
