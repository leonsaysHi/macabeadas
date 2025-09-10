import type { Game, GameId } from '@/types/games';
import { DocumentReference } from 'firebase/firestore';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDocument } from 'vuefire';
import useLeagueAdmin from './useLeagueAdmin';
import useFirestoreRefs from './useFirestoreRefs';

export default function useGame() {
  const {} = useLeagueAdmin();

  const route = useRoute();
  const gameId = route.params.gameId as GameId;

  const { gamesColRef: colRef, getGameRef } = useFirestoreRefs();
  const docRef: DocumentReference | undefined = getGameRef(gameId);
  const item = docRef
    ? useDocument<Game>(docRef, { reset: false, wait: true })
    : ref<Game | null>(null);

  return {
    colRef,
    docRef,
    item,
  };
}
