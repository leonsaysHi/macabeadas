<script lang="ts" setup>
import { doc, writeBatch } from 'firebase/firestore';
import { computed, inject, reactive, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FieldComp from '@/components/form/FieldComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import type { Game, GameBoxScore, GameId, GameStatus } from '@/types/games';
import DateInputComp from '@/components/form/DateInputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import { rootProvided } from '@/types/injections';
import type { Option } from '@/types/comp-fields';
import type { Fase } from '@/types/fases';
import type { TeamId, TeamPlayer } from '@/types/teams';
import useLeagueAdmin from '@/composables/useLeagueAdmin';
import { useI18n } from 'vue-i18n';
import ScoresInput from './ScoresInput.vue';
import type { Court, Facilitie, FacilitieId } from '@/types/facilities';
import BoxscoreSheets from './BoxscoreSheets.vue';
import { useFirestore } from 'vuefire';
import useFirestoreRefs from '@/composables/useFirestoreRefs';
import type { GameComputed } from '@/types/leaguesComputed';

const db = useFirestore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const emit = defineEmits(['updated']);
const injectedRootData = inject(rootProvided);
const { facilities, courts } = injectedRootData as {
  facilities: Ref<Facilitie[]>;
  courts: Ref<Court[]>;
};
const { gamesColRef: colRef, getGameRef, computedGameRef } = useFirestoreRefs();
const { fases, games, getTeamTitle, getCourtDetails, getTeam, getComputedGame } = useLeagueAdmin();

const isBusy = ref<boolean>(false);
const gameId: string = route.params.gameId as GameId;
const item = computed(() =>
  Array.isArray(games.value) && gameId ? games.value.find((item) => item.id === gameId) : undefined,
);
const formData = reactive<Game>({
  team1: '',
  team2: '',
  scores1: [0],
  scores2: [0],
  faseId: '',
  datetime: new Date(),
  status: 'none',
  courtId: '',
  boxscore: {},
});
const facilitieId = ref<FacilitieId>('');

watch(
  () => item.value,
  (val: Game | null | undefined) => {
    console.log('new doc', 'y2cAxRepXMtYFyz5DXPk.dnp:', val?.boxscore?.y2cAxRepXMtYFyz5DXPk.dnp);
    if (val) {
      formData.boxscore = val.boxscore || {};
      formData.team1 = val.team1 || '';
      formData.team2 = val.team2 || '';
      formData.scores1 = val.scores1 || [0];
      formData.scores2 = val.scores2 || [0];
      formData.datetime = val.datetime || new Date();
      formData.faseId = val.faseId || '';
      formData.status = val.status || ('none' as GameStatus);
      formData.courtId = val.courtId || '';
      facilitieId.value = formData.courtId
        ? getCourtDetails(formData.courtId)?.docId
        : ('' as string);
    }
  },
  { immediate: true },
);
const fasesOptions = computed<Option[]>(() =>
  Array.isArray(fases.value)
    ? fases.value.map((item: Fase): Option => ({ text: item.title, value: item.id }))
    : [],
);

// team select
const selectedGroupIdx = ref();
const groupsOptions = computed<Option[]>(() => {
  const fase = fases.value?.find((item) => item.id === formData.faseId);
  return Array.isArray(fase?.groups)
    ? fase.groups.map((item, idx): Option => ({ text: item.title, value: idx }))
    : [];
});
watch(groupsOptions, (val) => {
  selectedGroupIdx.value = val && val.length === 1 ? 0 : undefined;
});
watch(selectedGroupIdx, () => {
  formData.team1 = '';
  formData.team2 = '';
  formData.scores1 = [0];
  formData.scores2 = [0];
});
const teamsOptions = computed<Option[]>(() => {
  const fase = fases.value?.find((item) => item.id === formData.faseId);
  return !gameId && fase?.groups?.[selectedGroupIdx.value]?.teams
    ? fase.groups[selectedGroupIdx.value].teams.map(
        (teamId: TeamId): Option => ({
          value: teamId,
          text: getTeamTitle(teamId) as string,
          disabled: teamId === formData.team1 || teamId === formData.team2,
        }),
      )
    : gameId
      ? [formData.team1, formData.team2].map(
          (teamId: TeamId): Option => ({
            value: teamId,
            text: getTeamTitle(teamId) as string,
            disabled: true,
          }),
        )
      : [];
});

// facility court option
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

// players and boxscore
const team1Players = computed(() => {
  const team = formData.team1 ? getTeam(formData.team1) : undefined;
  return team?.players || [];
});
watch(team1Players, (val, oldVal) => {
  const newVal = { ...formData.boxscore } as GameBoxScore;
  if (Array.isArray(oldVal)) {
    oldVal.forEach((player: TeamPlayer) => delete newVal[player.playerId]);
  }
  if (Array.isArray(val)) {
    val.forEach(
      (player: TeamPlayer) =>
        (newVal[player.playerId] = {
          dnp: 0,
          ...(formData.boxscore[player.playerId] || {}),
        }),
    );
  }
  formData.boxscore = newVal;
});
const team2Players = computed(() => {
  const team = formData.team2 ? getTeam(formData.team2) : undefined;
  return team?.players || [];
});
watch(team2Players, (val, oldVal) => {
  const newVal = { ...formData.boxscore };
  if (Array.isArray(oldVal)) {
    oldVal.forEach((player: TeamPlayer) => delete newVal[player.playerId]);
  }
  if (Array.isArray(val)) {
    val.forEach(
      (player: TeamPlayer) =>
        (newVal[player.playerId] = {
          dnp: 0,
          ...(formData.boxscore[player.playerId] || {}),
        }),
    );
  }
  formData.boxscore = newVal;
});

const statusesOptions = (['none', 'live', 'finished'] as GameStatus[]).map(
  (value: GameStatus): Option => ({
    text: t(`globals.statuses.${value}`),
    value,
  }),
);

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  try {
    isBusy.value = true;
    const batch = writeBatch(db);
    const docRef = gameId ? getGameRef(gameId) : doc(colRef);

    // game
    batch.set(docRef, formData, { merge: true });

    // computed
    const computedData: GameComputed = getComputedGame({ id: docRef.id, ...formData });
    batch.set(computedGameRef(docRef.id), computedData, { merge: true });
    await batch.commit();
    emit('updated');
    router.push({ name: 'admin-league-games' });
  } catch (err) {
    console.warn('Error saving document:', err);
    isBusy.value = false;
  }
};
const handleRemove = async () => {
  if (!gameId) {
    return;
  }
  try {
    isBusy.value = true;
    const batch = writeBatch(db);
    // game
    const docRef = getGameRef(gameId);
    batch.delete(docRef);
    // computed game
    batch.delete(computedGameRef(docRef.id));
    await batch.commit();
    emit('updated');
    router.push({ name: 'admin-league-games' });
  } catch (error) {
    console.warn('Error removing document:', error);
    isBusy.value = false;
  }
};
</script>

