import type { PlayerId } from './players';

export type TeamId = string;

export interface TeamPlayer {
  playerId: PlayerId;
  number: string;
}

// data
export interface Team {
  id?: TeamId;
  sponsorId: string;
  players: TeamPlayer[];
}
