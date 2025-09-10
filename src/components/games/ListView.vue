<template>
  <ul class="list-group list-group-flush border-top border-bottom">
    <template v-if="!items.length">
      <div class="list-group-item text-center text-body-secondary">No games.</div>
    </template>
    <template v-else>
      <template v-for="item in items" :key="item.id">
        <RouterLink class="hstack gap-2 list-group-item list-group-item-action lh-1" :to="item.to">
          <div class="team vstack gap-1 align-items-center">
            <ImageComp :src="getSponsor(item.team1.sponsorId)?.logo" :width="45" />
            <strong class="font-team fs-6 lh-1">{{
              getSponsor(item.team1.sponsorId)?.title
            }}</strong>
          </div>

          <div class="">
            <template v-if="item.status === 'live'">
              <div class="vstack gap-1">
                <div class="text-success text-center">{{ t('global.gameDetails.live') }}</div>
                <div class="hstack gap-2 justify-content-center">
                  <div
                    class="flex-grow-1 p-2 border border-3 rounded-2"
                    :class="[item.scoreFinal1 > item.scoreFinal2 ? 'border-win' : 'border-loss']"
                  >
                    <strong class="font-score fs-3 lh-1 pt-1">{{ item.scoreFinal1 }}</strong>
                  </div>
                  <SpinnerComp grow variant="success" size="sm" />
                  <div
                    class="flex-grow-1 p-2 border border-3 rounded-2"
                    :class="[item.scoreFinal1 < item.scoreFinal2 ? 'border-win' : 'border-loss']"
                  >
                    <strong class="font-score fs-3 lh-1 pt-1">{{ item.scoreFinal2 }}</strong>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="item.status === 'finished'">
              <div class="vstack gap-1">
                <small class="text-center text-body-secondary">
                  <DateFormat :value="item.datetime" />
                </small>
                <div class="hstack gap-2 justify-content-center">
                  <div
                    class="flex-grow-1 p-2 border border-3 rounded-2"
                    :class="[item.scoreFinal1 > item.scoreFinal2 ? 'border-win' : 'border-loss']"
                  >
                    <strong class="font-score fs-3 lh-1 pt-1">{{ item.scoreFinal1 }}</strong>
                  </div>
                  <div
                    class="flex-grow-1 p-2 border border-3 rounded-2"
                    :class="[item.scoreFinal1 < item.scoreFinal2 ? 'border-win' : 'border-loss']"
                  >
                    <strong class="font-score fs-3 lh-1 pt-1">{{ item.scoreFinal2 }}</strong>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="vstack gap-1 align-items-center justify-content-center">
                <strong> <DateFormat :value="item.datetime" /></strong>
                <small class="text-body-secondary"
                  ><DateTimeFormat
                    :value="item.datetime"
                    time-only=""
                    time-style="short"
                    date-style="short"
                /></small>
              </div>
            </template>
          </div>

          <div class="team vstack gap-1 align-items-center">
            <ImageComp :src="getSponsor(item.team2.sponsorId)?.logo" :width="45" />
            <strong class="font-team fs-6">{{ getSponsor(item.team2.sponsorId)?.title }}</strong>
          </div>
        </RouterLink>
      </template>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import SpinnerComp from '../SpinnerComp.vue';
import { useI18n } from 'vue-i18n';
import DateFormat from '../ui/DateFormat.vue';
import DateTimeFormat from '../ui/DateTimeFormat.vue';
import useLeague from '@/composables/useLeague';
import ImageComp from '../form/ImageComp.vue';
import type { GameComputed } from '@/types/leaguesComputed';
import { computed } from 'vue';
const { t } = useI18n();

const { leagueId, getSponsor } = useLeague();

interface IProps {
  games: GameComputed[];
}
const props = withDefaults(defineProps<IProps>(), {});

const items = computed<(GameComputed & { to: object })[]>(() =>
  props.games.map((item: GameComputed) => ({
    to: { name: 'league-game', params: { leagueId, gameId: item.gameId } },
    ...item,
  })),
);
</script>
<style lang="scss" scoped>
.team {
  flex: 1;
}
</style>
