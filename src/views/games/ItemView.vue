<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const gameId = route.params.gameId;
</script>

<template>
  <section>
    <h2>{{ $t('globals.game') }}</h2>

    <div>
      {{ gameId }}
    </div>
  </section>
</template>
