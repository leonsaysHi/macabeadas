<script lang="ts" setup>
import SpinnerComp from '@/components/SpinnerComp.vue';
import useFirestoreLeagueRefs from '@/composables/useFirestoreLeagueRefs';
import type { TeamComputed } from '@/types/leaguesComputed';
import type { TeamId } from '@/types/teams';
import type { DocumentReference } from 'firebase/firestore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDocument } from 'vuefire';

const route = useRoute();
const teamId = route.params.teamId as TeamId;
const { getComputedTeamRef } = useFirestoreLeagueRefs();
const docRef: DocumentReference = getComputedTeamRef(teamId);
const {
  data: item,
  pending,
  error,
} = useDocument<TeamComputed>(docRef, { reset: false, wait: true });
const isReady = computed(() => !pending.value && item.value);
</script>

<template>
  <section>
    <h2>{{ $t('globals.team') }}</h2>
    <template v-if="!isReady">
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else-if="error">
      {{ error }}
    </template>
    <template v-else> {{ item }}</template>
  </section>
</template>
