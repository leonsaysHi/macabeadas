<script lang="ts" setup>
import SpinnerComp from '@/components/SpinnerComp.vue';
import GamesList from '@/components/games/ListView.vue';
import useRootProvided from '@/composables/useRootProvided';
import type { Categorie, CategorieId } from '@/types/categories';
import type { FacilitieDetails, Court, CourtId, FacilitieId } from '@/types/facilities';
import type { GameComputed } from '@/types/leaguesComputed';
import type { Option } from '@/types/comp-fields';
import { computedGameConverter } from '@/utils/firestore';
import { collectionGroup, query, where } from 'firebase/firestore';
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useCollection, useFirestore } from 'vuefire';
import FieldComp from '@/components/form/FieldComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import { useI18n } from 'vue-i18n';

interface Filters {
  courtId: CourtId | 'all';
  categorieId: CategorieId | 'all';
}

const db = useFirestore();
const { t } = useI18n();
const route = useRoute();
const { categories, getFacilityDetails } = useRootProvided();

const facilitieId = route.params.facilitieId as FacilitieId;
const getFacilityComputedGamesColGroupRef = query(
  collectionGroup(db, 'computed-games'),
  where('facilitieId', '==', facilitieId),
);

const item = computed<FacilitieDetails>(() => getFacilityDetails(facilitieId));
const isReady = computed(() => item.value);

const { data: computedGames } = useCollection<GameComputed>(
  getFacilityComputedGamesColGroupRef.withConverter(computedGameConverter),
);
const upcomingGames = computed(() =>
  computedGames.value.filter((game: GameComputed) => {
    return (
      ['live', 'none'].includes(game.status) &&
      (filters.courtId === 'all' || filters.courtId === game.courtId) &&
      (filters.categorieId === 'all' || filters.categorieId === game.categorieId)
    );
  }),
);

const filters = reactive<Filters>({
  courtId: 'all',
  categorieId: 'all',
});
const courtOptions = computed<Option[]>(() =>
  Array.isArray(item.value.courts)
    ? [
        ...(item.value.courts.length > 1 ? [{ text: t('globals.all'), value: 'all' }] : []),
        ...item.value.courts.map(
          (item: Court): Option => ({
            text: item.title,
            value: item.id,
          }),
        ),
      ]
    : [],
);
const categorieOptions = computed<Option[]>(() =>
  Array.isArray(categories?.value)
    ? [
        ...(categories?.value.length > 1 ? [{ text: t('globals.all'), value: 'all' }] : []),
        ...categories?.value.map(
          (item: Categorie): Option => ({
            text: item.title,
            value: item.id,
          }),
        ),
      ]
    : [],
);
</script>

<template>
  <section>
    <template v-if="!isReady">
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else>
      <h4>{{ item?.title }}</h4>
      {{ item }}
      <hr />
      <div class="hstack justify-content-between gap-3">
        <h4>{{ $t('globals.game', 2) }}</h4>
        <div class="hstack gap-3">
          <FieldComp :label="$t('globals.court', 2)" class="col">
            <SelectComp
              v-model="filters.courtId"
              :options="courtOptions"
              :disabled="courtOptions.length < 2"
            />
          </FieldComp>
          <FieldComp :label="$t('globals.categorie', 2)" class="col">
            <SelectComp
              v-model="filters.categorieId"
              :options="categorieOptions"
              :disabled="categorieOptions.length < 2"
            />
          </FieldComp>
        </div>
      </div>
      <GamesList :games="upcomingGames" />
    </template>
  </section>
</template>
