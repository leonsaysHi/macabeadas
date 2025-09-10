<script lang="ts" setup>
import useLeague from '@/composables/useLeague';

const { categorie, multi, leagueId, league } = useLeague();
</script>

<template>
  <h4>{{ $t('admin.leagues.title') }}</h4>
  <h2 class="hstack gap-2">
    <strong>{{ $t(`globals.sports.${league?.sport}`) }}</strong
    ><small class="text-secondary">{{ categorie?.title }}</small>
    <small class="badge" :style="`background-color: ${multi?.color}`">{{
      $t(`globals.genders.${multi?.gender}`)
    }}</small>
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
