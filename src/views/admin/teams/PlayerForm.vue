<template>
  <form @submit="handleSubmit" class="hstack gap-3 align-items-end">
    <FieldComp
      :label="$t('globals.number')"
      :invalidFeedback="isDuplicatedNumber ? $t('admin.teams.form.error.duplicatedNumber') : ''"
      inline
    >
      <InputComp
        v-model="formData.number"
        :isInvalid="Boolean(isDuplicatedNumber)"
        class="mb-0"
        required
      />
    </FieldComp>
    <FieldComp :label="$t('globals.player')" inline class="w-50">
      <SelectComp v-model="formData.playerId" :options="options" class="mb-0" required />
    </FieldComp>
    <div class="hstack align-items-end gap-2">
      <ButtonComp type="submit" variant="primary" :disabled="isDuplicatedNumber">{{
        $t(`actions.${props.value ? 'edit' : 'add'}Player`, props.value ? 2 : 1)
      }}</ButtonComp
      ><template v-if="props.value"
        ><ButtonComp type="button" variant="light" @click="handleCancel">{{
          $t('actions.cancel')
        }}</ButtonComp></template
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import type { Option } from '@/types/comp-fields';
import { adminLeagueProvided, rootProvided } from '@/types/injections';
import type { Player } from '@/types/players';
import type { PlayerId, TeamPlayer } from '@/types/teams';
import { computed, inject, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

const injectedData = inject(rootProvided);
const players = injectedData?.players;

interface IProps {
  value?: TeamPlayer;
  currentPlayers: TeamPlayer[];
}
const props = withDefaults(defineProps<IProps>(), {
  value: undefined,
});

const route = useRoute();
const teamId = route.params.teamId as string;

const injectedAdminLeagueData = inject(adminLeagueProvided);
const teams = injectedAdminLeagueData?.teams;

const leaguePlayers = computed<PlayerId[]>(() =>
  Array.isArray(teams?.value)
    ? teams.value.reduce((acc, item) => {
        return [
          ...acc,
          ...(Array.isArray(item.players) ? item.players.map((p) => p.playerId) : []),
        ];
      }, [] as PlayerId[])
    : [],
);
const teamPlayers = computed<TeamPlayer[]>(() =>
  teamId && Array.isArray(teams?.value)
    ? ((teams.value.find((item) => item.id === teamId)?.players || []) as TeamPlayer[])
    : [],
);

const formData = reactive<TeamPlayer>({
  number: '',
  playerId: '',
});

watch(
  () => props.value,
  (val) => {
    formData.number = val?.number || '';
    formData.playerId = val?.playerId || '';
  },
);

const emit = defineEmits(['add']);

const isDuplicatedNumber = computed(() => {
  return (
    formData.number.length > 0 &&
    teamPlayers.value.findIndex(
      (item) => item.number === formData.number && item.playerId !== formData.playerId,
    ) > -1
  );
});

const options = computed<Option[]>(() => {
  return Array.isArray(players?.value)
    ? players.value
        .filter(
          (item: Player) =>
            item.id && !leaguePlayers.value.includes(item.id) && item.id !== props.value?.playerId,
        )
        .map(
          (item: Player): Option => ({
            text: `${item.fname} ${item.lname}`,
            value: item.id,
          }),
        )
    : [];
});

const handleSubmit = (ev: Event) => {
  ev.preventDefault();
  emit('add', { ...formData } as TeamPlayer);
  formData.number = '';
  formData.playerId = '';
};
const handleCancel = () => {
  if (props.value) {
    emit('add', { ...props.value } as TeamPlayer);
  }
};
</script>
