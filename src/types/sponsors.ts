export type SponsorId = string;
export interface Sponsor {
  id?: SponsorId;
  title: string;
  shortTitle: string;
  color: string | number;
  logo: string;
}
