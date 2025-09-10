import type { RankTeam } from '@/components/stats/RankComp.vue';
import type { CourtId, FacilitieId } from './facilities';
import type { FaseId } from './fases';
import type { GameBoxScore, GameId, GameStatus } from './games';

// data
export interface GameComputed {
  gameId: GameId;
  faseId: FaseId;
  groupIdx: number;
  to: object;
  datetime: Date;
  status: GameStatus;
  team1: RankTeam;
  team2: RankTeam;
  scores1: number[];
  scores2: number[];
  scoreFinal1: number;
  scoreFinal2: number;
  total1: number;
  total2: number;
  facilityId: FacilitieId;
  courtId: CourtId;
  boxscore: GameBoxScore;
}
