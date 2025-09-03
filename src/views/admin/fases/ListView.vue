<script lang="ts" setup>
import type { TableField, TableItem } from '@/types/comp-datatable';
import { adminLeagueProvided } from '@/types/injections';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/ui/DataTableComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';

const { t } = useI18n();

const injectedAdminLeagueData = inject(adminLeagueProvided);
const items = injectedAdminLeagueData?.fases ?? [];

const fields: TableField[] = [
  {
    key: 'title',
    label: t('globals.title'),
  },
  {
    key: 'type',
    label: t('globals.type'),
  },
  { key: 'actions', label: '' },
];
const handleRemove = () => {};
</script>

<template>
  <section>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.fases.title', 2) }}</h2>
      <RouterLink :to="{ name: 'admin-league-fase-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="items" sortedKey="title">
      <template #row.type="{ value }">{{ $t(`globals.faseTypes.${value}`) }}</template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-sm btn-light"
            :to="{ name: 'admin-league-fase-edit', params: { faseId: item.docId as string } }"
            >{{ $t('actions.edit') }}</RouterLink
          ><ConfirmComp
            variant="danger"
            size="sm"
            @confirm="() => handleRemove(item.docId as string)"
            >{{ $t('actions.remove') }}</ConfirmComp
          >
        </div></template
      >
    </DataTable>
  </section>
</template>
