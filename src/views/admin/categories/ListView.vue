<script lang="ts" setup>
import { useFirestore } from 'vuefire';
import { useCollection } from 'vuefire';
import { collection } from 'firebase/firestore';
import DataTable from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import type { Categorie } from '@/types/categories';
import { rootProvided } from '@/types/injections';
import { inject } from 'vue';

const { t } = useI18n();
const db = useFirestore();
const catRef = collection(db, 'categories');
const items = useCollection<Categorie>(catRef);
const injectedData = inject(rootProvided);
const multies = injectedData?.multies;
const fields = [
  { key: 'title', label: t('globals.title') },
  {
    key: 'grades',
    label: t('globals.grade', 2),
    sortByFormatted: true,
    formatter: (value: unknown) => (Array.isArray(value) ? value.join(', ') : value),
  },
  {
    key: 'colorM',
    label: t('globals.genders.m'),
    sortByFormatted: true,
    formatter: (value: unknown, item: Categorie) =>
      multies?.value.find((m) => m.categorieId === (item as Categorie).id && m.gender === 'm')
        ?.color,
  },
  {
    key: 'colorF',
    label: t('globals.genders.f'),
    sortByFormatted: true,
    formatter: (value: unknown, item: Categorie) =>
      multies?.value.find((m) => m.categorieId === (item as Categorie).id && m.gender === 'f')
        ?.color,
  },
  { key: 'actions', label: '' },
];
</script>

<template>
  <main>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.categories.title') }}</h2>
      <RouterLink :to="{ name: 'admin-categorie-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="items" sortedKey="grades">
      <template #row.colorM="{ value }"
        ><div class="px-3" :style="`background-color:${value}`">&nbsp;</div>
      </template>
      <template #row.colorF="{ value }"
        ><div class="px-3" :style="`background-color:${value}`">&nbsp;</div>
      </template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-sm btn-light"
            :to="{ name: 'admin-categorie-edit', params: { categorieId: item.docId } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </main>
</template>
