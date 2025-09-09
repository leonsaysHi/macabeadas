<script setup lang="ts">
import type { Categorie } from '@/types/categories';
import { rootProvided } from '@/types/injections';
import type { Multi } from '@/types/multies';
import { computed, inject } from 'vue';
import { RouterLink } from 'vue-router';

const injectedData = inject(rootProvided);
const categories = injectedData?.categories;
const multies = injectedData?.multies;
const categoriesList = computed(() => {
  const result = categories?.value.map((cat: Categorie) => ({
    ...cat,
    multies: multies?.value.filter((mul: Multi) => mul.categorieId === cat.id),
  }));
  result?.sort((a, b) => a.grades[0] - b.grades[0]);
  return result;
});
</script>

<template>
  <main>
    <template v-for="item in categoriesList" :key="item.id">
      <div class="mb-3 col-md-6">
        <h3>{{ item.title }}</h3>
        <div class="row">
          <template v-if="!item.multies?.length">
            <p class="text-secondary">-</p>
          </template>
          <template v-else>
            <div class="col-6">
              <div class="card">
                <ul class="list-group list-group-flush">
                  <template v-for="multi in item.multies" :key="multi.id">
                    <li class="list-group-item hstack gap-2">
                      <div class="p-1" :style="`background-color:${multi.color}`"></div>
                      <RouterLink :to="{ name: 'multi', params: { multiId: multi.id } }">{{
                        $t(`globals.genders.${multi.gender}`)
                      }}</RouterLink>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </main>
</template>
