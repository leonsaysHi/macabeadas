<template>
    <template v-if="value && dateObj">
        <time :date="dateObj">{{ formattedString }}</time>
    </template>
    <template v-else>
        <value-output
            :value="value"
            :mute="false"
        />
    </template>
</template>

<script setup>
    /*
<DateFormat value="2023-02-01T03:00" /> --> 02/01/2023
<DateFormat value="2023-02-01" date-style="long" /> --> January 31, 2023
<DateFormat value="2023-02-01" time-only /> --> 7:00 PM
<DateFormat value="2023-02-01" time-style="short" /> --> 01/31/2023, 7:00 PM
*/
    import { computed } from 'vue'
    import { format, formatSince } from '@/utils/datetimeFormat.js'
    import { add, isAfter, parseISO, isDate } from 'date-fns'
    /*
import { DateStyle, TimeStyle } from '@/types'

interface IProps {
    value: string | null | undefined
    dateStyle?: DateStyle 'full' | 'long' | 'medium' | 'short' | 'numeric' | undefined
    timeStyle?: TimeStyle 'full' | 'long' | 'medium' | 'short' | undefined
    timeOnly?: boolean
    timeSince?: boolean
}
*/

    const props = defineProps({
        value: {
            type: [String, Date],
        },
        dateStyle: {
            type: String,
            default: 'numeric',
        },
        timeStyle: {
            type: String,
        },
        timeOnly: {
            type: Boolean,
        },
        timeSince: {
            type: Boolean,
        },
        dateOffset: {
            type: Boolean,
            default: true,
        },
    })
    const dateObj = computed(() => {
        return isDate(props.value)
            ? props.value
            : typeof props.value === 'string'
              ? parseISO(props.value.toString())
              : undefined
    })
    const formattedString = computed(() => {
        const date = dateObj.value
        if (!date) {
            return ''
        }

        const formatOption = {
            dateStyle: props.timeOnly === false ? props.dateStyle : null,
            timeStyle: props.timeStyle,
        }

        const olderThanDay = isAfter(add(new Date(), { days: -1 }), date)
        return props.timeSince && !olderThanDay
            ? formatSince(date)
            : format(date, formatOption)
    })
</script>
