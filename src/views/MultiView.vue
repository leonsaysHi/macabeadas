<script setup lang="ts">
import { rootProvided } from '@/types/injections';
import type { League } from '@/types/leagues';
import { computed, inject } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const injectedData = inject(rootProvided);
const leagues = injectedData?.leagues;

const multiId = route.params.multiId;

const leaguesList = computed(() => {
  const result = leagues?.value.filter((item: League) => item.multiId === multiId);
  if (result) {
    result.sort((a, b) => a.sport.localeCompare(b.sport));
  }
  return result;
});
</script>

<template>
  <main>
    <ul class="list-group list-group-flush">
      <template v-for="item in leaguesList" :key="item.id">
        <li class="list-group-item">
          <RouterLink :to="{ name: 'league', params: { leagueId: item.id } }">{{
            $t(`globals.sports.${item.sport}`)
          }}</RouterLink>
        </li>
      </template>
    </ul>
  </main>
</template>
