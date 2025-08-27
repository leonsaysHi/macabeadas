import type { MultiId } from './multies';
export type Sport = 'soccer' | 'basketball' | 'flag' | 'baseball' | 'kickball' | 'volleyball';
export type LeagueId = string;
export interface League {
  id?: LeagueId;
  multiId: MultiId;
  sport: Sport;
}
