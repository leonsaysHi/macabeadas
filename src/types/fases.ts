import type { TeamId } from './teams';
export type FaseId = string;
export type FaseType = 'groups' | 'playins' | 'playoffs' | undefined;
export type FaseGroup = {
  title: string;
  teams: TeamId[];
};
export interface Fase {
  id?: FaseId;
  title: string;
  type: FaseType;
  groups: FaseGroup[];
}
