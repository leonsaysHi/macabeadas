<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/ui/DataTableComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import { inject } from 'vue';
import { adminLeagueProvided, rootProvided } from '@/types/injections';
import type { TableField } from '@/types/comp-datatable';
import ImageComp from '@/components/form/ImageComp.vue';
import type { Sponsor } from '@/types/sponsors';

const { t } = useI18n();
// const route = useRoute();
const injectedData = inject(rootProvided);
// const leagues = injectedData?.leagues;
const sponsors = injectedData?.sponsors;

const injectedAdminLeagueData = inject(adminLeagueProvided);
const teams = injectedAdminLeagueData?.teams;

const fields: TableField[] = [
  {
    key: 'sponsorId',
    label: t('globals.title'),
    formatter: (value: string | undefined): Sponsor | undefined => {
      return sponsors?.value.find((item) => item.id === value);
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
      <template #row.sponsorId="{ value }">
        <div class="hstack gap-2">
          <span class="px-3 align-self-stretch" :style="`background-color: ${value.color};`"></span>
          <ImageComp :src="value.logo" :width="30" />
          <span>{{ value.title }}</span>
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
