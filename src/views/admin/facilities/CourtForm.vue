<template>
  <form @submit="handleSubmit" class="hstack gap-3 align-items-end">
    <FieldComp :label="$t('globals.title')" class="flex-grow-1" inline>
      <InputComp v-model="formData.title" required />
    </FieldComp>
    <div class="hstack align-items-end gap-2">
      <ButtonComp type="submit" variant="primary">{{
        $t(`actions.${props.value ? 'ok' : 'add'}`, props.value ? 2 : 1)
      }}</ButtonComp
      ><ButtonComp type="button" variant="light" @click="handleCancel">{{
        $t('actions.cancel')
      }}</ButtonComp>
    </div>
  </form>
</template>

<script setup lang="ts">
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import type { Court } from '@/types/facilities';
import { reactive, onMounted } from 'vue';

interface IProps {
  value?: Court;
}
const props = withDefaults(defineProps<IProps>(), {
  value: undefined,
});

const formData = reactive<Court>({
  facilitieId: '',
  title: '',
});

onMounted(() => {
  formData.facilitieId = props.value?.facilitieId || '';
  formData.title = props.value?.title || '';
});

const emit = defineEmits(['add']);

const handleSubmit = (ev: Event) => {
  ev.preventDefault();
  emit('add', { ...formData } as Court);
  formData.title = '';
};
const handleCancel = () => {
  if (props.value) {
    emit('add', { ...props.value } as Court);
  }
};

function onMount(arg0: () => void) {
  throw new Error('Function not implemented.');
}
</script>
