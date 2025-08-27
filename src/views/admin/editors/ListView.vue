<script lang="ts" setup>
import { useFirestore } from 'vuefire';
import { useCollection } from 'vuefire';
import { collection } from 'firebase/firestore';
import DataTable from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import type { User } from 'firebase/auth';

const { t } = useI18n();
const db = useFirestore();
const colRef = collection(db, 'users');
const items = useCollection<User>(colRef);
const fields = [
  { key: 'email', label: t('globals.email') },
  { key: 'role', label: t('globals.role') },
  { key: 'actions', label: '' },
];
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
            class="btn btn-light"
            :to="{ name: 'admin-editor-edit', params: { userId: item.docId } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </main>
</template>
