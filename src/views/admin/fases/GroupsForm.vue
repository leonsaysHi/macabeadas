<template>
  <div
    class="row row-cols-1 g-2"
    :class="{ 'row-cols-2': model.length >= 2, 'row-cols-3': model.length >= 3 }"
  >
    <template v-for="(group, gIdx) in model" :key="gIdx">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <FieldComp>
              <template #label>
                <div class="mb-2 hstack gap-3 align-items-end justify-content-between">
                  <span>{{ $t('globals.name') }}</span>
                  <template v-if="model.length > 1">
                    <ButtonComp variant="danger" size="sm" @click="handleRemove(gIdx)">{{
                      $t('actions.remove')
                    }}</ButtonComp>
                  </template>
                </div>
              </template>
              <InputComp type="text" v-model="model[gIdx].title" />
            </FieldComp>
          </div>
          <ul class="list-group list-group-flush">
            <template v-for="teamId in group.teams" :key="teamId">
              <li class="list-group-item d-flex justify-content-between gap-3">
                <span>{{ getTeamTitle(teamId) }}</span>
                <ButtonComp
                  variant="light"
                  size="sm"
                  class="btn-close"
                  @click="() => handleRemoveTeam(gIdx, teamId)"
                ></ButtonComp>
              </li>
            </template>
            <li class="list-group-item">
              <SelectComp
                v-model="model[gIdx].teams[model[gIdx].teams.length]"
                :options="options"
                :disabled="!options.length"
                :key="model[gIdx].teams.length"
              />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Option } from '@/types/comp-fields';
import type { FaseGroup } from '@/types/fases';
import type { Team, TeamId } from '@/types/teams';
import SelectComp from '@/components/form/SelectComp.vue';

import ButtonComp from '@/components/ui/ButtonComp.vue';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import useLeagueAdmin from '@/composables/useLeagueAdmin';
interface IProps {
  modelValue: FaseGroup[];
}
const props = withDefaults(defineProps<IProps>(), {});

const { teams, getTeamTitle, getSponsor } = useLeagueAdmin();

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: (): FaseGroup[] => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (val: FaseGroup[]) => {
    if (!Array.isArray(val) || val.length === 0) {
      emit('update:modelValue', [{ title: 'Group 1', teams: [] }]);
    } else {
      emit('update:modelValue', val);
    }
  },
});

const options = computed<Option[]>(() => {
  return Array.isArray(teams?.value)
    ? teams.value.map(
        (item: Team) =>
          ({
            text: getSponsor(item.sponsorId)?.title,
            value: item.id,
            disabled: model.value.findIndex((gr: FaseGroup) => gr.teams.includes(item.id)) > -1,
          }) as Option,
      )
    : [];
});

const handleRemove = (idx: number) => {
  model.value.splice(idx, 1);
};
const handleRemoveTeam = (gIdx: number, tId: TeamId) => {
  const groupTeamsList = model.value[gIdx].teams;
  const newTeamsList = groupTeamsList.slice();
  const idx = newTeamsList.findIndex((teamId: TeamId) => teamId === tId);
  newTeamsList.splice(idx, 1);
  model.value[gIdx].teams = newTeamsList;
};
</script>
