<script lang="ts" setup>
import DataTable from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import ImageComp from '@/components/form/ImageComp.vue';
import { inject } from 'vue';
import { rootProvided } from '@/types/injections';

const { t } = useI18n();
const injectedData = inject(rootProvided);
const sponsors = injectedData?.sponsors;
const fields = [
  { key: 'logo', label: t('globals.logo') },
  { key: 'title', label: t('globals.title') },
  { key: 'shortTitle', label: t('globals.shortTitle') },
  { key: 'actions', label: '' },
];
</script>

<template>
  <main>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.sponsors.title') }}</h2>
      <RouterLink :to="{ name: 'admin-sponsor-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>
    <DataTable :fields="fields" :items="sponsors" sortedKey="title">
      <template #row.logo="{ value, item }"
        ><div class="d-flex gap-2">
          <span class="px-3" :style="`background-color: ${item.color};`"> </span>
          <ImageComp :src="value" width="50" />
        </div>
      </template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-sm btn-primary"
            :to="{ name: 'admin-sponsor-edit', params: { sponsorId: item.docId } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </main>
</template>
