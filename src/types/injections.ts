import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { Categorie } from './categories';
import type { League } from './leagues';
import type { Multi } from './multies';
import type { Sponsor } from './sponsors';
import type { Team } from './teams';
import type { Game } from './games';
import type { Settings } from './settings';
import type { Player } from './players';
import type { Court, Facilitie } from './facilities';

export const rootProvided = Symbol() as InjectionKey<{
  settings: ComputedRef<Settings>;
  categories: Ref<Categorie[]>;
  multies: Ref<Multi[]>;
  leagues: Ref<League[]>;
  sponsors: Ref<Sponsor[]>;
  players: Ref<Player[]>;
  facilities: Ref<Facilitie[]>;
  courts: Ref<Court[]>;
  isEditor?: Ref<boolean>;
}>;

export const adminLeagueProvided = Symbol() as InjectionKey<{
  teams: Ref<Team[]>;
  games: Ref<Game[]>;
}>;
