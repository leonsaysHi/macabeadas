import type { Gender } from './categories';

export type PlayerId = string;

// data
export interface Player {
  id?: PlayerId;
  fname: string;
  lname: string;
  gender: Gender;
  identification: string;
  dob: string;
}
