<script setup lang="ts">
import CheckComp from '@/components/form/CheckComp.vue';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import useLeague from '@/composables/useLeague';
import type { GameBoxScore } from '@/types/games';
import type { PlayerId, PlayerStatLine } from '@/types/players';
import type { TeamPlayer } from '@/types/teams';
import { computed, onBeforeMount, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface IProps {
  modelValue: GameBoxScore;
  players: TeamPlayer[];
  disabled?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
});

const { getPlayer } = useLeague();
const { t } = useI18n();

const fields = computed(() => {
  return [
    { key: 'number', label: '' },
    {
      key: 'player',
      label: t('globals.player', 2),
      formatter: (value, item) => {
        return getPlayer(item.playerId);
      },
    },
    { key: 'dnp', label: t('statistics.dnp') },
  ];
});

const emit = defineEmits(['update:modelValue']);
const model = reactive<{ [key: PlayerId]: PlayerStatLine }>({});

// fill model with props
onBeforeMount(() => {
  props.players.forEach(({ playerId }) => {
    if (props.modelValue[playerId]) {
      model[playerId] = props.modelValue[playerId];
    }
  });
});

// trigger update update
watch(model, (val) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...val,
  });
});

const items = computed<TeamPlayer[]>(() => {
  return Object.keys(model).map((playerId) => {
    return props.players.find((item) => item.playerId === playerId) as TeamPlayer;
  });
});
</script>

<template>
  <DataTableComp :items="items" :fields="fields" small>
    <template #row.number="{ value }">
      <div class="lh-1 fw-bold text-end">#{{ value }}</div>
    </template>
    <template #row.player="{ value }">
      <div class="lh-1">{{ value.fname1 }} {{ value.lname1 }}</div>
      <small class="text-secondary">{{ value.id }}</small>
    </template>
    <template #row.dnp="{ item }">
      <CheckComp
        v-model="model[item.playerId].dnp"
        :value="1"
        :uncheck-value="0"
        :disabled="disabled"
        switch
      />
    </template>
  </DataTableComp>
</template>
