import type { CourtId } from './facilities';
import type { FaseId } from './fases';
import type { PlayerId, PlayerStatLine } from './players';
import type { TeamId } from './teams';
export type GameId = string;
export type GameStatus = 'none' | 'live' | 'finished';
export type GameBoxScore = { [key: PlayerId]: PlayerStatLine };
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
  boxscore: GameBoxScore;
}
