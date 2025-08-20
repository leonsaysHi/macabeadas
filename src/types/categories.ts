export type Gender = 'm' | 'f' | undefined;
export type CategorieId = string;
export interface Categorie {
  id?: CategorieId;
  title: string;
  grades: number[];
}
