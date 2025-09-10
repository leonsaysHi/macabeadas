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
import type { RankTeam } from '@/components/stats/RankComp.vue';
import useRankStats from './useRankStats';
import type { Game } from '@/types/games';
import type { GameComputed } from '@/types/gamesComputed';

export default function useLeagueComputed() {
  const { mergeRankStats } = useRankStats();
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

  const teams = computed<RankTeam[]>(() => getRank());
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

  const playersComputed = computed(() => [] as LeagueComputedPlayer[]);

  const computedGames = computed<GameComputed[]>(() =>
    Array.isArray(games?.value)
      ? games.value.map((item: Game): GameComputed => {
          const {
            id: gameId,
            faseId,
            datetime,
            status,
            team1: teamId1,
            team2: teamId2,
            scores1,
            scores2,
            courtId,
            boxscore,
          } = item;
          const groupIdx = fases.value
            .find((fase: LeagueComputedFase) => fase.faseId === faseId)
            ?.groups.findIndex((group: LeagueComputedGroup) =>
              group.teams.find((team: LeagueComputedTeam) => team.teamId === teamId1),
            );
          const team1 = teams.value.find((team: RankTeam) => team.teamId === teamId1);
          const team2 = teams.value.find((team: RankTeam) => team.teamId === teamId2);
          const scoreFinal1 = scores1.reduce((tot: number, p: number) => tot + p, 0);
          const scoreFinal2 = scores2.reduce((tot: number, p: number) => tot + p, 0);
          const facilityId = courtId;
          return {
            to: { name: 'league-game', params: { gameId } },
            gameId,
            faseId,
            groupIdx,
            datetime,
            status,
            team1,
            team2,
            scores1,
            scores2,
            scoreFinal1,
            scoreFinal2,
            facilityId,
            courtId,
            boxscore,
          };
        })
      : [],
  );

  const getPlayer = (id: PlayerId) => players?.value.find((item) => item.id === id);
  const getPlayerStats = (id: TeamId) =>
    playersComputed?.value.find((item) => item.playerId === id);

  const getTeam = (id: TeamId) => teams?.value.find((item) => item.teamId === id);

  const getRank = (faseId: FaseId | '' = '', groupIdx: number = -1): RankTeam[] => {
    return Array.isArray(leagueComputed?.value?.fases)
      ? leagueComputed?.value?.fases
          .reduce((acc: RankTeam[], fase: LeagueComputedFase) => {
            if (faseId === '' || fase.faseId === faseId) {
              const groups =
                groupIdx > -1 ? fase.groups.slice(groupIdx, groupIdx + 1) : fase.groups.slice();
              groups.forEach((group: LeagueComputedGroup) => {
                group.teams.forEach((team: LeagueComputedTeam) => {
                  const tIdx = acc.findIndex((item) => item.teamId === team.teamId);
                  // merging stats here
                  if (acc[tIdx]?.stats) {
                    acc[tIdx].stats = mergeRankStats([acc[tIdx].stats, team.stats]);
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
  const getTeamSponsor = (id: TeamId): RankTeam | undefined =>
    getTeam(id)?.sponsorId ? getSponsor(getTeam(id).sponsorId as SponsorId) : undefined;

  return {
    categorie,
    multi,
    league,
    leagueId,

    leagueComputed,
    teams,
    fases,
    getGroups,
    playersComputed,
    games,
    computedGames,

    getRank,
    getPlayer,
    getSponsor,
    getTeamSponsor,
    getTeamStats,
    getPlayerStats,
  };
}
