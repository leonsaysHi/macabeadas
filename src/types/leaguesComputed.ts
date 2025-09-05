import type { LeagueId, Sport } from './leagues';
import type { TeamId, TeamPlayer } from './teams';

export interface LeagueComputedTeamStats {
  sport: Sport;
  pos: number;
  w: number;
  gp: number;
}
export interface LeagueComputedTeam {
  teamId: TeamId;
  leagueId: LeagueId;
  stats: LeagueComputedTeamStats;
}

export interface LeagueComputedPlayerStats {
  sport: Sport;
  gp: number;
}
export interface LeagueComputedPlayer extends TeamPlayer {
  teamId: TeamId;
  leagueId: LeagueId;
  stats: LeagueComputedPlayerStats;
}
