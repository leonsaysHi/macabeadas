<template>
  <DataTableComp :fields="fields" :items="props.players">
    <template #row.playerId="{ value }">
      {{ getPlayer(value)?.fname1 }} {{ getPlayer(value)?.lname1 }}
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

const { getTeamSponsor, getPlayer } = useLeague();

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
</script>

<style scoped lang="scss"></style>
