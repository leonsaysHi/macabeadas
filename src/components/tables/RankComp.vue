<template>
  <DataTableComp :fields="fields" :items="items">
    <template #row.teamId="{ item }">
      <div class="hstack gap-2">
        <ImageComp :src="getSponsor(item.sponsorId)?.logo" :width="35" />
        <span
          class="px-2 align-self-stretch"
          :style="`background-color: ${getSponsor(item.sponsorId)?.color};`"
        ></span>
        <RouterLink :to="item.to">{{ getSponsor(item.sponsorId)?.title }}</RouterLink>
      </div>
    </template>
    <template #row.last5="{ value }"><LastGames :items="value" /> </template>
  </DataTableComp>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import useLeague from '@/composables/useLeague';
import type { ComputedTeamStats } from '@/types/leaguesComputed';
import type { SponsorId } from '@/types/sponsors';
import type { TeamId } from '@/types/teams';
import ImageComp from '../form/ImageComp.vue';
import type { TableField } from '@/types/comp-datatable';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import LastGames from './LastGames.vue';

export interface RankTeam {
  teamId: TeamId;
  sponsorId: SponsorId;
  stats: ComputedTeamStats;
}

interface IProps {
  teams: RankTeam[];
}

const { t } = useI18n();
const props = withDefaults(defineProps<IProps>(), {});

const { leagueId, getSponsor } = useLeague();

const fields: TableField[] = [
  { key: 'pos', label: t('statistics.pos'), formatter: (value, item) => item.stats.pos },
  { key: 'teamId', label: t('globals.team') },
  { key: 'gp', label: t('statistics.gp'), formatter: (value, item) => item.stats.gp },
  { key: 'w', label: t('statistics.w'), formatter: (value, item) => item.stats.w },
  { key: 'last5', label: '', formatter: (value, item) => item.stats.last5 },
];

const items = computed<(RankTeam & { to: object })[]>(() =>
  props.teams.map((item: RankTeam) => ({
    to: { name: 'league-team', params: { leagueId, teamId: item.teamId } },
    ...item,
  })),
);
</script>

<style scoped lang="scss"></style>
