import type { FaseId } from '@/types/fases';
import type { GameId } from '@/types/games';
import type { LeagueId } from '@/types/leagues';
import type { PlayerId } from '@/types/players';
import type { TeamId } from '@/types/teams';
import { computedGameConverter, gameConverter } from '@/utils/firestore';
import { collection, doc } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import { useFirestore } from 'vuefire';

export default function useFirestoreLeagueRefs() {
  const db = useFirestore();
  const route = useRoute();
  const leagueId = route.params.leagueId as LeagueId;

  if (!leagueId) {
    console.warn('no LeagueId.');
  }
  const leaguesColRef = collection(db, 'leagues');
  // League
  const leagueRef = doc(leaguesColRef, leagueId);
  // League's Teams
  const teamsColRef = collection(leagueRef, 'teams');
  // League's Fases
  const fasesColRef = collection(leagueRef, 'fases');
  // League's Games
  const gamesColRef = collection(leagueRef, 'games').withConverter(gameConverter);

  const getFaseRef = (faseId: FaseId) => doc(fasesColRef, faseId);
  const getGameRef = (gameId: GameId) => doc(gamesColRef, gameId);

  // Computed League
  const computedLeaguesColRef = collection(leagueRef, 'computed-leagues');
  const computedLeagueRef = doc(computedLeaguesColRef, leagueId);
  // Computed Teams
  const computedTeamsColRef = collection(leagueRef, 'computed-teams');
  // Computed Players
  const computedPlayersColRef = collection(leagueRef, 'computed-players');
  // Computed Games
  const computedGamesColRef = collection(leagueRef, 'computed-games').withConverter(
    computedGameConverter,
  );

  const getComputedTeamRef = (teamId: TeamId) => doc(computedTeamsColRef, teamId);
  const getComputedPlayerRef = (playerId: PlayerId) => doc(computedPlayersColRef, playerId);
  const computedGameRef = (gameId: GameId) => doc(computedGamesColRef, gameId);

  return {
    leaguesColRef,
    leagueRef,
    teamsColRef,
    fasesColRef,
    gamesColRef,
    getFaseRef,
    getGameRef,

    computedLeagueRef,
    computedTeamsColRef,
    computedPlayersColRef,
    computedGamesColRef,
    getComputedTeamRef,
    getComputedPlayerRef,
    computedGameRef,
  };
}
