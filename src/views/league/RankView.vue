<script lang="ts" setup>
import useLeague from '@/composables/useLeague';

import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectComp from '@/components/form/SelectComp.vue';
import type { FaseId } from '@/types/fases';
import type { Option } from '@/types/comp-fields';
import FieldComp from '@/components/form/FieldComp.vue';
import type { LeagueComputedFase } from '@/types/leaguesComputed';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import RankComp from '@/components/stats/RankComp.vue';

interface Filters {
  faseId: FaseId | undefined;
}
const { t } = useI18n();

const { fases, getSponsor, getRank } = useLeague();

const filters = reactive<Filters>({
  faseId: undefined,
});

const fasesOptions = computed<Option[]>(() =>
  Array.isArray(fases.value)
    ? [
        { text: t('globals.all'), value: '' },
        ...fases.value.map(
          (item: LeagueComputedFase) => ({ text: item.title, value: item.faseId }) as Option,
        ),
      ]
    : [],
);
watch(
  fasesOptions,
  (val: Option[]) => {
    filters.faseId = val?.length === 1 ? (val[0].value as string) : undefined;
  },
  { immediate: true },
);

const teams = computed(() => getRank(filters.faseId));
</script>

<template>
  <section>
    <h2>{{ $t('admin.games.title', 2) }}</h2>

    <div class="row row-cols-3 justify-content-end">
      <FieldComp :label="$t('globals.fase')" class="col">
        <SelectComp
          v-model="filters.faseId"
          :options="fasesOptions"
          :disabled="fasesOptions.length === 1"
        />
      </FieldComp>
    </div>
    <RankComp :teams="teams" />
  </section>
</template>
