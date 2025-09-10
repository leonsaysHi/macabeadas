<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const teamId = route.params.teamId;
</script>

<template>
  <section>
    <h2>{{ $t('globals.team') }}</h2>

    <div>
      {{ teamId }}
    </div>
  </section>
</template>
