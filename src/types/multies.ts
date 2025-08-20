import type { CategorieId } from './categories';
export type Gender = 'm' | 'f' | undefined;
export type MultiId = string;
export interface Multi {
  id?: MultiId;
  categorieId: CategorieId;
  gender: Gender;
  color: string | number;
}
