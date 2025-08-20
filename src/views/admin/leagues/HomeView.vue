<script lang="ts" setup>
import { computed, inject } from 'vue';
import { rootProvided } from '@/types/injections';
import { useRoute } from 'vue-router';
const route = useRoute();
const injectedData = inject(rootProvided);

const leagueId = computed<string>(() => route.params.leagueId as string);

const categories = injectedData?.categories;
const multies = injectedData?.multies;
const leagues = injectedData?.leagues;
const league = computed(() => leagues?.value.find((item) => item.id === leagueId.value));
const multi = computed(() => multies?.value.find((item) => league.value?.multiId === item.id));
const categorie = computed(() =>
  categories?.value.find((item) => multi.value?.categorieId === item.id),
);
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
  <RouterView />
</template>
