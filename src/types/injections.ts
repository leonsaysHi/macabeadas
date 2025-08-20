import type { InjectionKey, Ref } from 'vue';
import type { Categorie } from './categories';
import type { League } from './leagues';
import type { Multi } from './multies';
import type { Sponsor } from './sponsors';
import type { Team } from './teams';
import type { Game } from './games';

export const rootProvided = Symbol() as InjectionKey<{
  categories: Ref<Categorie[]>;
  multies: Ref<Multi[]>;
  leagues: Ref<League[]>;
  sponsors: Ref<Sponsor[]>;
}>;

export const adminLeagueProvided = Symbol() as InjectionKey<{
  teams: Ref<Team[]>;
  games: Ref<Game[]>;
}>;
