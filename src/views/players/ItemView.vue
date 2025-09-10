<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const playerId = route.params.playerId;
</script>

<template>
  <section>
    <h2>{{ $t('globals.player') }}</h2>

    <div>
      {{ playerId }}
    </div>
  </section>
</template>
