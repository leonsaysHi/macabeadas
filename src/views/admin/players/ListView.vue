<script lang="ts" setup>
import { useFirestore } from 'vuefire';
import { useCollection } from 'vuefire';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import DataTable from '@/components/ui/DataTableComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import { useI18n } from 'vue-i18n';
import { inject } from 'vue';
import type { TableItem } from '@/types/comp-datatable';

const { t } = useI18n();
const db = useFirestore();
const colRef = collection(db, 'players');

const players = inject('players');

const fields = [
  { key: 'fname', label: t('globals.fname') },
  { key: 'lname', label: t('globals.lname') },
  { key: 'gender', label: t('globals.gender') },
  { key: 'identification', label: t('globals.identification') },
  { key: 'dob', label: t('globals.dob') },
  { key: 'actions', label: '' },
];
const handleRemove = async (id: string) => {
  try {
    await deleteDoc(doc(colRef, id));
    console.log('Document successfully deleted!');
  } catch (error) {
    console.warn('Error removing document:', error);
  }
};
</script>

<template>
  <main>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.players.title') }}</h2>
      <RouterLink :to="{ name: 'admin-player-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="players as TableItem[]">
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-primary"
            :to="{ name: 'admin-player-edit', params: { id: item.docId } }"
            >{{ $t('actions.edit') }}</RouterLink
          ><ConfirmComp variant="danger" @confirm="() => handleRemove(item.docId)">{{
            $t('actions.remove')
          }}</ConfirmComp>
        </div></template
      >
    </DataTable>
  </main>
</template>
