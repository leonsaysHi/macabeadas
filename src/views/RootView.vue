<script setup lang="ts">
import type { Settings } from '@/types/settings';
import { collection } from 'firebase/firestore';
import { RouterView } from 'vue-router';
import { useCollection, useFirestore } from 'vuefire';

import { computed, provide } from 'vue';
import SpinnerComp from '@/components/SpinnerComp.vue';
import type { Categorie } from '@/types/categories';
import type { League } from '@/types/leagues';
import { rootProvided } from '@/types/injections';
import type { Multi } from '@/types/multies';
import type { Sponsor } from '@/types/sponsors';
import type { Player } from '@/types/players';
import type { Court, Facilitie } from '@/types/facilities';
import { playerConverter } from '@/utils/firestore';

const db = useFirestore();
const settingsColRef = collection(db, 'settings');
const categoriesColRef = collection(db, 'categories');
const multiesColRef = collection(db, 'multies');
const leaguesColRef = collection(db, 'leagues');
const sponsorsColRef = collection(db, 'sponsors');
const playersColRef = collection(db, 'players').withConverter(playerConverter);
const facilitiesColRef = collection(db, 'facilities');
const courtsColRef = collection(db, 'courts');

const { data: settingsList, pending: isSetsPending } = useCollection<Settings>(settingsColRef, {
  once: true,
});
const { data: categories, pending: isCatsPending } = useCollection<Categorie>(categoriesColRef, {
  once: true,
});
const { data: multies, pending: isMulsPending } = useCollection<Multi>(multiesColRef, {
  once: true,
});
const { data: leagues, pending: isLeasPending } = useCollection<League>(leaguesColRef, {
  once: true,
});
const { data: sponsors, pending: isSposPending } = useCollection<Sponsor>(sponsorsColRef, {
  once: true,
});
const { data: players, pending: isPlasPending } = useCollection<Player>(playersColRef, {
  once: true,
});
const { data: facilities, pending: isFacsPending } = useCollection<Facilitie>(facilitiesColRef, {
  once: true,
});
const { data: courts, pending: isCousPending } = useCollection<Court>(courtsColRef, {
  once: true,
});

const settings = computed<Settings>(
  () => (Array.isArray(settingsList.value) ? settingsList.value[0] : {}) as Settings,
);

provide(rootProvided, {
  settings,
  categories,
  multies,
  leagues,
  sponsors,
  players,
  facilities,
  courts,
});
</script>

<template>
  <nav class="navbar bg-body-secondary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand d-flex align-items-center gap-2" :to="{ name: 'home' }">
        <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="50" height="70" />
        <span :style="`color: ${settings.color || ''};`">{{ settings?.title || '#f00' }}</span>
      </RouterLink>
    </div>
  </nav>
  <div class="container-fluid">
    <template
      v-if="
        isSetsPending ||
        isCatsPending ||
        isMulsPending ||
        isLeasPending ||
        isSposPending ||
        isPlasPending ||
        isFacsPending ||
        isCousPending
      "
    >
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
