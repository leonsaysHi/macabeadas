export type TeamId = string;
export type GameState = 'none' | 'live' | 'finished' | undefined;
// data
export interface Game {
  id?: TeamId;
  datetime: string;
  teams: TeamId[];
  state: GameState;
}
