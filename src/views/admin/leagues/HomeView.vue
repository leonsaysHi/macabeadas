<script lang="ts" setup>
import { computed, inject, provide } from 'vue';
import { rootProvided, adminLeagueProvided } from '@/types/injections';
import { useRoute } from 'vue-router';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';
import type { Team } from '@/types/teams';
import SpinnerComp from '@/components/SpinnerComp.vue';
import type { Game } from '@/types/games';

const db = useFirestore();
const route = useRoute();
const injectedData = inject(rootProvided);

const leagueId = route.params.leagueId as string;

const categories = injectedData?.categories;
const multies = injectedData?.multies;
const leagues = injectedData?.leagues;
const league = computed(() => leagues?.value.find((item) => item.id === leagueId));
const multi = computed(() => multies?.value.find((item) => league.value?.multiId === item.id));
const categorie = computed(() =>
  categories?.value.find((item) => multi.value?.categorieId === item.id),
);

const teamsColRef = collection(db, `leagues/${leagueId}/teams`);
const gamesColRef = collection(db, `leagues/${leagueId}/games`);

const { data: teams, pending: isTeamsPending } = useCollection<Team>(teamsColRef);
const { data: games, pending: isGamesPending } = useCollection<Game>(gamesColRef);

provide(adminLeagueProvided, {
  teams,
  games,
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
      <RouterLink class="nav-link" :to="{ name: 'admin-league', params: { leagueId } }">
        {{ $t('admin.games.title', 2) }}
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'admin-league-teams', params: { leagueId } }">
        {{ $t('admin.teams.title', 2) }}
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'admin-league-fases', params: { leagueId } }">
        {{ $t('admin.fases.title', 2) }}
      </RouterLink>
    </li>
  </ul>
  <template v-if="isTeamsPending || isGamesPending">
    <div class="p-5 hstack justify-content-center">
      <SpinnerComp />
    </div>
  </template>
  <template v-else>
    <RouterView />
  </template>
</template>
