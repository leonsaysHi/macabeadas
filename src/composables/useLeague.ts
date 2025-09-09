import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { leagueProvided, rootProvided } from '@/types/injections';
import type { Sponsor, SponsorId } from '@/types/sponsors';
import type { PlayerId } from '@/types/players';
import type { League } from '@/types/leagues';
import type { Multi } from '@/types/multies';
import type { Categorie } from '@/types/categories';
import type { TeamId } from '@/types/teams';
import type {
  ComputedTeamStats,
  LeagueComputedFase,
  LeagueComputedGroup,
  LeagueComputedPlayer,
  LeagueComputedTeam,
} from '@/types/leaguesComputed';
import type { FaseId } from '@/types/fases';
import type { Rank } from '@/components/stats/RankComp.vue';

export default function useLeagueComputed() {
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
  const games = injectedLeagueData?.games;
  const leagueComputed = injectedLeagueData?.leagueComputed;

  const teams = computed<LeagueComputedTeam[]>(() =>
    Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed.value.fases.reduce((acc: LeagueComputedTeam[], fase: LeagueComputedFase) => {
          acc.push(
            ...(Array.isArray(fase.groups)
              ? fase.groups.reduce((_acc: LeagueComputedTeam[], group: LeagueComputedGroup) => {
                  _acc.push(
                    ...(Array.isArray(group?.teams)
                      ? group.teams
                          .filter(
                            ({ teamId }) => acc.findIndex((item) => item.teamId === teamId) === -1,
                          )
                          .map(({ teamId, sponsorId }) => ({ teamId, sponsorId }))
                      : []),
                  );
                  return _acc;
                }, [])
              : []),
          );
          return acc;
        }, [])
      : [],
  );
  const fases = computed<LeagueComputedFase[]>(() =>
    Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed.value.fases.reduce((acc: LeagueComputedFase[], fase: LeagueComputedFase) => {
          acc.push(fase);
          return acc;
        }, [])
      : [],
  );
  const playersComputed = computed(() => [] as LeagueComputedPlayer[]);

  const getPlayer = (id: PlayerId) => players?.value.find((item) => item.id === id);
  const getPlayerStats = (id: TeamId) =>
    playersComputed?.value.find((item) => item.playerId === id);

  const getTeam = (id: TeamId) => teams?.value.find((item) => item.teamId === id);

  const getRank = (faseId: FaseId | '' = '', groupIdx: number = -1): Rank[] => {
    return Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed?.value?.fases.reduce((acc: Rank[], fase: LeagueComputedFase) => {
          if (faseId === '' || fase.faseId === faseId) {
            const groups = groupIdx > 0 ? fase.groups.slice(groupIdx, 1) : fase.groups.slice();
            groups.forEach((group: LeagueComputedGroup) => {
              group.teams.forEach((team: LeagueComputedTeam) => {
                const tIdx = acc.findIndex((item) => item.teamId === team.teamId);
                // merging stats here
                if (acc[tIdx]?.stats) {
                  acc[tIdx].stats.push(team.stats);
                } else {
                  acc.push({
                    ...team,
                    stats: [team.stats],
                  } as Rank);
                }
              });
            });
          }
          return acc;
        }, [])
      : [];
  };
  const getTeamStats = (id: TeamId, faseId: FaseId | '') => {
    const team = getTeam(id);
    const stats: ComputedTeamStats[] = Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed?.value?.fases.reduce(
          (acc: ComputedTeamStats[], fase: LeagueComputedFase) => {
            if (faseId === '' || fase.faseId === faseId) {
              acc.push(
                ...fase.groups.reduce((_acc: ComputedTeamStats[], group: LeagueComputedGroup) => {
                  _acc.push(
                    ...group.teams
                      .filter((item) => item.teamId === id)
                      .map((item) => item.stats as ComputedTeamStats),
                  );
                  return _acc;
                }, []),
              );
            }
            return acc;
          },
          [],
        )
      : [];
    return {
      ...team,
      stats,
    };
  };

  const getSponsor = (id: SponsorId) => sponsors?.value.find((item) => item.id === id);
  const getTeamSponsor = (id: TeamId) =>
    getSponsor((getTeam(id) as LeagueComputedTeam).sponsorId) as Sponsor;

  return {
    categorie,
    multi,
    league,
    leagueId,

    leagueComputed,
    teams,
    fases,
    playersComputed,
    games,

    getRank,
    getPlayer,
    getSponsor,
    getTeamSponsor,
    getTeamStats,
    getPlayerStats,
  };
}
