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

interface Filters {
  faseId: FaseId | '';
  groupIdx: string;
}
const { t } = useI18n();

const { gamesComputed, fases, getGroups } = useLeague();

const filters = reactive<Filters>({
  faseId: '',
  groupIdx: '0',
});

const fasesOptions = computed<Option[]>(() =>
  Array.isArray(fases.value)
    ? [
        ...(fases.value.length > 1 ? [{ text: t('globals.all'), value: '' }] : []),
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
  return filters.faseId
    ? (getGroups(filters.faseId) as LeagueComputedGroup[]).map(
        (item: LeagueComputedGroup, idx: number) => ({
          text: item.title,
          value: idx.toString(),
        }),
      )
    : [];
});
watch(
  groupOptions,
  () => {
    filters.groupIdx = '0';
  },
  { immediate: true },
);

const games = computed<GameComputed[]>(() =>
  Array.isArray(gamesComputed?.value)
    ? gamesComputed.value.filter(
        (item: GameComputed) =>
          !filters.faseId ||
          (filters.faseId === item.faseId && Number(filters.groupIdx) === item.groupIdx),
      )
    : [],
);
</script>

<template>
  <section>
    <h2>{{ $t('admin.games.title', 2) }}</h2>

    <div class="row row-cols-3 justify-content-end">
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
    </div>
    <GamesList :items="games" />
  </section>
</template>
