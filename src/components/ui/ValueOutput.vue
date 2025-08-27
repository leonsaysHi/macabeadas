<template>
  <template v-if="isUndefined">
    <span :class="noValueClassStr">{{ noValue }}</span>
  </template>
  <template v-else>
    <template v-if="link || mailto">
      <a :href="`${mailto ? 'mailto:' : ''}${valueString}`" :class="valueClassStr">{{
        valueString
      }}</a>
    </template>
    <template v-else>
      <span :class="valueClassStr">{{ valueString }}</span>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
/*
<Value :value="..."
  small // do display no-value string smaller
  mute // to display no-value string lighter (default: true)
  link // to create a link
  mailto // to create a mailto: link
/>

Can also get an array to be joined as value:
<value-output :value="[value1, ' ', value2]" />
*/
/*
interface IProps {
    value: string | [] | undefined
    noValue?: string
    noValueClass?: string
    valueClass?: string
    small?: boolean
    mute?: boolean
    link?: boolean
    mailto?: boolean
    text?: string
    textBreak?: boolean
}
*/
const props = defineProps({
  value: {
    type: [String, Array, Number],
    default: '',
  },
  noValue: {
    type: String,
    default: 'n/a',
  },
  noValueClass: {
    type: String,
    default: 'text-body-secondary fw-normal',
  },
  valueClass: {
    type: String,
    default: '',
  },
  small: {
    type: Boolean,
  },
  mute: {
    type: Boolean,
  },
  link: {
    type: Boolean,
  },
  mailto: {
    type: Boolean,
  },
  text: {
    type: Boolean,
  },
  textBreak: {
    type: Boolean,
  },
});

const isUndefined = computed(() => {
  const str = Array.isArray(props.value) ? props.value.join('') : props.value;
  return str === undefined || str === null || (typeof str === 'string' && str.trim().length === 0);
});
const noValueClassStr = computed(() => {
  return [props.noValueClass, props.small && 'small', props.mute && 'opacity-50'];
});
const valueClassStr = computed(() => {
  return [props.valueClass, props.textBreak && 'text-break'];
});
const valueString = computed(() => {
  return props.text?.length
    ? props.text
    : Array.isArray(props.value)
      ? props.value.join('')
      : props.value.toString();
});
</script>

<style scoped>
span.no-value-smaller {
  font-size: 0.85em;
}
</style>
