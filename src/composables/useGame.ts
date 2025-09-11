import type { Game, GameId } from '@/types/games';
import { DocumentReference } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import { useDocument } from 'vuefire';
import useFirestoreRefs from './useFirestoreRefs';
import { computed } from 'vue';
import useLeague from './useLeague';
import type { LeagueComputedGroup, LeagueComputedTeamStats } from '@/types/leaguesComputed';

export default function useGame() {
  const route = useRoute();
  const gameId = route.params.gameId as GameId;

  const { getGameRef } = useFirestoreRefs();
  const docRef: DocumentReference = getGameRef(gameId);
  const { data: item, pending, error } = useDocument<Game>(docRef, { reset: false, wait: true });
  const isReady = computed(() => !pending.value && item.value);

  const { fases, getGroups, getCourtDetails } = useLeague();
  const fase = computed(() => fases.value.find(({ faseId }) => faseId === item.value?.faseId));
  const group = computed(() =>
    getGroups(item.value?.faseId as string)?.find(
      ({ teams }: LeagueComputedGroup) =>
        teams.findIndex(({ teamId }: LeagueComputedTeamStats) => teamId === item.value?.team1) > -1,
    ),
  );
  const court = computed(() =>
    item?.value?.courtId ? getCourtDetails(item?.value?.courtId) : undefined,
  );
  return {
    isReady,
    hasError: error,
    item,
    fase,
    group,
    court,
  };
}
