<template>
  <button :type="type" :class="computedClass" :disabled="disabled || isBusy">
    <template v-if="isBusy"><SpinnerComp variant="light" size="sm" /></template><slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SpinnerComp from '../SpinnerComp.vue';
import type { Size, Variant } from '@/types/comp-fields';

interface IProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  size?: Size;
  pill?: boolean;
  disabled?: boolean;
  isBusy?: boolean;
  noFlex?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  type: 'button',
  variant: 'secondary',
  size: 'md',
  pill: false,
  disabled: false,
  isBusy: false,
  noFlex: false,
});

const computedClass = computed(() => {
  return [
    'btn',
    typeof props.variant === 'string' && props.variant.length && `btn-${props.variant}`,
    props.size !== 'md' && `btn-${props.size}`,
    !props.noFlex && 'd-inline-flex align-items-center gap-3',
  ];
});
</script>

<style scoped lang="scss"></style>