<template>
  <div class="hstack justify-content-between">
    <h2>
      {{ $t('admin.games.form.title') }}
    </h2>
    <template v-if="gameId">
      <small class="text-body-secondary">{{ gameId }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <FieldComp class="col-md-6" :label="$t('globals.date')">
      <DateInputComp v-model="formData.datetime" type="datetime-local" required />
    </FieldComp>
    <div class="col-md-6">
      <div class="row row-cols-2">
        <FieldComp label="Facilit"
          ><SelectComp v-model="facilitieId" :options="facilitieOptions" />
        </FieldComp>
        <FieldComp label="Court">
          <SelectComp v-model="formData.courtId" :options="courtOptions" />
        </FieldComp>
      </div>
    </div>
    <FieldComp class="col-md-6" :label="$t('globals.status')">
      <SelectComp v-model="formData.status" :options="statusesOptions" />
    </FieldComp>

    <FieldComp class="col-md-6" :label="$t('globals.fase')">
      <SelectComp v-model="formData.faseId" :options="fasesOptions" required />
    </FieldComp>
    <template v-if="!gameId">
      <FieldComp class="col-md-6" :label="$t('globals.group')">
        <SelectComp
          v-model="selectedGroupIdx"
          :options="groupsOptions"
          :disabled="!formData.faseId || !groupsOptions || groupsOptions.length === 1"
          required
        />
      </FieldComp>
    </template>

    <template v-if="!gameId">
      <FieldComp class="col-md-6" :label="`${$t('globals.team')} #1`">
        <SelectComp
          v-model="formData.team1"
          :options="teamsOptions"
          :disabled="!teamsOptions.length"
          required
        />
      </FieldComp>
      <FieldComp class="col-md-6" :label="`${$t('globals.team')} #2`">
        <SelectComp
          v-model="formData.team2"
          :options="teamsOptions"
          :disabled="!teamsOptions.length"
          required
        /> </FieldComp></template
    ><template v-else>
      <FieldComp class="col-12" :label="$t('globals.team', 2)">
        <div class="row row-cols-2">
          <div>{{ getTeamTitle(formData.team1) }}</div>
          <div>{{ getTeamTitle(formData.team2) }}</div>
        </div>
      </FieldComp>
    </template>
    <FieldComp label="Scores">
      <ScoresInput
        v-model="formData"
        :disabled="!formData.team1 || !formData.team2 || formData.status === 'finished' || isBusy"
      />
    </FieldComp>

    <template v-if="formData.team1">
      <FieldComp :label="`${$t('globals.stats', 2)} ${getTeamTitle(formData.team1)}`">
        <BoxscoreSheets
          v-model="formData.boxscore"
          :players="team1Players"
          :disabled="teamsOptions.length === 0 || formData.status === 'finished'"
        />
      </FieldComp>
    </template>

    <template v-if="formData.team2">
      <FieldComp :label="`${$t('globals.stats', 2)} ${getTeamTitle(formData.team2)}`">
        <BoxscoreSheets
          v-model="formData.boxscore"
          :players="team2Players"
          :disabled="teamsOptions.length === 0 || formData.status === 'finished'"
        />
      </FieldComp>
    </template>

    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
      <template v-if="gameId">
        <ConfirmComp variant="danger" @confirm="handleRemove">{{
          $t('actions.remove')
        }}</ConfirmComp>
      </template>
    </div>
  </form>
</template>
