import type { Court, CourtDetails, CourtId, Facilitie, FacilitieId } from '@/types/facilities';
import type { Game } from '@/types/games';
import { adminLeagueProvided, rootProvided } from '@/types/injections';
import type { Player, PlayerId } from '@/types/players';
import type { Sponsor, SponsorId } from '@/types/sponsors';
import type { Team, TeamId } from '@/types/teams';
import { inject, type Ref } from 'vue';

export default function useCurrentLeague() {
  const injectedRootData = inject(rootProvided);
  const { sponsors, facilities, courts, players } = injectedRootData as {
    sponsors: Ref<Sponsor[]>;
    facilities: Ref<Facilitie[]>;
    courts: Ref<Court[]>;
    players: Ref<Player[]>;
  };
  const injectedAdminLeagueData = inject(adminLeagueProvided);
  const { teams, games } = injectedAdminLeagueData as { teams: Ref<Team[]>; games: Ref<Game[]> };

  const getSponsor = (id: SponsorId | undefined): Sponsor | undefined => {
    return id && Array.isArray(injectedRootData?.sponsors.value)
      ? sponsors.value.find((item) => item.id === id)
      : undefined;
  };
  const getTeam = (id: TeamId | undefined): Team | undefined => {
    return id && Array.isArray(injectedAdminLeagueData?.teams.value)
      ? teams.value.find((item) => item.id === id)
      : undefined;
  };
  const getTeamTitle = (id: TeamId): string | undefined => {
    const sponsor = getSponsor(getTeam(id)?.sponsorId);
    return sponsor?.title;
  };
  const getTeamColor = (id: TeamId): string | number | undefined => {
    const sponsor = getSponsor(getTeam(id)?.sponsorId);
    return sponsor?.color;
  };
  const getCourtDetails = (id: CourtId): CourtDetails | undefined => {
    const court =
      id && Array.isArray(courts.value) ? courts.value.find((item) => item.id === id) : undefined;
    const facilitie =
      court?.facilitieId && Array.isArray(facilities.value)
        ? facilities.value.find((item) => item.id === court?.facilitieId)
        : undefined;
    return {
      ...facilitie,
      courtTitle: court?.title as string,
    } as CourtDetails;
  };

  const getPlayer = (id: PlayerId): Player => {
    return players.value.find((item) => item.id === id) as Player;
  };

  return {
    getSponsor,
    getTeam,
    getCourtDetails,
    getTeamTitle,
    getTeamColor,
    getPlayer,
  };
}
