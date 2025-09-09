<template>
  <DataTableComp :fields="fields" :items="items">
    <template #row.teamId="{ item }">
      <div class="hstack gap-2">
        <ImageComp :src="getSponsor(item.sponsorId)?.logo" :width="35" />
        <span
          class="px-2 align-self-stretch"
          :style="`background-color: ${getSponsor(item.sponsorId)?.color};`"
        ></span>
        {{ getSponsor(item.sponsorId)?.title }}
      </div>
    </template>
  </DataTableComp>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import useLeague from '@/composables/useLeague';
import type { ComputedTeamStats } from '@/types/leaguesComputed';
import type { SponsorId } from '@/types/sponsors';
import type { TeamId } from '@/types/teams';
import ImageComp from '../form/ImageComp.vue';

export interface Rank {
  teamId: TeamId;
  sponsorId: SponsorId;
  stats: ComputedTeamStats[];
}
export interface MergedRank {
  teamId: TeamId;
  sponsorId: SponsorId;
  stats: ComputedTeamStats;
}

interface IProps {
  teams: Rank[];
}

const { t } = useI18n();
const props = withDefaults(defineProps<IProps>(), {});

const { getSponsor } = useLeague();

const fields = [
  { key: 'teamId', label: t('globals.team') },
  { key: 'pos', label: t('statistics.pos'), formatter: (value, item) => item.stats.pos },
  { key: 'gp', label: t('statistics.gp'), formatter: (value, item) => item.stats.gp },
  { key: 'w', label: t('statistics.w'), formatter: (value, item) => item.stats.w },
];

const mergeRankStats = (items: ComputedTeamStats[]): ComputedTeamStats => {
  return items.reduce((acc: ComputedTeamStats, stats: ComputedTeamStats) => {
    const mergable = ['gp', 'w'];
    Object.keys(stats).forEach((key: string) => {
      if (mergable.includes(key) && typeof stats[key] === 'number') {
        acc[key] = typeof acc[key] === 'number' ? acc[key] + stats[key] : stats[key];
      } else {
        acc[key] = stats[key];
      }
    });
    return acc;
  }, {} as ComputedTeamStats);
};
const items = computed<MergedRank[]>(() =>
  props.teams
    .map(
      (item): MergedRank => ({
        ...item,
        stats: mergeRankStats(item.stats),
      }),
    )
    .toSorted((a: MergedRank, b: MergedRank) => {
      return a.stats.gp / a.stats.w - b.stats.gp / b.stats.w;
    })
    .map((item: MergedRank, idx: number) => {
      item.stats.pos = idx + 1;
      return item;
    }),
);
</script>

<style scoped lang="scss"></style>
