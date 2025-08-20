<script lang="ts" setup>
import { useFirestore } from 'vuefire';
import { useCollection } from 'vuefire';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import DataTable from '@/components/ui/DataTableComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const db = useFirestore();
const colRef = collection(db, 'users');
const items = useCollection(colRef);
const fields = [
  { key: 'email', label: t('globals.email') },
  { key: 'role', label: t('globals.role') },
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
      <h2>{{ $t('admin.editors.title') }}</h2>
      <RouterLink :to="{ name: 'admin-editor-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="items">
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-primary"
            :to="{ name: 'admin-editor-edit', params: { id: item.docId } }"
            >{{ $t('actions.edit') }}</RouterLink
          ><ConfirmComp variant="danger" @confirm="() => handleRemove(item.docId)">{{
            $t('actions.remove')
          }}</ConfirmComp>
        </div></template
      >
    </DataTable>
  </main>
</template>
