<template>
  <ButtonComp
    :type="props.type"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :is-busy="props.isBusy"
    @click="show = true"
    ><slot>Confirm</slot></ButtonComp
  >
  <ModalComp
    :is-shown="show"
    :ok-title="$t('globals.yes')"
    ok-variant="warning"
    :cancel-title="$t('globals.no')"
    cancel-variant="outline-secondary"
    @cancel="show = false"
    @ok="handleConfrim"
    >{{ props.message || $t('globals.ays') }}</ModalComp
  >
</template>

<script setup lang="ts">
import ModalComp from './ModalComp.vue';
import ButtonComp from './ButtonComp.vue';
import { ref } from 'vue';
import type { Size, Variant } from '@/types/comp-fields';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
interface IProps {
  message?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  size?: Size;
  pill?: boolean;
  disabled?: boolean;
  isBusy?: boolean;
  noFlex?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  message: '',
  type: 'button',
  variant: 'secondary',
  size: 'md',
  pill: false,
  disabled: false,
  isBusy: false,
  noFlex: false,
});

const emit = defineEmits(['confirm']);

const show = ref<boolean>(false);
const handleConfrim = () => {
  show.value = false;
  emit('confirm');
};
</script>
