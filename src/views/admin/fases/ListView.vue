<script lang="ts" setup>
import type { TableField } from '@/types/comp-datatable';
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/ui/DataTableComp.vue';
import useLeagueAdmin from '@/composables/useLeagueAdmin';
import { computed } from 'vue';
import type { FaseId } from '@/types/fases';

const { t } = useI18n();
const { league, fases } = useLeagueAdmin();

const orderedFases = computed(() => {
  console.log(
    league.value?.fases,
    fases.value.map((i) => i.id),
  );
  return league.value?.fases
    .map((faseId: FaseId) => {
      return fases.value.find((item) => item.id === faseId) || undefined;
    })
    .filter(Boolean);
});

const fields: TableField[] = [
  {
    key: 'idx',
    label: t('globals.order'),
  },
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
</script>

<template>
  <section>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.fases.title', 2) }}</h2>
      <RouterLink :to="{ name: 'admin-league-fase-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="orderedFases" sortedKey="idx">
      <template #row.idx="{ index }">{{ index + 1 }}</template>
      <template #row.type="{ value }">{{ $t(`globals.faseTypes.${value}`) }}</template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-sm btn-light"
            :to="{ name: 'admin-league-fase-edit', params: { faseId: item.docId as string } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </section>
</template>
