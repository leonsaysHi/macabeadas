<script setup lang="ts">
import { collection } from 'firebase/firestore';
import { provide } from 'vue';
import { RouterView } from 'vue-router';
import { useCollection, useFirestore } from 'vuefire';
import SpinnerComp from '@/components/SpinnerComp.vue';
import type { Categorie } from './types/categories';
import type { League } from './types/leagues';
import { rootProvided } from './types/injections';
import type { Multi } from './types/multies';
import type { Sponsor } from './types/sponsors';

const db = useFirestore();
const categoriesColRef = collection(db, 'categories');
const multiesColRef = collection(db, 'multies');
const leaguesColRef = collection(db, 'leagues');
const sponsorsColRef = collection(db, 'sponsors');
const { data: categories, pending: isCategoriesPending } =
  useCollection<Categorie>(categoriesColRef);
const { data: multies, pending: isMultiesPending } = useCollection<Multi>(multiesColRef);
const { data: leagues, pending: isLeaguesPending } = useCollection<League>(leaguesColRef);
const { data: sponsors, pending: isSponsorsPending } = useCollection<Sponsor>(sponsorsColRef);

provide(rootProvided, {
  categories,
  multies,
  leagues,
  sponsors,
});
</script>

<template>
  <template v-if="isCategoriesPending || isMultiesPending || isLeaguesPending || isSponsorsPending">
    <div class="p-5 hstack justify-content-center">
      <SpinnerComp />
    </div>
  </template>
  <template v-else>
    <RouterView />
  </template>
</template>
