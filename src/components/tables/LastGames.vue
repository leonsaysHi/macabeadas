<template>
  <div class="hstack gap-1 small">
    <template v-for="(colorclass, idx) in items" :key="idx">
      <i class="bi bi-circle-fill" :class="[colorclass, idx < 2 && 'd-none d-lg-block']"></i>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Last5 } from '@/types/teams';
import { computed } from 'vue';

interface IProps {
  items: Last5;
  length?: number;
}
const props = withDefaults(defineProps<IProps>(), {
  length: 3,
});
const items = computed(() => {
  const items = new Array(props.length).fill(null);
  const start = Math.max(0, items.length - props.items.length);
  items.splice(start, props.items.length, ...props.items);
  return items
    .map((h) => (h === true ? 'success' : h === false ? 'danger' : 'secondary opacity-25'))
    .map((str) => `text-${str}`);
});
</script>
