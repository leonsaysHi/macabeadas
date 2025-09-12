import type { Game } from '@/types/games';
import type { GameComputed, PlayerComputed } from '@/types/leaguesComputed';
import type { Player } from '@/types/players';
import { isDate, parseISO } from 'date-fns';
import {
  QueryDocumentSnapshot,
  Timestamp,
  type DocumentData,
  type SnapshotOptions,
} from 'firebase/firestore';

export const dateToTimeStamp = (date: Date = new Date()): Timestamp => {
  return Timestamp.fromDate(isDate(date) ? date : parseISO(date));
};

export const dateToFireStore = (date: Date): Timestamp => {
  return dateToTimeStamp(date);
};

export const playerConverter = {
  toFirestore: (row: Player): DocumentData => {
    return {
      ...row,
      dob: row.dob ? dateToFireStore(row.dob) : undefined,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Player => {
    const data = snapshot.data(options)!;
    return {
      ...data,
      id: snapshot.id,
      dob: data.dob?.toDate(),
    } as Player;
  },
};

export const gameConverter = {
  toFirestore: (row: Game): DocumentData => {
    return {
      ...row,
      datetime: row.datetime ? dateToFireStore(row.datetime) : undefined,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Game => {
    const data = snapshot.data(options)!;
    return {
      ...data,
      id: snapshot.id,
      datetime: data.datetime?.toDate(),
    } as Game;
  },
};

export const computedGameConverter = {
  toFirestore: (row: GameComputed): DocumentData => {
    return {
      ...row,
      datetime: row.datetime ? dateToFireStore(row.datetime) : undefined,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): GameComputed => {
    const data = snapshot.data(options)!;
    return {
      ...data,
      datetime: data.datetime?.toDate(),
    } as GameComputed;
  },
};
