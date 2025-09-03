<template>
  <input
    ref="inputEl"
    v-model="model"
    :type="type"
    class="form-control"
    :class="{ [computedClass]: true, 'is-invalid': isInvalid, 'is-valid': isValid }"
    :placeholder="placeholder"
    :disabled="readonly || disabled"
    :required="required"
    :accept="accept"
    :min="type === 'number' ? props.min : undefined"
    :max="type === 'number' ? props.max : undefined"
    @input="emit('input')"
    @keyup.enter="handleEnterKey"
    @change="(ev) => emit('change', ev)"
  />
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
interface IProps {
  modelValue: string | number | Date | undefined;
  type?: 'text' | 'number' | 'email' | 'file' | 'date' | 'datetime-local' | 'color' | 'hidden';
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: 'lg' | 'md' | 'sm';
  min?: number | undefined;
  max?: number | undefined;
  accept?: string;
  isValid?: boolean;
  isInvalid?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: undefined,
  type: 'text',
  placeholder: '',
  readonly: false,
  required: false,
  disabled: false,
  size: 'md',
  min: 0,
  max: undefined,
  accept: 'image/*',
  isValid: false,
  isInvalid: false,
});
const inputEl = useTemplateRef('inputEl');
const emit = defineEmits(['update:modelValue', 'input', 'validate', 'on-enter-key', 'change']);
const model = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', props.type.includes('date') ? new Date(val) : val);
  },
});
const computedClass = computed(() => {
  const result = [];
  if (props.size !== 'md') {
    result.push(`form-control-${props.size}`);
  }
  return result.join(' ');
});
const handleEnterKey = () => {
  emit('on-enter-key');
};
</script>
