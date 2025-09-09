<script lang="ts" setup>
import SpinnerComp from '@/components/SpinnerComp.vue';
import { leagueProvided } from '@/types/injections';
import { computed, provide } from 'vue';
import useFirestoreRefs from '@/composables/useFirestoreRefs';
import { useCollection, useDocument } from 'vuefire';
import type { Game } from '@/types/games';
import type { FirestoreError } from 'firebase/firestore';
import type { LeagueComputed } from '@/types/leaguesComputed';

const { gamesColRef, getComputedLeagueRef } = useFirestoreRefs();
const {
  data: games,
  pending: isGamesPending,
  error: gamesError,
} = useCollection<Game>(gamesColRef);

const {
  data: leagueComputed,
  pending: isComputedLeaguePending,
  error: computedLeagueError,
} = useDocument<LeagueComputed>(getComputedLeagueRef);

provide(leagueProvided, {
  games,
  leagueComputed,
});

const isReady = computed<boolean>(() => {
  return !isGamesPending.value || !isComputedLeaguePending.value;
});
const hasError = computed<{ messages: FirestoreError[] } | null>(() => {
  return gamesError.value
    ? ({ messages: [computedLeagueError.value, gamesError.value].filter(Boolean) } as {
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
