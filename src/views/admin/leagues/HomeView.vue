<script lang="ts" setup>
import { useRoute } from 'vue-router';
import SpinnerComp from '@/components/SpinnerComp.vue';
import useLeagueAdmin from '@/composables/useLeagueAdmin';
import { leagueAdminProvided } from '@/types/injections';
import { computed, provide } from 'vue';
import { useCollection, useFirestore } from 'vuefire';
import type { Team } from '@/types/teams';
import type { Game } from '@/types/games';
import type { Fase } from '@/types/fases';
import { writeBatch, type FirestoreError } from 'firebase/firestore';
import useFirestoreRefs from '@/composables/useFirestoreRefs';
import type { PlayerComputed, TeamComputed } from '@/types/leaguesComputed';

const db = useFirestore();

const route = useRoute();
const leagueId = route.params.leagueId as string;

const {
  teamsColRef,
  gamesColRef,
  fasesColRef,
  getComputedLeagueRef,
  getComputedTeamRef,
  getComputedPlayerRef,
} = useFirestoreRefs();
const {
  data: teams,
  pending: isTeamsPending,
  error: teamsError,
} = useCollection<Team>(teamsColRef);
const {
  data: games,
  pending: isGamesPending,
  error: gamesError,
} = useCollection<Game>(gamesColRef);
const {
  data: fases,
  pending: isFasesPending,
  error: fasesError,
} = useCollection<Fase>(fasesColRef);

provide(leagueAdminProvided, {
  teams,
  games,
  fases,
});

const isReady = computed<boolean>(() => {
  return (!isTeamsPending.value && !isGamesPending.value) || !isFasesPending.value;
});
const hasError = computed<{ messages: FirestoreError[] } | null>(() => {
  return teamsError.value || gamesError.value || fasesError.value
    ? ({ messages: [teamsError.value, gamesError.value, fasesError.value].filter(Boolean) } as {
        messages: FirestoreError[];
      })
    : null;
});

const { league, multi, categorie, getComputedLeague, getComputedTeams, getComputedPlayers } =
  useLeagueAdmin();

const handleUpdatedGame = () => {
  const compLeagueRef = getComputedLeagueRef();
  if (compLeagueRef) {
    const batch = writeBatch(db);
    const computedLeague = getComputedLeague();
    batch.set(compLeagueRef, computedLeague);
    const computedTeams = getComputedTeams();
    computedTeams.forEach((item: TeamComputed) => {
      const docRef = getComputedTeamRef(item.teamId);
      if (docRef) {
        batch.set(docRef, item, { merge: true });
      }
    });
    const computedPlayers = getComputedPlayers();
    computedPlayers.forEach((item: PlayerComputed) => {
      const docRef = getComputedPlayerRef(item.playerId);
      if (docRef) {
        batch.set(docRef, item, { merge: true });
      }
    });
    batch.commit();
  }
};
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
  <template v-if="!isReady">
    <div class="p-5 hstack justify-content-center">
      <SpinnerComp />
    </div>
  </template>
  <template v-else-if="hasError">
    {{ hasError }}
  </template>
  <template v-else>
    <RouterView @updated="handleUpdatedGame" />
  </template>
</template>
