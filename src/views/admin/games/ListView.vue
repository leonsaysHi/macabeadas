<script lang="ts" setup>
import DataTable from '@/components/ui/DataTableComp.vue';
import DateTimeFormat from '@/components/ui/DateTimeFormat.vue';
import DateFormat from '@/components/ui/DateFormat.vue';
import useLeagueAdmin from '@/composables/useLeagueAdmin';

import type { TableField } from '@/types/comp-datatable';
import type { Game } from '@/types/games';
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectComp from '@/components/form/SelectComp.vue';
import type { Fase, FaseId } from '@/types/fases';
import type { Option } from '@/types/comp-fields';
import FieldComp from '@/components/form/FieldComp.vue';
import type { CourtId } from '@/types/facilities';

interface Filters {
  faseId: FaseId | 'all';
}
const { t } = useI18n();
const { games, fases, getTeamTitle, getCourtDetails } = useLeagueAdmin();

const getTotalScores = (arr: number[]) => {
  return arr.reduce((tot, n) => tot + n, 0);
};

const fields: TableField[] = [
  {
    key: 'teams',
    label: t('globals.team', 2),
    formatter: (value, item: Game): (string | undefined)[] => {
      return [getTeamTitle(item.team1), getTeamTitle(item.team2)];
    },
  },
  {
    key: 'scores',
    label: t('globals.score', 2),
    formatter: (value, item: Game): (number | undefined)[] => {
      return [getTotalScores(item.scores1), getTotalScores(item.scores2)];
    },
  },
  {
    key: 'datetime',
    label: t('globals.date'),
    sortable: true,
  },
  {
    key: 'courtId',
    label: t('globals.court'),
    formatter: (value: CourtId) => {
      return getCourtDetails(value);
    },
  },
  {
    key: 'status',
    label: t('globals.status'),
  },
  {
    key: 'faseId',
    label: t('globals.fase'),
    formatter: (value) => {
      return fases.value.findIndex((item) => item.id === value);
    },
  },
  { key: 'actions', label: '' },
];

const filters = reactive<Filters>({
  faseId: 'all',
});

const filteredItems = computed<Game[]>(() =>
  games.value.filter((item) => filters.faseId === 'all' || item.faseId === filters.faseId),
);

const fasesOptions = computed<Option[]>(() =>
  Array.isArray(fases.value)
    ? [
        { text: t('globals.all'), value: 'all' },
        ...fases.value.map((item: Fase) => ({ text: item.title, value: item.id }) as Option),
      ]
    : [],
);
watch(
  fasesOptions,
  (val: Option[]) => {
    filters.faseId = val?.length === 1 ? (val[0].value as string) : 'all';
  },
  { immediate: true },
);
</script>

<template>
  <section>
    <div class="hstack justify-content-between align-items-start gap-3">
      <h2>{{ $t('admin.games.title', 2) }}</h2>
      <RouterLink :to="{ name: 'admin-league-game-edit' }" class="btn btn-primary">{{
        $t('actions.add')
      }}</RouterLink>
    </div>

    <div class="row row-cols-3 justify-content-end">
      <FieldComp :label="$t('globals.fase')" class="col">
        <SelectComp
          v-model="filters.faseId"
          :options="fasesOptions"
          :disabled="fasesOptions.length === 1"
        />
      </FieldComp>
    </div>
    <DataTable :fields="fields" :items="filteredItems" sortedKey="datetime">
      <template #row.teams="{ value, item }">
        <template v-for="(title, idx) in value" :key="idx">
          <div>{{ title }}</div>
        </template>
      </template>
      <template #row.scores="{ value, item }">
        <template v-for="(score, idx) in value" :key="idx">
          <div>{{ score }}</div>
        </template>
      </template>
      <template #row.datetime="{ value }">
        <strong><DateFormat :value="value" time-style="short" /></strong><br />
        <DateTimeFormat :value="value" time-only time-style="short" />
      </template>
      <template #row.faseId="{ value }">{{ value + 1 }}.{{ fases[value]?.title }} </template>
      <template #row.courtId="{ value }"
        ><strong>{{ value.title }}</strong
        ><br />{{ value.courtTitle }}</template
      ><template #row.status="{ value }">
        {{ $t(`globals.statuses.${value}`) }}
      </template>
      <template #row.actions="{ item }"
        ><div class="hstack justify-content-end gap-1">
          <RouterLink
            class="btn btn-sm btn-light"
            :to="{ name: 'admin-league-game-edit', params: { gameId: item.id as string } }"
            >{{ $t('actions.edit') }}</RouterLink
          >
        </div></template
      >
    </DataTable>
  </section>
</template>
