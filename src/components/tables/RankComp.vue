<template>
  <DataTableComp :fields="fields" :items="props.teams">
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
import { useI18n } from 'vue-i18n';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import useLeague from '@/composables/useLeague';
import type { ComputedTeamStats } from '@/types/leaguesComputed';
import type { SponsorId } from '@/types/sponsors';
import type { TeamId } from '@/types/teams';
import ImageComp from '../form/ImageComp.vue';
import type { TableField } from '@/types/comp-datatable';

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

const { getSponsor } = useLeague();

const fields: TableField[] = [
  { key: 'pos', label: t('statistics.pos'), formatter: (value, item) => item.stats.pos },
  { key: 'teamId', label: t('globals.team') },
  { key: 'gp', label: t('statistics.gp'), formatter: (value, item) => item.stats.gp },
  { key: 'w', label: t('statistics.w'), formatter: (value, item) => item.stats.w },
];
</script>

<style scoped lang="scss"></style>
