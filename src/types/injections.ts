import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { Categorie } from './categories';
import type { League } from './leagues';
import type { Multi } from './multies';
import type { Sponsor } from './sponsors';
import type { Settings } from './settings';
import type { Player } from './players';
import type { Court, Facilitie } from './facilities';
import type { Game } from './games';
import type { Team } from './teams';
import type { Fase } from './fases';
import type { LeagueComputed } from './leaguesComputed';

export interface RootInjections {
  settings: ComputedRef<Settings>;
  categories: Ref<Categorie[]>;
  multies: Ref<Multi[]>;
  leagues: Ref<League[]>;
  sponsors: Ref<Sponsor[]>;
  players: Ref<Player[]>;
  facilities: Ref<Facilitie[]>;
  courts: Ref<Court[]>;
  isEditor?: Ref<boolean>;
}
export const rootProvided = Symbol() as InjectionKey<RootInjections>;

export interface LeagueInjections {
  leagueComputed: Ref<LeagueComputed>;
  games: Ref<Game[]>;
}
export const leagueProvided = Symbol() as InjectionKey<LeagueInjections>;
export interface LeagueAdminInjections {
  games: Ref<Game[]>;
  teams: Ref<Team[]>;
  fases: Ref<Fase[]>;
}
export const leagueAdminProvided = Symbol() as InjectionKey<LeagueAdminInjections>;
