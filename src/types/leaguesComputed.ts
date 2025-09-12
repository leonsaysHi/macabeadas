import type { FaseId } from './fases';
import type { GameId, GameStatus } from './games';
import type { LeagueId, Sport } from './leagues';
import type { SponsorId } from './sponsors';
import type { Last5, Team, TeamId, TeamPlayer } from './teams';
import type { CourtId, FacilitieId } from './facilities';
import type { CategorieId } from './categories';

// Computed League
export interface LeagueComputed {
  leagueId: LeagueId;
  teams: LeagueComputedTeam[];
  fases: LeagueComputedFase[];
}
// League Teams
export interface LeagueComputedTeam {
  teamId: TeamId;
  sponsorId: SponsorId;
}
// League / Fase / Group
export interface LeagueComputedFase {
  faseId: FaseId;
  title: string;
  groups: LeagueComputedGroup[];
}
export interface LeagueComputedGroup {
  title: string;
  teams: LeagueComputedTeamStats[];
  players: LeagueComputedPlayerStats[];
}
// League / Fase / Team Stats
export interface LeagueComputedTeamStats {
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
// League / Fase / Player Stats
export interface LeagueComputedPlayerStats extends TeamPlayer {
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
  categorieId: CategorieId;
  leagueId: LeagueId;
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
  facilitieId: FacilitieId;
  courtId: CourtId;
}

// Computed Team: ItemView
export interface TeamComputed extends LeagueComputedTeamStats {
  leagueId: LeagueId;
}
// Computed Player: ItemView
export interface PlayerComputed extends LeagueComputedPlayerStats {
  leagueId: LeagueId;
}
