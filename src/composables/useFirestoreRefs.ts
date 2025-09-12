import type { FacilitieId } from '@/types/facilities';
import type { PlayerId } from '@/types/players';
import type { UserId } from '@/types/users';
import { collection, collectionGroup, doc, query, where } from 'firebase/firestore';

import { useFirestore } from 'vuefire';

export default function useFirestoreLeagueRefs() {
  const db = useFirestore();
  const usersColRef = collection(db, 'users');
  const categoriesColRef = collection(db, 'categories');
  const multiesColRef = collection(db, 'multies');
  const leaguesColRef = collection(db, 'leagues');
  const facilitiesColRef = collection(db, 'facilities');
  const courtsColRef = collection(db, 'courts');
  const getUserRef = (userId: UserId) => doc(usersColRef, userId);
  const getFacilitieRef = (facilitieId: FacilitieId) => doc(facilitiesColRef, facilitieId);

  const getComputedPlayerColGroupRef = (playerId: PlayerId) =>
    query(collectionGroup(db, 'computed-players'), where('playerId', '==', playerId));

  return {
    usersColRef,
    categoriesColRef,
    multiesColRef,
    facilitiesColRef,
    courtsColRef,
    leaguesColRef,
    getFacilitieRef,
    getUserRef,
    getComputedPlayerColGroupRef,
  };
}
