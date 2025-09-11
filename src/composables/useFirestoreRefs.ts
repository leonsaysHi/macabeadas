import type { FaseId } from '@/types/fases';
import type { GameId } from '@/types/games';
import type { LeagueId } from '@/types/leagues';
import type { PlayerId } from '@/types/players';
import type { TeamId } from '@/types/teams';
import type { UserId } from '@/types/users';
import { computedGameConverter, gameConverter } from '@/utils/firestore';
import { collection, doc } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import { useFirestore } from 'vuefire';

export default function useFirestoreRefs() {
  const db = useFirestore();
  const route = useRoute();
  const leagueId: LeagueId = route.params.leagueId as LeagueId;

  const usersColRef = collection(db, 'users');
  const getUserRef = (userId: UserId) => doc(usersColRef, userId);

  const categoriesColRef = collection(db, 'categories');
  const multiesColRef = collection(db, 'multies');
  const leaguesColRef = collection(db, 'leagues');

  // League
  const leagueRef = doc(leaguesColRef, leagueId);
  // League's Teams
  const teamsColRef = collection(leagueRef, 'teams');
  // League's Fases
  const fasesColRef = collection(leagueRef, 'fases');
  const getFaseRef = (faseId: FaseId) => doc(fasesColRef, faseId);
  // League's Games
  const gamesColRef = collection(leagueRef, 'games').withConverter(gameConverter);
  const getGameRef = (gameId: GameId) => doc(gamesColRef, gameId);

  // Computed League
  const computedLeaguesColRef = collection(leagueRef, 'computed-leagues');
  const computedLeagueRef = doc(computedLeaguesColRef, leagueId);
  // Computed Teams
  const computedTeamsColRef = collection(leagueRef, 'computed-teams');
  const getComputedTeamRef = (teamId: TeamId) => doc(computedTeamsColRef, teamId);
  // Computed Players
  const computedPlayersColRef = collection(leagueRef, 'computed-players');
  const getComputedPlayerRef = (playerId: PlayerId) => doc(computedPlayersColRef, playerId);
  // Computed Games
  const computedGamesColRef = collection(leagueRef, 'computed-games').withConverter(
    computedGameConverter,
  );
  const computedGameRef = (gameId: GameId) => doc(computedGamesColRef, gameId);

  return {
    usersColRef,
    getUserRef,
    categoriesColRef,
    multiesColRef,

    leaguesColRef,
    leagueRef,
    teamsColRef,
    fasesColRef,
    getFaseRef,
    gamesColRef,
    getGameRef,

    computedLeagueRef,
    getComputedTeamRef,
    getComputedPlayerRef,
    computedGamesColRef,
    computedGameRef,
  };
}
