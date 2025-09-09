<script lang="ts" setup>
import ImageComp from '@/components/form/ImageComp.vue';
import useLeague from '@/composables/useLeague';

const { teams, getSponsor } = useLeague();
</script>

<template>
  <section>
    <div class="row row-cols-2 row-cols-md-4 g-4">
      <template v-for="item in teams" :key="item.id">
        <div class="col">
          <div class="card">
            <ImageComp :src="getSponsor(item.sponsorId)?.logo" class="card-img-top" width="100%" />
            <div class="card-body">
              <h5 class="card-title">{{ getSponsor(item.sponsorId)?.title }}</h5>
              <div
                class="py-2 align-self-stretch"
                :style="`background-color: ${getSponsor(item.sponsorId)?.color};`"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
