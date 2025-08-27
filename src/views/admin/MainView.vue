<script lang="ts" setup>
import type { Categorie } from '@/types/categories';
import { rootProvided } from '@/types/injections';
import type { League } from '@/types/leagues';
import type { Multi } from '@/types/multies';
import { computed, inject } from 'vue';
import { RouterLink } from 'vue-router';
import { useCurrentUser } from 'vuefire';
const user = useCurrentUser();

const injectedData = inject(rootProvided);
const categories = injectedData?.categories;
const multies = injectedData?.multies;
const leagues = injectedData?.leagues;
const isEditor = injectedData?.isEditor;

const byCategories = computed(() => {
  const result = categories?.value.map((cat: Categorie) => ({
    ...cat,
    multies: multies?.value
      .filter((mul: Multi) => mul.categorieId === cat.id)
      .map((mul: Multi) => ({
        ...mul,
        leagues: leagues?.value.filter((lea: League) => lea.multiId === mul.id),
      })),
  }));
  result?.sort((a, b) => a.grades[0] - b.grades[0]);
  return result;
});
</script>

<template>
  <main>
    <p>User: {{ user?.email }} / Is editor: {{ isEditor }}</p>
    <nav class="nav">
      <li class="nav-item">
        <RouterLink class="nav-link" aria-current="page" :to="{ name: 'admin-settings' }">{{
          $t('admin.settings.title')
        }}</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" aria-current="page" :to="{ name: 'admin-editors' }">{{
          $t('admin.editors.title')
        }}</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" aria-current="page" :to="{ name: 'admin-sponsors' }">{{
          $t('admin.sponsors.title')
        }}</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" aria-current="page" :to="{ name: 'admin-players' }">{{
          $t('admin.players.title', 2)
        }}</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" aria-current="page" :to="{ name: 'admin-facilities' }">{{
          $t('admin.facilities.title', 2)
        }}</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" aria-current="page" :to="{ name: 'admin-categories' }">{{
          $t('admin.categories.title', 2)
        }}</RouterLink>
      </li>
    </nav>
    <div class="row">
      <template v-for="categorie in byCategories" :key="categorie.id">
        <div class="mb-3 col-md-6">
          <h3>{{ categorie.title }}</h3>
          <div class="row">
            <template v-if="!categorie.multies?.length">
              <p class="text-secondary">-</p>
            </template>
            <template v-else>
              <template v-for="multi in categorie.multies" :key="multi.id">
                <div class="col-6">
                  <div class="card">
                    <div class="py-2 card-img-top" :style="`background-color:${multi.color}`"></div>
                    <div class="card-body">
                      <h5 class="card-title">{{ $t(`globals.genders.${multi.gender}`) }}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                      <template v-if="!multi.leagues?.length">
                        <li class="list-group-item text-secondary">-</li>
                      </template>
                      <template v-else>
                        <template v-for="league in multi.leagues" :key="league.id">
                          <li class="list-group-item hstack gap-1">
                            <RouterLink
                              :to="{ name: 'admin-league', params: { leagueId: league.id } }"
                              >{{ $t(`globals.sports.${league.sport}`) }}</RouterLink
                            >
                            <RouterLink
                              class="btn btn-light btn-sm ms-auto"
                              :to="{ name: 'admin-league-edit', params: { leagueId: league.id } }"
                              >{{ $t('actions.edit') }}</RouterLink
                            >
                          </li>
                        </template>
                      </template>
                      <li class="list-group-item hstack justify-content-end">
                        <RouterLink
                          class="btn btn-primary btn-sm"
                          :to="{ name: 'admin-league-edit', query: { multiId: multi.docId } }"
                          >{{ $t('actions.add') }}</RouterLink
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
