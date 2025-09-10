import type { FaseId } from './fases';
import type { GameId, GameStatus } from './games';
import type { LeagueId, Sport } from './leagues';
import type { SponsorId } from './sponsors';
import type { Last5, Team, TeamId, TeamPlayer } from './teams';
import type { CourtId, FacilitieId } from './facilities';

// Computed League
export interface LeagueComputed {
  leagueId: LeagueId;
  teams: Team[];
  fases: LeagueComputedFase[];
}
// ...Fase / Group
export interface LeagueComputedFase {
  faseId: FaseId;
  title: string;
  groups: LeagueComputedGroup[];
}
export interface LeagueComputedGroup {
  title: string;
  teams: LeagueComputedTeam[];
  players: LeagueComputedPlayer[];
}
// ...Team
export interface LeagueComputedTeam {
  teamId: TeamId;
  sponsorId: SponsorId;
  stats: ComputedTeamStats;
}
export interface ComputedTeamStats {
  sport: Sport;
  pos: number;
  w: number;
  gp: number;
  last5: Last5;
}
// ...Player
export interface LeagueComputedPlayer extends TeamPlayer {
  teamId: TeamId;
  sponsorId: SponsorId;
  stats: ComputedPlayerStats;
}
export interface ComputedPlayerStats {
  sport: Sport;
  gp: number;
}

// Computed Games
export interface GameComputed {
  gameId: GameId;
  faseId: FaseId;
  groupIdx: number;
  datetime: Date;
  status: GameStatus;
  team1: { teamId: TeamId; sponsorId: SponsorId };
  team2: { teamId: TeamId; sponsorId: SponsorId };
  scores1: number[];
  scores2: number[];
  scoreFinal1: number;
  scoreFinal2: number;
  facilityId: FacilitieId;
  courtId: CourtId;
}

// Computed Team
export interface TeamComputed extends LeagueComputedTeam {
  leagueId: LeagueId;
}
// Computed Player
export interface PlayerComputed extends LeagueComputedPlayer {
  leagueId: LeagueId;
}
