<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/ui/DataTableComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import type { TableField } from '@/types/comp-datatable';
import ImageComp from '@/components/form/ImageComp.vue';
import type { SponsorId } from '@/types/sponsors';
import useLeagueAdmin from '@/composables/useLeagueAdmin';
import type { Team } from '@/types/teams';

const { t } = useI18n();

const { teams, getSponsor } = useLeagueAdmin();

const fields: TableField[] = [
  {
    key: 'logo',
    label: '',
    formatter: (value, item: Team): string | undefined => {
      return getSponsor(item?.sponsorId)?.logo;
    },
  },
  {
    key: 'title',
    label: t('globals.title'),
    formatter: (value, item: Team | undefined): string | undefined => {
      return getSponsor(item?.sponsorId as SponsorId)?.title;
    },
  },
  {
    key: 'players',
    label: t('admin.teams.nbPlayers'),
    formatter: (value: string | undefined) => value?.length || 0,
  },
  { key: 'actions', label: '' },
];
</script>

<template>
  <section>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.teams.title', 2) }}</h2>
      <RouterLink :to="{ name: 'admin-league-team-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="teams" sortedKey="title">
      <template #row.logo="{ value, item }">
        <div class="hstack gap-2">
          <ImageComp :src="value" :width="35" />
          <span
            class="px-2 align-self-stretch"
            :style="`background-color: ${getSponsor(item.sponsorId)?.color};`"
          ></span>
        </div>
      </template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-sm btn-light"
            :to="{ name: 'admin-league-team-edit', params: { teamId: item.docId } }"
            >{{ $t('actions.edit') }}</RouterLink
          ><ConfirmComp variant="danger" size="sm" @confirm="() => handleRemove(item.docId)">{{
            $t('actions.remove')
          }}</ConfirmComp>
        </div></template
      >
    </DataTable>
  </section>
</template>
