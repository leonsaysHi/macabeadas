<script lang="ts" setup>
import ImageComp from '@/components/form/ImageComp.vue';
import useLeague from '@/composables/useLeague';
import type { LeagueComputedTeam } from '@/types/leaguesComputed';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const { leagueId, teams, getSponsor } = useLeague();
const items = computed<(LeagueComputedTeam & { to: object })[]>(() =>
  teams.value.map((item: LeagueComputedTeam) => ({
    to: { name: 'league-team', params: { leagueId, teamId: item.teamId } },
    ...item,
  })),
);
</script>

<template>
  <section>
    <div class="row row-cols-2 row-cols-md-4 g-4">
      <template v-for="item in items" :key="item.id">
        <div class="col">
          <div class="card">
            <RouterLink :to="item.to">
              <ImageComp
                :src="getSponsor(item.sponsorId)?.logo"
                class="card-img-top"
                width="100%"
              />
            </RouterLink>
            <div class="card-body">
              <RouterLink :to="item.to" class="h5 card-title text-decoration-none">{{
                getSponsor(item.sponsorId)?.title
              }}</RouterLink>
              <div
                class="py-2 align-self-stretch"
                :style="`background-color: ${getSponsor(item.sponsorId)?.color};`"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
