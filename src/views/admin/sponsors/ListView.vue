<script lang="ts" setup>
import { useFirestore } from 'vuefire';
import { useCollection } from 'vuefire';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import DataTable from '@/components/ui/DataTableComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const db = useFirestore();
const colRef = collection(db, 'sponsors');
const items = useCollection(colRef);
const fields = [
  { key: 'title', label: t('globals.title') },
  { key: 'color', label: t('globals.color') },
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
      <h2>{{ $t('admin.sponsors.title') }}</h2>
      <RouterLink :to="{ name: 'admin-sponsor-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="items" sortedKey="title">
      <template #row.color="{ value }">
        <div class="d-inline-block px-5 rounded-sm" :style="`background-color: ${value};`">
          &nbsp;
        </div>
      </template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-sm btn-primary"
            :to="{ name: 'admin-sponsor-edit', params: { id: item.docId } }"
            >{{ $t('actions.edit') }}</RouterLink
          ><ConfirmComp variant="danger" size="sm" @confirm="() => handleRemove(item.docId)">{{
            $t('actions.remove')
          }}</ConfirmComp>
        </div></template
      >
    </DataTable>
  </main>
</template>
