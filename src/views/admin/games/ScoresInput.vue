<template>
  <div class="scores">
    <template v-for="(n, idx) in teamNb" :key="idx">
      <template v-if="idx === 0"><div></div></template>
      <h6 class="text-truncate text-center">
        {{ getTeamTitle(model[`team${n}`]) }}
      </h6>
      <div></div>
    </template>
    <template v-for="(n, idx) in teamNb" :key="idx">
      <template v-if="idx === 0"><div></div></template>
      <h5 class="text-center">{{ getTotalScore(model[`scores${n}`]) }}</h5>
      <div><template v-if="idx === 0">Final</template></div>
    </template>

    <template v-for="(period, periodIdx) in periodsList" :key="periodIdx">
      <template v-for="(n, teamIdx) in teamNb" :key="n">
        <div>
          <template v-if="!teamIdx">{{ period }}</template>
          <template v-else
            ><ButtonComp
              variant="light"
              size="sm"
              :disabled="disabled || periodsList.length < 2"
              @click="handleRemovePeriod(periodIdx)"
              >Remove</ButtonComp
            ></template
          >
        </div>
        <div>
          <InputComp
            v-model="model[`scores${n}`][periodIdx]"
            type="number"
            :disabled="disabled"
            @update="(v: number) => handleInput(`scores${n}`, periodIdx, v)"
          />
        </div>
        <template v-if="teamIdx"><div></div></template>
      </template>
    </template>

    <div class="add d-flex justify-content-center">
      <ButtonComp variant="light" size="sm" :disabled="disabled" @click="handleAddPeriod"
        >Add period</ButtonComp
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InputComp from '@/components/form/InputComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import type { Game } from '@/types/games';
import useLeague from '@/composables/useLeague';

interface IProps {
  modelValue: Game;
  disabled?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
});

const { getTeamTitle } = useLeague();
const emit = defineEmits(['update:modelValue', 'input']);
const model = computed({
  get: (): Game => props.modelValue,
  set: (val: Game) => emit('update:modelValue', val),
});
const teamNb = ['1', '2'];
const getTotalScore = (arr: number[]) => {
  return arr.reduce((tot, n) => tot + n, 0);
};
const periodsList = computed(() => {
  return model.value.scores1.map((score, idx) => (idx < 4 ? `Q${idx + 1}` : `OT${idx - 3}`));
});
const handleInput = (teamKey: 'scores1' | 'scores2', periodIdx: number, val: number) => {
  const newValue = { ...model.value } as Game;
  newValue[teamKey][periodIdx] = val;
  emit('update:modelValue', newValue);
};
const handleAddPeriod = () => {
  const newValue = { ...model.value };
  newValue.scores1.push(0);
  newValue.scores2.push(0);
  emit('update:modelValue', newValue);
};
const handleRemovePeriod = (pIdx: number) => {
  const newValue = { ...model.value };
  newValue.scores1.splice(pIdx, 1);
  newValue.scores2.splice(pIdx, 1);
  emit('update:modelValue', newValue);
};
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
