<script lang="ts" setup>
import SpinnerComp from '@/components/SpinnerComp.vue';
import useFirestoreRefs from '@/composables/useFirestoreRefs';
import useRootProvided from '@/composables/useRootProvided';
import type { PlayerComputed } from '@/types/leaguesComputed';
import type { PlayerId } from '@/types/players';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCollection } from 'vuefire';

const route = useRoute();
const { getPlayer, getSponsor, getLeagueDetails } = useRootProvided();
const { getComputedPlayerColGroupRef } = useFirestoreRefs();

const playerId = route.params.playerId as PlayerId;
const playerLeaguesColRef = getComputedPlayerColGroupRef(playerId);

const { data: playerLeagues }: { playerLeagues: PlayerComputed } =
  useCollection(playerLeaguesColRef);

const isReady = computed(() => playerLeagues.value);
const player = computed(() => getPlayer(playerId));
const fullName = computed(() =>
  [player.value?.fname1, player.value?.fname2, player.value?.lname1, player.value?.lname2]
    .filter(Boolean)
    .join(' '),
);
</script>

<template>
  <section>
    <template v-if="!isReady">
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else>
      <p class="mb-0">{{ $t('globals.player') }}</p>
      <h2>{{ fullName }}</h2>
      <template v-for="league in playerLeagues" :key="league.leagueId">
        <hr />
        <div class="hstack gap-3">
          <div>{{ getLeagueDetails(league.leagueId) }}</div>
          <div>{{ getSponsor(league?.sponsorId)?.title }}</div>
          <div>#{{ league?.number }}</div>
          <div>{{ league.stats }}</div>
        </div>
      </template>
    </template>
  </section>
</template>
