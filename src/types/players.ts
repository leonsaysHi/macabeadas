import type { Gender } from './categories';

export type PlayerId = string;

// data
export interface Player {
  id?: PlayerId;
  fname1: string;
  fname2?: string;
  lname1: string;
  lname2?: string;
  gender: Gender;
  identification: string;
  dob?: Date;
}

export interface PlayerStatLine {
  dnp: number;
}
export type PlayerStatLineKey = keyof PlayerStatLine;
