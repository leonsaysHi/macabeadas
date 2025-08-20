<script lang="ts" setup>
import DataTable from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import type { TableItem } from '@/types/comp-datatable';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';
import type { Player } from '@/types/players';

const { t } = useI18n();
const db = useFirestore();
const colRef = collection(db, 'players');
const items = useCollection<Player>(colRef);

const fields = [
  { key: 'fname', label: t('globals.fname') },
  { key: 'lname', label: t('globals.lname') },
  {
    key: 'gender',
    label: t('globals.gender'),
    formatter: (value) => t(`globals.genders.${value}`),
  },
  { key: 'identification', label: t('globals.identification') },
  { key: 'dob', label: t('globals.dob') },
  { key: 'actions', label: '' },
];
</script>

<template>
  <main>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.players.title') }}</h2>
      <RouterLink :to="{ name: 'admin-player-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="items">
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-primary"
            :to="{ name: 'admin-player-edit', params: { playerId: item.docId as string } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </main>
</template>
