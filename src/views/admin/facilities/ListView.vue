<script lang="ts" setup>
import DataTable from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import { rootProvided } from '@/types/injections';
import { computed, inject } from 'vue';
import type { Court, Facilitie } from '@/types/facilities';

const { t } = useI18n();

const injectedData = inject(rootProvided);
const facilities = injectedData?.facilities;
const courts = injectedData?.courts;
const items = computed<(Facilitie & { courts: Court[] })[]>(() => {
  return Array.isArray(facilities?.value)
    ? facilities.value.map((item: Facilitie) => {
        return {
          ...item,
          courts: Array.isArray(courts?.value)
            ? courts.value.filter((i) => i.facilitieId === item.id)
            : [],
        };
      })
    : [];
});

const fields = [
  { key: 'title', label: t('globals.title') },
  { key: 'link', label: t('globals.link') },
  { key: 'map', label: t('globals.map') },
  {
    key: 'courts',
    label: t('globals.court', 2),
    formatter: (value: Court[]) => value?.length || 0,
  },
  { key: 'actions', label: '' },
];
</script>

<template>
  <main>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.facilities.title', 2) }}</h2>
      <RouterLink :to="{ name: 'admin-facilitie-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="items">
      <template #row.link="{ value }">
        <template v-if="value"
          ><span class="hstack gap-2"
            >{{ value }}<a :href="value" target="_blank">ext.</a></span
          ></template
        >
      </template>
      <template #row.map="{ value }">
        <template v-if="value"
          ><span class="hstack gap-2"
            >{{ value }}<a :href="value" target="_blank">ext.</a></span
          ></template
        >
      </template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-light btn-sm"
            :to="{ name: 'admin-facilitie-edit', params: { facilitieId: item.docId as string } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </main>
</template>
