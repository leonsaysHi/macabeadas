<script lang="ts" setup>
import SpinnerComp from '@/components/SpinnerComp.vue';
import useRootProvided from '@/composables/useRootProvided';
import type { FacilitieId } from '@/types/facilities';
import type { GameComputed } from '@/types/leaguesComputed';
import { computedGameConverter } from '@/utils/firestore';
import { collectionGroup, query, where } from 'firebase/firestore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCollection, useFirestore } from 'vuefire';

const db = useFirestore();
const route = useRoute();
const { getFacility } = useRootProvided();
// const { getFacilityComputedGamesColGroupRef } = useFirestoreRefs();

const facilitieId = route.params.facilitieId as FacilitieId;
const getFacilityComputedGamesColGroupRef = query(
  collectionGroup(db, 'computed-games'),
  where('facilitieId', '==', facilitieId),
);

const { data: computedGames }: { gameComputed: GameComputed } = useCollection(
  getFacilityComputedGamesColGroupRef.withConverter(computedGameConverter),
);
const upcomingGames = computed(() =>
  computedGames.value.filter((item: GameComputed) => ['live', 'none'].includes(item.status)),
);

const item = computed(() => getFacility(facilitieId));
const isReady = computed(() => item.value);
</script>

<template>
  <section>
    <template v-if="!isReady">
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else>
      <h4>{{ item?.title }}</h4>
      {{ item }}
      <hr />
      {{ upcomingGames }}
    </template>
  </section>
</template>
