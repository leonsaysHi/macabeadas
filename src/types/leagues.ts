import type { MultiId } from './multies';
export type Sport = 'soccer' | 'basketball' | 'flag' | 'baseball' | 'kickball' | 'volleyball';
export interface League {
  id?: string;
  multiId: MultiId;
  sport: Sport;
}
