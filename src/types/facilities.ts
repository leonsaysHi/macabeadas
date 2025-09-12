export type FacilitieId = string;
export type CourtId = string;

// data
export interface Court {
  id?: CourtId;
  facilitieId: FacilitieId;
  title: string;
}
export interface Facilitie {
  id?: FacilitieId;
  title: string;
  link: string;
  map: string;
}
export interface CourtDetails extends Facilitie {
  facilitieId: FacilitieId;
  courtTitle: string;
}
export interface FacilitieDetails extends Facilitie {
  courts: Court[];
}
