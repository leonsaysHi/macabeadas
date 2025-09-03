import type { CourtId } from './facilities';
import type { FaseId } from './fases';
import type { TeamId } from './teams';
export type GameId = string;
export type GameStatus = '' | 'live' | 'finished';
// data
export interface Game {
  id?: GameId;
  faseId: FaseId;
  datetime: Date | undefined;
  team1: TeamId;
  team2: TeamId;
  status: GameStatus;
  scores1: number[];
  scores2: number[];
  courtId: CourtId;
}
