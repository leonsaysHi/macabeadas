import type { FacilitieId } from '@/types/facilities';
import type { PlayerId } from '@/types/players';
import type { UserId } from '@/types/users';
import { playerConverter } from '@/utils/firestore';
import { collection, collectionGroup, doc, query, where } from 'firebase/firestore';

import { useFirestore } from 'vuefire';

export default function useFirestoreLeagueRefs() {
  const db = useFirestore();
  const usersColRef = collection(db, 'users');

  const settingsColRef = collection(db, 'settings');
  const categoriesColRef = collection(db, 'categories');
  const multiesColRef = collection(db, 'multies');
  const leaguesColRef = collection(db, 'leagues');

  const playersColRef = collection(db, 'players').withConverter(playerConverter);
  const sponsorsColRef = collection(db, 'sponsors');
  const facilitiesColRef = collection(db, 'facilities');
  const courtsColRef = collection(db, 'courts');
  const getUserRef = (userId: UserId) => doc(usersColRef, userId);
  const getFacilitieRef = (facilitieId: FacilitieId) => doc(facilitiesColRef, facilitieId);

  const getComputedPlayerColGroupRef = (playerId: PlayerId) =>
    query(collectionGroup(db, 'computed-players'), where('playerId', '==', playerId));

  return {
    usersColRef,
    settingsColRef,
    categoriesColRef,
    multiesColRef,
    leaguesColRef,
    playersColRef,
    sponsorsColRef,
    facilitiesColRef,
    courtsColRef,
    getFacilitieRef,
    getUserRef,
    getComputedPlayerColGroupRef,
  };
}
