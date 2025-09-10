<template>
  <template v-if="dateObj">
    <time :date="dateObj">{{ formattedString }}</time>
  </template>
  <template v-else>
    <ValueOutput value="n/a" :no-value-class="props.noValueClass" :mute="false" />
  </template>
</template>

<script lang="ts" setup>
/*
<DateFormat value="2023-02-01" /> --> 02/01/2023
*/
import { computed } from 'vue';
import { format } from '@/utils/datetimeFormat';
import { isValid, parseISO, isDate } from 'date-fns';
import ValueOutput from '@/components/ui/ValueOutput.vue';
import type { DateStyle, TimeStyle } from '@/utils/datetimeFormat';

interface IProps {
  value: string | Date | undefined;
  noValueClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined,
  noValueClass: 'text-body-secondary fw-normal',
});

const dateObj = computed(() => {
  return isDate(props.value)
    ? props.value
    : typeof props.value === 'string'
      ? parseISO(props.value.toString())
      : undefined;
});
const formattedString = computed(() => {
  const date = dateObj.value;
  if (!date || !isValid(date)) {
    return '';
  }
  const formatOption = {
    dateStyle: 'numeric' as DateStyle,
    timeStyle: undefined as TimeStyle,
  };
  return format(date, formatOption);
});
</script>
