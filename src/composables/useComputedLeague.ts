import type { Categorie } from '@/types/categories';
import type { Court, CourtDetails, CourtId, Facilitie, FacilitieId } from '@/types/facilities';
import type { Game } from '@/types/games';
import { adminLeagueProvided, rootProvided } from '@/types/injections';
import type { League } from '@/types/leagues';
import type {
  LeagueComputed,
  LeagueComputedPlayer,
  LeagueComputedPlayerStats,
  LeagueComputedTeam,
} from '@/types/leaguesComputed';
import type { Multi } from '@/types/multies';
import type { Player, PlayerId } from '@/types/players';
import type { Sponsor, SponsorId } from '@/types/sponsors';
import type { Team, TeamId, TeamPlayer } from '@/types/teams';
import { computed, inject, type Ref } from 'vue';
import { useRoute } from 'vue-router';

export default function useComputedLeague() {
  const route = useRoute();

  // Root
  const injectedData = inject(rootProvided);
  const sponsor = injectedData?.sponsors;
  const categories = injectedData?.categories;
  const multies = injectedData?.multies;
  const leagues = injectedData?.leagues;

  // League
  const leagueId = route.params.leagueId as string;
  const injectedAdminLeagueData = inject(adminLeagueProvided);
  const { teams, games } = injectedAdminLeagueData as { teams: Ref<Team[]>; games: Ref<Game[]> };

  const league = computed<League | undefined>(() =>
    leagues?.value.find((item) => item.id === leagueId),
  );

  const computedTeams = (): LeagueComputedTeam[] => {
    const result = teams.value.map((team: Team) => {
      const teamGames = games.value.filter((item) => {
        return item.status === 'finished' && (item.team1 === team.id || item.team2 === team.id);
      });
      const teamWins = teamGames.filter((item) => {
        return (
          (item.team1 === team.id && item.scores1 > item.scores2) ||
          (item.team2 === team.id && item.scores2 > item.scores1)
        );
      });
      return {
        leagueId,
        teamId: team.id,
        stats: {
          sport: league.value?.sport,
          gp: teamGames.length,
          w: teamWins.length,
        },
      } as LeagueComputedTeam;
    });
    return result;
  };

  const computedPlayers = (): LeagueComputedPlayer[] => {
    return teams.value.reduce((acc: LeagueComputedPlayer[], team: Team) => {
      const teamGames = games.value.filter((item) => {
        return item.status === 'finished' && (item.team1 === team.id || item.team2 === team.id);
      });
      return [
        ...acc,
        ...team.players
          .filter((item) => acc.findIndex((i) => i.playerId === item.playerId) === -1)
          .map(
            (item: TeamPlayer): LeagueComputedPlayer => ({
              leagueId,
              teamId: team.id as TeamId,
              ...item,
              stats: teamGames.reduce(
                (acc, item: Game) => {
                  if (item) {
                    acc.gp++;
                  }
                  return acc;
                },
                { gp: 0, sport: league.value?.sport } as LeagueComputedPlayerStats,
              ),
            }),
          ),
      ];
    }, [] as LeagueComputedPlayer[]);
  };

  return {
    computedTeams,
    computedPlayers,
  };
}
