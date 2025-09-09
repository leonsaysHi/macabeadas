import type { FaseId } from '@/types/fases';
import type { GameId } from '@/types/games';
import type { LeagueId } from '@/types/leagues';
import type { PlayerId } from '@/types/players';
import type { TeamId } from '@/types/teams';
import type { UserId } from '@/types/users';
import { gameConverter } from '@/utils/firestore';
import { collection, doc } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import { useFirestore } from 'vuefire';
export default function useFirestoreRefs() {
  const db = useFirestore();
  const route = useRoute();
  const leagueId: LeagueId = route.params.leagueId as FaseId;

  const usersColRef = collection(db, 'users');
  const getUserRef = (userId: UserId) => (userId ? doc(usersColRef, userId) : undefined);

  const categoriesColRef = collection(db, 'categories');
  const multiesColRef = collection(db, 'multies');
  const leaguesColRef = collection(db, 'leagues');
  const leagueRef = leagueId ? doc(leaguesColRef, leagueId) : undefined;

  const teamsColRef = leagueRef ? collection(leagueRef, 'teams') : undefined;

  const fasesColRef = leagueRef ? collection(leagueRef, 'fases') : undefined;
  const getFaseRef = (faseId: FaseId) =>
    fasesColRef && faseId ? doc(fasesColRef, faseId) : undefined;

  const gamesColRef = leagueRef
    ? collection(leagueRef, 'games').withConverter(gameConverter)
    : undefined;
  const getGameRef = (gameId: GameId) =>
    gamesColRef && gameId ? doc(gamesColRef, gameId) : undefined;

  const computedLeaguesColRef = leagueRef ? collection(leagueRef, 'computed-leagues') : undefined;
  const getComputedLeagueRef = () =>
    computedLeaguesColRef ? doc(computedLeaguesColRef, leagueId) : undefined;
  const computedTeamsColRef = leagueRef ? collection(leagueRef, 'computed-teams') : undefined;
  const getComputedTeamRef = (teamId: TeamId) =>
    computedTeamsColRef && teamId ? doc(computedTeamsColRef, teamId) : undefined;
  const computedPlayersColRef = leagueRef ? collection(leagueRef, 'computed-players') : undefined;
  const getComputedPlayerRef = (playerId: PlayerId) =>
    computedPlayersColRef && playerId ? doc(computedPlayersColRef, playerId) : undefined;

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

    getComputedLeagueRef,
    getComputedTeamRef,
    getComputedPlayerRef,
  };
}
