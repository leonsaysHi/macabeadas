<script lang="ts" setup>
import useLeague from '@/composables/useLeague';

import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectComp from '@/components/form/SelectComp.vue';
import type { FaseId } from '@/types/fases';
import type { Option } from '@/types/comp-fields';
import FieldComp from '@/components/form/FieldComp.vue';
import type {
  GameComputed,
  LeagueComputedFase,
  LeagueComputedGroup,
} from '@/types/leaguesComputed';

import GamesList from '@/components/games/ListView.vue';
import type { GameStatus } from '@/types/games';

interface Filters {
  faseId: FaseId | 'all';
  groupIdx: string;
  status: GameStatus | 'all';
}
const { t } = useI18n();

const { gamesComputed, fases, getGroups } = useLeague();

const filters = reactive<Filters>({
  faseId: 'all',
  groupIdx: '0',
  status: 'all',
});

const fasesOptions = computed<Option[]>(() =>
  Array.isArray(fases.value)
    ? [
        ...(fases.value.length > 1 ? [{ text: t('globals.all'), value: 'all' }] : []),
        ...fases.value.map(
          (item: LeagueComputedFase) => ({ text: item.title, value: item.faseId }) as Option,
        ),
      ]
    : [],
);
watch(
  fasesOptions,
  (val: Option[]) => {
    filters.faseId = val.length ? (val[val.length - 1].value as FaseId) : '';
  },
  { immediate: true },
);
const groupOptions = computed<Option[]>(() => {
  const groups = getGroups(filters.faseId);
  return filters.faseId && Array.isArray(groups)
    ? groups.map((item: LeagueComputedGroup, idx: number) => ({
        text: item.title,
        value: idx.toString(),
      }))
    : [];
});
watch(
  groupOptions,
  () => {
    filters.groupIdx = '0';
  },
  { immediate: true },
);

const statusesOptions = [
  { text: t('globals.all'), value: 'all' },
  ...(['none', 'live', 'finished'] as GameStatus[]).map(
    (value: GameStatus): Option => ({
      text: t(`globals.statuses.${value}`),
      value,
    }),
  ),
];

const games = computed<GameComputed[]>(() =>
  Array.isArray(gamesComputed?.value)
    ? gamesComputed.value.filter(
        ({ faseId, groupIdx, status }: GameComputed) =>
          (filters.faseId === 'all' ||
            (filters.faseId === faseId && Number(filters.groupIdx) === groupIdx)) &&
          (filters.status === 'all' || filters.status === status),
      )
    : [],
);
</script>

<template>
  <section>
    <h2>{{ $t('admin.games.title', 2) }}</h2>

    <div class="row row-cols-4 justify-content-end">
      <FieldComp :label="$t('globals.fase')" class="col">
        <SelectComp
          v-model="filters.faseId"
          :options="fasesOptions"
          :disabled="fasesOptions.length < 2"
        />
      </FieldComp>
      <FieldComp :label="$t('globals.group')" class="col">
        <SelectComp
          v-model="filters.groupIdx"
          :options="groupOptions"
          :disabled="groupOptions.length < 2"
        />
      </FieldComp>
      <FieldComp :label="$t('globals.status')" class="col">
        <SelectComp v-model="filters.status" :options="statusesOptions" />
      </FieldComp>
    </div>
    <GamesList :games="games" />
  </section>
</template>
