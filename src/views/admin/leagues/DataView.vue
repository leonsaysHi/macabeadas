<script lang="ts" setup>
import SpinnerComp from '@/components/SpinnerComp.vue';
import { leagueAdminProvided } from '@/types/injections';
import { computed, provide } from 'vue';
import { useCollection } from 'vuefire';
import type { Team } from '@/types/teams';
import type { Game } from '@/types/games';
import type { Fase } from '@/types/fases';
import type { FirestoreError } from 'firebase/firestore';
import useFirestoreRefs from '@/composables/useFirestoreRefs';

const { teamsColRef, gamesColRef, fasesColRef } = useFirestoreRefs();
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
</script>

<template>
  <template v-if="!isReady">
    <div class="p-5 hstack justify-content-center">
      <SpinnerComp />
    </div>
  </template>
  <template v-else-if="hasError">
    {{ hasError }}
  </template>
  <template v-else>
    <RouterView />
  </template>
</template>
