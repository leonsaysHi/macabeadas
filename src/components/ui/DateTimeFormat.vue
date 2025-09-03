<template>
  <template v-if="value && dateObj">
    <time :date="dateObj">{{ formattedString }}</time>
  </template>
  <template v-else>
    <ValueOutput :value="value" :mute="false" />
  </template>
</template>

<script lang="ts" setup>
/*
<DateFormat value="2023-02-01T03:00" /> --> 02/01/2023
<DateFormat value="2023-02-01" date-style="long" /> --> January 31, 2023
<DateFormat value="2023-02-01" time-only /> --> 7:00 PM
<DateFormat value="2023-02-01" time-style="short" /> --> 01/31/2023, 7:00 PM
*/
import { computed } from 'vue';
import { format, formatSince } from '@/utils/datetimeFormat.js';
import { add, isAfter, parseISO, isDate } from 'date-fns';

import type { DateStyle, TimeStyle } from '@/utils/datetimeFormat';
import ValueOutput from './ValueOutput.vue';

interface IProps {
  value: string | null | undefined;
  dateStyle?: DateStyle;
  timeStyle?: TimeStyle;
  timeOnly?: boolean;
  timeSince?: boolean;
  noValueClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined,
  dateStyle: 'numeric',
  timeStyle: 'full',
  timeOnly: false,
  timeSince: false,
  dateOffset: true,
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
  if (!date) {
    return '';
  }

  const formatOption = {
    dateStyle: props.timeOnly === false ? props.dateStyle : null,
    timeStyle: props.timeStyle,
  };

  const olderThanDay = isAfter(add(new Date(), { days: -1 }), date);
  return props.timeSince && !olderThanDay ? formatSince(date) : format(date, formatOption);
});
</script>
