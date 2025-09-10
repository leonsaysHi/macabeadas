<template>
  <DataTableComp :fields="fields" :items="items">
    <template #row.playerId="{ value, item }">
      <RouterLink :to="item.to"
        >{{ getPlayer(value)?.fname1 }} {{ getPlayer(value)?.lname1 }}</RouterLink
      >
    </template>
    <template #row.teamId="{ value }">
      <div class="hstack gap-2">
        <ImageComp :src="getTeamSponsor(value)?.logo" :width="35" />
      </div>
    </template>
  </DataTableComp>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import useLeague from '@/composables/useLeague';
import type { ComputedPlayerStats } from '@/types/leaguesComputed';
import type { TeamId } from '@/types/teams';
import ImageComp from '../form/ImageComp.vue';
import type { PlayerId } from '@/types/players';
import type { TableField } from '@/types/comp-datatable';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

export interface StatsPlayer {
  playerId: PlayerId;
  teamId: TeamId;
  number: string;
  stats: ComputedPlayerStats;
}

interface IProps {
  players: StatsPlayer[];
}

const { t } = useI18n();
const props = withDefaults(defineProps<IProps>(), {});

const { leagueId, getTeamSponsor, getPlayer } = useLeague();

const fields: TableField[] = [
  { key: 'teamId', label: t('globals.team') },
  { key: 'playerId', label: t('globals.player'), sortable: true },
  {
    key: 'gp',
    label: t('statistics.gp'),
    sortable: true,
    sortByFormatted: true,
    formatter: (value, item) => Number(item.stats.gp),
  },
];

const items = computed<(StatsPlayer & { to: object })[]>(() =>
  props.players.map((item: StatsPlayer) => ({
    to: { name: 'league-player', params: { leagueId, playerId: item.playerId } },
    ...item,
  })),
);
</script>

<style scoped lang="scss"></style>
