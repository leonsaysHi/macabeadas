export type TeamId = string;
export type PlayerId = string;

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
