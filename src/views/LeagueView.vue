<script lang="ts" setup>
import useLeagueComputed from '@/composables/useLeagueComputed';

const { leagueId, leagueDetails } = useLeagueComputed();
</script>

<template>
  <h2 class="hstack gap-2">
    <strong>{{ leagueDetails.categorie }}</strong
    ><span class="badge" :style="`background-color: ${leagueDetails.color}`">{{
      $t(`globals.sports.${leagueDetails.sport}`)
    }}</span>
    <small class="text-secondary">{{ $t(`globals.genders.${leagueDetails.gender}`) }}</small>
  </h2>

  <ul class="nav nav-tabs mb-4">
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'league-games', params: { leagueId } }">
        {{ $t('globals.game', 2) }}
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'league-rank', params: { leagueId } }">
        {{ $t('globals.rank') }}
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'league-stats', params: { leagueId } }">
        {{ $t('globals.stats', 2) }}
      </RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" :to="{ name: 'league-teams', params: { leagueId } }">
        {{ $t('globals.team', 2) }}
      </RouterLink>
    </li>
  </ul>
  <RouterView />
</template>
