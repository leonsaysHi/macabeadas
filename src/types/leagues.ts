import type { FaseId } from './fases';
import type { Gender, MultiId } from './multies';
export type Sport = 'soccer' | 'basketball' | 'flag' | 'baseball' | 'kickball' | 'volleyball';
export type LeagueId = string;

export interface League {
  id?: LeagueId;
  multiId: MultiId;
  sport: Sport;
  fases: FaseId[];
}

export interface LeagueDetails {
  categorie: string;
  gender: Gender;
  sport: Sport;
  color: number;
  leagueId: LeagueId;
}
