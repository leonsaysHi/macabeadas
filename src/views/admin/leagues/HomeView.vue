<script lang="ts" setup>
import { computed, inject, provide } from 'vue';
import { useRoute } from 'vue-router';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';
import { rootProvided, adminLeagueProvided } from '@/types/injections';
import type { Team } from '@/types/teams';
import type { Game } from '@/types/games';
import type { League } from '@/types/leagues';
import type { Multi } from '@/types/multies';
import type { Categorie } from '@/types/categories';
import type { Fase } from '@/types/fases';
import SpinnerComp from '@/components/SpinnerComp.vue';
import { gameConverter } from '@/utils/firestore';

const db = useFirestore();
const route = useRoute();
const injectedData = inject(rootProvided);

const leagueId = route.params.leagueId as string;

const categories = injectedData?.categories;
const multies = injectedData?.multies;
const leagues = injectedData?.leagues;

const league = computed<League | undefined>(() =>
  leagues?.value.find((item) => item.id === leagueId),
);
const multi = computed<Multi | undefined>(() =>
  multies?.value.find((item) => league.value?.multiId === item.id),
);
const categorie = computed<Categorie | undefined>(() =>
  categories?.value.find((item) => multi.value?.categorieId === item.id),
);

const teamsColRef = collection(db, `leagues/${leagueId}/teams`);
const gamesColRef = collection(db, `leagues/${leagueId}/games`).withConverter(gameConverter);
const fasesColRef = collection(db, `leagues/${leagueId}/fases`);

const { data: teams, pending: isTeamsPending } = useCollection<Team>(teamsColRef);
const { data: games, pending: isGamesPending } = useCollection<Game>(gamesColRef);
const { data: fases, pending: isFasesPending } = useCollection<Fase>(fasesColRef);

provide(adminLeagueProvided, {
  league,
  multi,
  categorie,
  teams,
  games,
  fases,
});
</script>

<template>
  <h4>{{ $t('admin.leagues.title') }}</h4>
  <h2 class="hstack gap-2">
    <strong>{{ $t(`globals.sports.${league?.sport}`) }}</strong
    ><small class="text-secondary">{{ categorie?.title }}</small>
    <small class="badge" :style="`background-color: ${multi?.color}`">{{
      $t(`globals.genders.${multi?.gender}`)
    }}</small>
  </h2>
  <ul class="nav nav-tabs mb-4">
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'admin-league-teams', params: { leagueId } }">
        {{ teams?.length || '0' }}&nbsp;{{ $t('admin.teams.title', teams?.length || 2) }}
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'admin-league-fases', params: { leagueId } }">
        {{ fases?.length || '0' }}&nbsp;{{ $t('admin.fases.title', fases?.length || 0) }}
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'admin-league-games', params: { leagueId } }">
        {{ games?.length || '0' }}&nbsp;{{ $t('admin.games.title', games?.length || 0) }}
      </RouterLink>
    </li>
  </ul>
  <template v-if="isTeamsPending || isGamesPending || isFasesPending">
    <div class="p-5 hstack justify-content-center">
      <SpinnerComp />
    </div>
  </template>
  <template v-else>
    <RouterView />
  </template>
</template>
