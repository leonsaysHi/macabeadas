<template>
  <input
    v-model="model"
    :type="type"
    :class="computedClass"
    :placeholder="placeholder"
    :disabled="props.readonly || props.disabled"
    :required="props.required"
    @input="handleUpdate"
    @change="handleUpdate"
  />
</template>

<script setup lang="ts">
import { parseISO, format } from 'date-fns';
import { computed } from 'vue';
interface IProps {
  modelValue: Date | undefined;
  type?: 'date' | 'datetime-local';
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: 'lg' | 'md' | 'sm';
  isValid?: boolean;
  isInvalid?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: undefined,
  type: 'date',
  placeholder: '',
  readonly: false,
  required: false,
  disabled: false,
  size: 'md',
  isValid: false,
  isInvalid: false,
});

const emit = defineEmits(['update:modelValue', 'input', 'validate', 'change']);

const model = computed({
  get: () =>
    props.modelValue instanceof Date
      ? props.type === 'datetime-local'
        ? `${format(props.modelValue, 'yyyy-MM-dd')}T${format(props.modelValue, 'HH:mm')}`
        : format(props.modelValue, 'yyyy-MM-dd')
      : props.modelValue,
  set: (val) => {
    emit('update:modelValue', val ? parseISO(val) : undefined);
  },
});

const handleUpdate = (ev: Event) => {
  emit('update:modelValue', parseISO(ev.target?.value));
};

const computedClass = computed(() => {
  return [
    'form-control',
    props.isInvalid && 'is-invalid',
    props.isValid && 'is-valid',
    props.size != 'md' && `form-control-${props.size}`,
  ];
});
</script>
