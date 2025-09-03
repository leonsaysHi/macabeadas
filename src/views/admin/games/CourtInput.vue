<template>
  <div class="row row-cols-2">
    <FieldComp label="Facilit"
      ><SelectComp v-model="facilitieId" :options="facilitieOptions" />
    </FieldComp>
    <FieldComp label="Court">
      <SelectComp v-model="courtId" :options="courtOptions" />
    </FieldComp>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue';
import SelectComp from '@/components/form/SelectComp.vue';
import FieldComp from '@/components/form/FieldComp.vue';
import { rootProvided } from '@/types/injections';
import type { Court, CourtId, Facilitie, FacilitieId } from '@/types/facilities';
import useLeague from '@/composables/useLeague';

interface IProps {
  modelValue: CourtId;
  disabled?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const { getCourtDetails } = useLeague();
const injectedRootData = inject(rootProvided);
const { facilities, courts } = injectedRootData as {
  facilities: Ref<Facilitie[]>;
  courts: Ref<Court[]>;
};

const facilitieId = ref<FacilitieId>(
  (props.modelValue ? getCourtDetails(props.modelValue)?.docId : '') as string,
);
const courtId = computed({
  get: (): CourtId => props.modelValue,
  set: (id: CourtId) => {
    console.log(id);
    emit('update:modelValue', id);
  },
});

const facilitieOptions = computed(() => {
  return Array.isArray(facilities.value)
    ? facilities.value.map((item) => ({
        text: item.title,
        value: item.id,
      }))
    : [];
});

const courtOptions = computed(() => {
  return facilitieId.value && Array.isArray(courts.value)
    ? courts.value
        .filter((item) => item.facilitieId === facilitieId.value)
        .map((item) => ({
          text: item.title,
          value: item.id,
        }))
    : [];
});
</script>

<style scoped lang="scss">
.scores {
  display: grid;
  column-gap: 0.25rem;
  row-gap: 0.25rem;
  grid-template-columns: 3rem 1fr auto 1fr 3rem;
  .add {
    grid-column-start: 2;
    grid-column-end: span 3;
  }
}
</style>
