<script lang="ts" setup>
import DataTable from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import DateFormat from '@/components/ui/DateFormat.vue';
import { collection, CollectionReference } from 'firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';
import type { Player } from '@/types/players';
import { playerConverter } from '@/utils/firestore';

const { t } = useI18n();
const db = useFirestore();
const colRef = collection(db, 'players').withConverter(
  playerConverter,
) as CollectionReference<Player>;
const items = useCollection<Player>(colRef);

const fields = [
  { key: 'fname', label: t('globals.fname') },
  { key: 'lname', label: t('globals.lname') },
  {
    key: 'gender',
    label: t('globals.gender'),
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
      <template #row.dob="{ value }">
        <DateFormat :value="value" />
      </template>
      <template #row.gender="{ value }">
        {{ $t(`globals.genders.${value}`) }}
      </template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-light btn-sm"
            :to="{ name: 'admin-player-edit', params: { playerId: item.docId as string } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </main>
</template>
