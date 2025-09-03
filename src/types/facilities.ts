export type FacilitieId = string;
export type CourtId = string;

// data
export interface CourtDetails extends Facilitie {
  courtTitle: string;
}
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
