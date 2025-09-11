<script lang="ts" setup>
import SpinnerComp from '@/components/SpinnerComp.vue';
import DateTimeFormat from '@/components/ui/DateTimeFormat.vue';
import useGame from '@/composables/useGame';
import type { Game } from '@/types/games';
import { computed } from 'vue';

const { isReady, hasError, item, fase, group, court } = useGame();
const infos = computed(() => {
  const { datetime, team1, team2, status, scores1, scores2, courtId } = (item.value || {}) as Game;
  return { datetime, team1, team2, status, scores1, scores2, courtId };
});

const boxscore = computed(() => item.value?.boxscore);
</script>

<template>
  <section>
    <h2>{{ $t('globals.game') }}</h2>
    <template v-if="!isReady">
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else-if="hasError">
      {{ hasError }}
    </template>
    <template v-else>
      <div>
        Fase: {{ fase?.title }}
        <hr />
        Group: {{ group?.title }}
        <hr />
        <DateTimeFormat :value="item?.datetime" />
        <hr />
        Body: {{ infos }}
        <hr />
        Court: {{ court }}
        <hr />
        Stats: {{ boxscore }}
      </div>
    </template>
  </section>
</template>
