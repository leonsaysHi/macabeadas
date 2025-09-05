import type { Court, Facilitie } from '@/types/facilities';
import type { Game, GameId } from '@/types/games';
import { adminLeagueProvided, rootProvided } from '@/types/injections';
import type { LeagueId } from '@/types/leagues';
import type { Sponsor } from '@/types/sponsors';
import type { Team } from '@/types/teams';
import { gameConverter } from '@/utils/firestore';
import { collection, doc, DocumentReference, type CollectionReference } from 'firebase/firestore';
import { inject, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDocument, useFirestore } from 'vuefire';

export default function useCurrentGame() {
  const db = useFirestore();
  const injectedRootData = inject(rootProvided);

  const { sponsors, facilities, courts } = injectedRootData as {
    sponsors: Ref<Sponsor[]>;
    facilities: Ref<Facilitie[]>;
    courts: Ref<Court[]>;
  };

  const injectedAdminLeagueData = inject(adminLeagueProvided);
  const { teams } = injectedAdminLeagueData as { teams: Ref<Team[]> };

  const route = useRoute();
  const leagueId = route.params.leagueId as LeagueId;
  const gameId = route.params.gameId as GameId;

  const colRef: CollectionReference<Game> = collection(
    db,
    `leagues/${leagueId}/games`,
  ).withConverter(gameConverter);

  const docRef: DocumentReference | undefined = gameId ? doc(colRef, gameId) : undefined;
  const item = docRef
    ? useDocument<Game>(docRef, { reset: false, wait: true })
    : ref<Game | null>(null);

  return {
    colRef,
    docRef,
    item,
  };
}
