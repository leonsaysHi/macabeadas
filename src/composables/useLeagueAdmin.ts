import type { Categorie } from '@/types/categories';
import type { CourtDetails, CourtId } from '@/types/facilities';
import type { Fase, FaseGroup, FaseId } from '@/types/fases';
import type { Game, GameId } from '@/types/games';
import {
  leagueAdminProvided,
  rootProvided,
  type LeagueAdminInjections,
  type RootInjections,
} from '@/types/injections';
import type { League, Sport } from '@/types/leagues';
import type {
  ComputedPlayerStats,
  ComputedTeamStats,
  GameComputed,
  LeagueComputed,
  LeagueComputedFase,
  LeagueComputedGroup,
  LeagueComputedPlayer,
  LeagueComputedTeam,
  PlayerComputed,
  TeamComputed,
} from '@/types/leaguesComputed';
import type { Multi } from '@/types/multies';
import type { Player, PlayerId } from '@/types/players';
import type { Sponsor, SponsorId } from '@/types/sponsors';
import type { Last5, Team, TeamId, TeamPlayer } from '@/types/teams';
import { compareDesc } from 'date-fns';
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
export default function useLeagueAdmin() {
  const route = useRoute();
  const leagueId = route.params.leagueId as string;

  const injectedRootData = inject(rootProvided);
  const injectedLeagueData = inject(leagueAdminProvided);

  if (!leagueId || !injectedRootData || !injectedLeagueData) {
    console.warn('Should be called within a league. !!');
  }

  const { sponsors, facilities, courts, players, categories, multies, leagues } =
    injectedRootData as RootInjections;
  const { games, teams, fases } = injectedLeagueData as LeagueAdminInjections;

  const league = computed<League | undefined>(() =>
    leagues?.value.find((item) => item.id === leagueId),
  );
  const multi = computed<Multi | undefined>(() =>
    multies?.value.find((item) => league.value?.multiId === item.id),
  );
  const categorie = computed<Categorie | undefined>(() =>
    categories?.value.find((item) => multi.value?.categorieId === item.id),
  );

  const getSponsor = (id: SponsorId | undefined): Sponsor | undefined => {
    return id && Array.isArray(sponsors.value)
      ? sponsors.value.find((item) => item.id === id)
      : undefined;
  };
  const getTeam = (id: TeamId | undefined): Team | undefined => {
    return id && Array.isArray(teams.value)
      ? teams.value.find((item) => item.id === id)
      : undefined;
  };
  const getTeamTitle = (id: TeamId): string | undefined => {
    const sponsor = getSponsor(getTeam(id)?.sponsorId);
    return sponsor?.title;
  };
  const getTeamColor = (id: TeamId): string | number | undefined => {
    const sponsor = getSponsor(getTeam(id)?.sponsorId);
    return sponsor?.color;
  };
  const getCourtDetails = (id: CourtId): CourtDetails | undefined => {
    const court =
      id && Array.isArray(courts.value) ? courts.value.find((item) => item.id === id) : undefined;
    const facilitie =
      court?.facilitieId && Array.isArray(facilities.value)
        ? facilities.value.find((item) => item.id === court?.facilitieId)
        : undefined;
    return {
      ...facilitie,
      courtTitle: court?.title as string,
    } as CourtDetails;
  };

  const getPlayer = (id: PlayerId): Player => {
    return players.value.find((item) => item.id === id) as Player;
  };

  const getComputedLeague = (): LeagueComputed => {
    // Fases
    return {
      leagueId,
      fases: fases.value.map((fase: Fase): LeagueComputedFase => {
        // Groups
        return {
          faseId: fase.id as FaseId,
          title: fase.title,
          groups: fase.groups.map((group: FaseGroup): LeagueComputedGroup => {
            // Teams
            const gTeams = group.teams
              .map((teamId: TeamId): LeagueComputedTeam => {
                const team = teams.value.find(({ id }: Team) => id === teamId) as Team;
                const teamGames = games.value.filter((item) => {
                  const { team1, team2 } = item;
                  return item.status === 'finished' && (team1 === teamId || team2 === teamId);
                });
                const teamWins = teamGames.filter(({ team1, team2, scores1, scores2 }: Game) => {
                  return (
                    (team1 === teamId && scores1 > scores2) ||
                    (team2 === teamId && scores2 > scores1)
                  );
                });
                const stats: ComputedTeamStats = {
                  sport: league.value?.sport as Sport,
                  pos: 0,
                  gp: teamGames.length,
                  w: teamWins.length,
                  last5: teamGames
                    .toSorted((a: Game, b: Game) => compareDesc(a.datetime, b.datetime))
                    .slice(0, 5)
                    .reduce(
                      (acc: Last5, { team1, team2, scores1, scores2 }: Game, idx: number) => {
                        acc[idx] =
                          (team1 === teamId && scores1 > scores2) ||
                          (team2 === teamId && scores2 > scores1);
                        return acc;
                      },
                      new Array(5).fill(null) as Last5,
                    )
                    .toReversed(),
                };
                return {
                  leagueId,
                  teamId: teamId,
                  sponsorId: team.sponsorId,
                  stats,
                } as LeagueComputedTeam;
              })
              .toSorted((a: LeagueComputedTeam, b: LeagueComputedTeam) => {
                const { w: w1 } = a.stats;
                const { w: w2 } = b.stats;
                return w2 - w1;
              })
              .map((item: LeagueComputedTeam, idx: number) => {
                item.stats.pos = idx + 1;
                return item;
              });
            // Players
            const gPlayers = group.teams.reduce((acc: LeagueComputedPlayer[], teamId: TeamId) => {
              const team = teams.value.find(({ id }: Team) => id === teamId) as Team;
              const players = team.players.map((item: TeamPlayer): LeagueComputedPlayer => {
                const playerGames = games.value.filter(
                  ({ status, team1, team2, boxscore }: Game) => {
                    return (
                      status === 'finished' &&
                      (team1 === teamId || team2 === teamId) &&
                      boxscore[item.playerId] &&
                      !boxscore[item.playerId].dnp
                    );
                  },
                );
                const stats: ComputedPlayerStats = {
                  sport: league.value?.sport as Sport,
                  gp: playerGames.length,
                };
                return {
                  teamId,
                  sponsorId: team.sponsorId,
                  ...item,
                  stats,
                };
              });
              acc.push(...players);
              return acc;
            }, []);
            // Result:
            return {
              title: group.title,
              teams: gTeams,
              players: gPlayers,
            };
          }),
        };
      }),
    };
  };

  const getComputedTeams = (): TeamComputed[] => {
    return teams.value.map((team: Team) => {
      const teamGames = games.value.filter((item) => {
        return item.status === 'finished' && (item.team1 === team.id || item.team2 === team.id);
      });
      return {
        leagueId,
        teamId: team.id as TeamId,
        sponsorId: team.sponsorId,
        stats: {
          sport: league.value?.sport as Sport,
          gp: teamGames.length,
          pos: 0,
          w: 0,
          last5: [],
        },
      };
    });
  };

  const getComputedPlayers = (): PlayerComputed[] => {
    return teams.value.reduce((acc, team: Team) => {
      return [
        ...acc,
        ...team.players.map((item: TeamPlayer): PlayerComputed => {
          const playerGames = games.value.filter((g) => {
            return (
              g.status === 'finished' &&
              (g.team1 === team.id || g.team2 === team.id) &&
              g.boxscore[item.playerId] &&
              !g.boxscore[item.playerId].dnp
            );
          });
          return {
            leagueId,
            teamId: team.id as TeamId,
            sponsorId: team.sponsorId,
            ...item,
            stats: {
              sport: league.value?.sport as Sport,
              gp: playerGames.length,
            },
          };
        }),
      ];
    }, [] as PlayerComputed[]);
  };

  const getComputedGame = (item: Game): GameComputed => {
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
    } = item;
    const groupIdx = fases.value
      .find((fase: Fase) => fase.id === faseId)
      ?.groups.findIndex((group: FaseGroup) => group.teams.includes(teamId1)) as number;
    const scoreFinal1 = scores1.reduce((tot: number, p: number) => tot + p, 0);
    const scoreFinal2 = scores2.reduce((tot: number, p: number) => tot + p, 0);
    const facilityId = courtId;
    return {
      to: { name: 'league-game', params: { gameId } },
      gameId: gameId as GameId,
      faseId,
      groupIdx,
      datetime: datetime as Date,
      status,
      team1: { teamId: teamId1, sponsorId: (getTeam(teamId1) as Team).sponsorId as SponsorId },
      team2: { teamId: teamId2, sponsorId: (getTeam(teamId2) as Team).sponsorId as SponsorId },
      scores1,
      scores2,
      scoreFinal1,
      scoreFinal2,
      facilityId,
      courtId,
    };
  };

  return {
    leagueId,
    categorie,
    multi,
    league,

    teams,
    games,
    fases,

    getSponsor,
    getTeam,
    getCourtDetails,
    getTeamTitle,
    getTeamColor,
    getPlayer,

    getComputedLeague,
    getComputedTeams,
    getComputedPlayers,
    getComputedGame,
  };
}
