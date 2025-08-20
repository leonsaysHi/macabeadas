import type { InjectionKey, Ref } from 'vue';
import type { Categorie } from './categories';
import type { League } from './leagues';
import type { Multi } from './multies';

export const rootProvided = Symbol() as InjectionKey<{
  categories: Ref<Categorie[]>;
  multies: Ref<Multi[]>;
  leagues: Ref<League[]>;
}>;
