import { rootProvided } from '@/types/injections';
import type { SponsorId } from '@/types/sponsors';
import type { League, LeagueDetails, LeagueId, Sport } from '@/types/leagues';
import type { MultiId } from '@/types/multies';
import type { CategorieId, Gender } from '@/types/categories';
import type {
  Court,
  CourtDetails,
  CourtId,
  Facilitie,
  FacilitieDetails,
  FacilitieId,
} from '@/types/facilities';
import type { PlayerId } from '@/types/players';
import { inject } from 'vue';

export default function useRootProvided() {
  const injectedRootData = inject(rootProvided);
  const categories = injectedRootData?.categories;
  const multies = injectedRootData?.multies;
  const leagues = injectedRootData?.leagues;
  const players = injectedRootData?.players;
  const sponsors = injectedRootData?.sponsors;
  const courts = injectedRootData?.courts;
  const facilities = injectedRootData?.facilities;

  const getLeague = (leagueId: LeagueId): League | undefined =>
    leagues?.value.find((item) => item.id === leagueId);
  const getMulti = (multiId: MultiId) => multies?.value.find((item) => item.id === multiId);
  const getCategorie = (categorieId: CategorieId) =>
    categories?.value.find((item) => item.id === categorieId);

  const getLeagueDetails = (leagueId: LeagueId): LeagueDetails => {
    const league = getLeague(leagueId);
    const multi = getMulti(league?.multiId as MultiId);
    const categorie = getCategorie(multi?.categorieId as CategorieId);
    return {
      leagueId: leagueId,
      categorieId: categorie?.id as CategorieId,
      categorie: categorie?.title as string,
      gender: multi?.gender as Gender,
      sport: league?.sport as Sport,
      color: multi?.color as number,
    };
  };
  const getFacilityDetails = (id: FacilitieId): FacilitieDetails => {
    const item = facilities?.value.find((item) => item.id === id);
    return {
      ...(item as Facilitie),
      courts: courts?.value.filter((item) => item.facilitieId === id) as Court[],
    };
  };
  const getCourtDetails = (id: CourtId): CourtDetails | undefined => {
    const court =
      id && Array.isArray(courts?.value) ? courts.value.find((item) => item.id === id) : undefined;
    const facilitie =
      court?.facilitieId && Array.isArray(facilities?.value)
        ? facilities.value.find((item) => item.id === court?.facilitieId)
        : undefined;
    return {
      facilitieId: facilitie?.docId as FacilitieId,
      ...facilitie,
      courtId: id as CourtId,
      courtTitle: court?.title as string,
    } as CourtDetails;
  };

  const getSponsor = (id: SponsorId) => sponsors?.value.find((item) => item.id === id);
  const getPlayer = (id: PlayerId) => players?.value.find((item) => item.id === id);

  return {
    categories,
    getLeague,
    getLeagueDetails,
    getSponsor,
    getCourtDetails,
    getFacilityDetails,
    getPlayer,
  };
}
