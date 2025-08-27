<template>
  <span class="badge" :class="computedClass">
    <slot>?</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Variant } from '@/types/comp-fields';

interface IProps {
  variant?: Variant;
  pill?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  variant: 'secondary',
  pill: false,
});

const computedClass = computed(() => {
  return [props.variant && `text-bg-${props.variant}`, props.pill && 'rounded-pill'];
});
</script>
