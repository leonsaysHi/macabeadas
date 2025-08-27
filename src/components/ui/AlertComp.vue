<template>
  <div :class="computedClass" role="alert"><slot></slot></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Variant } from '@/types/comp-fields';

interface IProps {
  variant?: Variant;
}
const props = withDefaults(defineProps<IProps>(), {
  variant: 'warning',
});

const computedClass = computed(() => {
  return ['alert', `alert-${props.variant}`];
});
</script>
