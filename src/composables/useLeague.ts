import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { leagueProvided, rootProvided } from '@/types/injections';
import type { SponsorId } from '@/types/sponsors';
import type { PlayerId } from '@/types/players';
import type { League } from '@/types/leagues';
import type { Multi } from '@/types/multies';
import type { Categorie } from '@/types/categories';
import type { Team, TeamId } from '@/types/teams';
import type {
  ComputedTeamStats,
  LeagueComputedFase,
  LeagueComputedGroup,
  LeagueComputedPlayerStats,
  LeagueComputedTeam,
  LeagueComputedTeamStats,
} from '@/types/leaguesComputed';
import type { FaseId } from '@/types/fases';
import type { RankTeam } from '@/components/stats/RankComp.vue';
import useTeamStats from './useTeamStats';
import usePlayerStats from './usePlayerStats';
import type { StatsPlayer } from '@/components/tables/StatsComp.vue';

export default function useLeagueComputed() {
  const { mergeTeamStats } = useTeamStats();
  const { mergePlayerStats } = usePlayerStats();
  const route = useRoute();
  const leagueId = route.params.leagueId as string;

  if (!leagueId) {
    console.warn('Should be called within a league. !!');
  }

  const injectedRootData = inject(rootProvided);
  const categories = injectedRootData?.categories;
  const multies = injectedRootData?.multies;
  const leagues = injectedRootData?.leagues;
  const players = injectedRootData?.players;
  const sponsors = injectedRootData?.sponsors;

  const league = computed(() => leagues?.value.find((item) => item.id === leagueId) as League);
  const multi = computed(
    () => multies?.value.find((item) => item.id === league.value?.multiId) as Multi,
  );
  const categorie = computed(
    () => categories?.value.find((item) => item.id === league.value?.multiId) as Categorie,
  );

  const injectedLeagueData = inject(leagueProvided);
  const gamesComputed = injectedLeagueData?.gamesComputed;
  const leagueComputed = injectedLeagueData?.leagueComputed;

  const teams = computed<LeagueComputedTeam[]>(() =>
    Array.isArray(leagueComputed?.value?.teams) ? leagueComputed?.value.teams : [],
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

  const getPlayer = (id: PlayerId) => players?.value.find((item) => item.id === id);

  const getTeam = (id: TeamId) =>
    teams.value.find((item: LeagueComputedTeam) => item.teamId === id);

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

  const getSponsor = (id: SponsorId) => sponsors?.value.find((item) => item.id === id);
  const getTeamSponsor = (id: TeamId): RankTeam | undefined =>
    getTeam(id)?.sponsorId ? getSponsor(getTeam(id).sponsorId as SponsorId) : undefined;

  return {
    categorie,
    multi,
    league,
    leagueId,

    // League
    leagueComputed,
    teams,
    fases,
    getGroups,
    // games
    gamesComputed,

    getRank,
    getStats,

    getPlayer,
    getSponsor,
    getTeamSponsor,
  };
}
