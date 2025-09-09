<script lang="ts" setup>
import useLeague from '@/composables/useLeague';

import type { Game } from '@/types/games';
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectComp from '@/components/form/SelectComp.vue';
import type { FaseId } from '@/types/fases';
import type { Option } from '@/types/comp-fields';
import FieldComp from '@/components/form/FieldComp.vue';
import type { LeagueComputedFase } from '@/types/leaguesComputed';

interface Filters {
  faseId: FaseId | undefined;
}
const { t } = useI18n();

const { leagueComputed, games, getTeamSponsor } = useLeague();

const filters = reactive<Filters>({
  faseId: undefined,
});

const gamesList = computed<Game[]>(() =>
  Array.isArray(games?.value)
    ? games.value.filter((item) => !filters.faseId || item.faseId === filters.faseId)
    : [],
);

const fasesOptions = computed<Option[]>(() =>
  Array.isArray(leagueComputed?.value?.fases)
    ? [
        { text: t('globals.all'), value: '' },
        ...leagueComputed.value.fases.map(
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
    <ul class="list-group list-group-flush">
      <template v-for="item in gamesList" :key="item.id">
        <li class="list-group-item hstack gap-2">
          <strong>{{ getTeamSponsor(item.team1).title }} </strong>
          <span>&times;</span>
          <strong>{{ getTeamSponsor(item.team2).title }} </strong>
        </li>
      </template>
    </ul>
  </section>
</template>
