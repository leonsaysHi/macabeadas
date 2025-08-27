<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useDocument, useFirestore } from 'vuefire';
import { computed, inject, reactive, ref, watch } from 'vue';
import type { PlayerId, Team, TeamId, TeamPlayer } from '@/types/teams';
import type { Option } from '@/types/comp-fields';
import type { TableField } from '@/types/comp-datatable';
import { adminLeagueProvided, rootProvided } from '@/types/injections';
import FieldComp from '@/components/form/FieldComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import ImageComp from '@/components/form/ImageComp.vue';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import PlayerForm from './PlayerForm.vue';
import XlsxImport from './XlsxImport.vue';
import ModalComp from '@/components/ui/ModalComp.vue';
import AlertComp from '@/components/ui/AlertComp.vue';
import type { LeagueId } from '@/types/leagues';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const db = useFirestore();

const leagueId = route.params.leagueId as LeagueId;
const teamId = route.params.teamId as TeamId;

const injectedData = inject(rootProvided);
const sponsors = injectedData?.sponsors;
const players = injectedData?.players;

const injectedAdminLeagueData = inject(adminLeagueProvided);
const teams = injectedAdminLeagueData?.teams;

const isBusy = ref<boolean>(false);
const sponsorsOptions = computed<Option[]>(() => {
  return Array.isArray(sponsors?.value)
    ? sponsors.value.map((item) => ({
        value: item.id,
        text: item.title,
        disabled:
          Array.isArray(teams?.value) &&
          teams.value.findIndex((t) => (!teamId || t.id !== teamId) && t.sponsorId === item.id) >
            -1,
      }))
    : [];
});
const selectedSponsor = computed(() =>
  sponsors?.value.find((item) => item.id === formData.sponsorId),
);
const formData = reactive<Team>({
  sponsorId: '',
  players: [],
});

const fields: TableField[] = [
  {
    key: 'number',
    label: t('globals.number'),
    sortable: true,
  },
  {
    key: 'player',
    label: t('globals.player'),
    formatter: (value) => `${value.fname} ${value.lname}`,
    sortable: true,
    sortByFormatted: true,
  },
  {
    key: 'actions',
    label: '',
  },
];
const colRef = collection(db, `leagues/${leagueId}/teams`);
const docRef = teamId ? doc(colRef, teamId) : undefined;
const item = docRef
  ? useDocument(docRef, {
      once: true,
    })
  : ref();
watch(item, (val) => {
  formData.sponsorId = val?.sponsorId || '';
  formData.players = val?.players || [];
});
const validPlayers = computed(() => {
  return Array.isArray(formData.players)
    ? formData.players
        .map((item: TeamPlayer) => ({
          ...item,
          player: players?.value.find((i) => i.id === item.playerId),
        }))
        .filter((item) => item.player)
    : [];
});
const invalidPlayers = computed(() => {
  return Array.isArray(formData.players)
    ? formData.players
        .map((item: TeamPlayer) => ({
          ...item,
          player: players?.value.find((i) => i.id === item.playerId),
        }))
        .filter((item) => !item.player)
    : [];
});

// Add
const playerToEdit = ref();
const doAddPlayer = ref<{ resolve: (value: TeamPlayer) => void; reject: () => void } | undefined>();
const handeShowPlayerForm = async () => {
  try {
    const player: TeamPlayer = await new Promise((resolve, reject) => {
      doAddPlayer.value = { resolve, reject };
    });
    const idx = formData.players.findIndex((item) => item.playerId === player.playerId);
    if (idx === -1) {
      formData.players.push(player);
    } else {
      formData.players.splice(idx, 1, player);
    }
  } catch (err) {
    console.log(err);
  } finally {
    playerToEdit.value = undefined;
    doAddPlayer.value = undefined;
  }
};
const handleEditPlayer = (playerId: PlayerId) => {
  playerToEdit.value = { ...formData.players.find((item) => item.playerId === playerId) };
  handeShowPlayerForm();
};
const handleRemovePlayer = (id: PlayerId) => {
  const idx = formData.players.findIndex((item) => item.playerId === id);
  if (idx > -1) {
    formData.players.splice(idx, 1);
  }
};

const handleDeleteInvalidPlayers = () => {
  invalidPlayers.value.forEach((item) => handleRemovePlayer(item.playerId));
};

// Import
const doImportPlayers = ref<{ resolve: (value: object) => void; reject: () => void } | undefined>();
const handeImportPlayersForm = async () => {
  try {
    const data: TeamPlayer[] = await new Promise((resolve, reject) => {
      doImportPlayers.value = { resolve, reject };
    });
    data.forEach((item: TeamPlayer) => {
      const idx = formData.players.findIndex((i) => item.playerId === i.playerId);
      if (idx > -1) {
        formData.players.splice(idx, 1, item);
      } else {
        formData.players.push(item);
      }
    });
  } catch (err) {
    console.log(err);
  } finally {
    doImportPlayers.value = undefined;
  }
};

const handleSubmit = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  const payload = {
    ...formData,
    players: formData.players.map(({ playerId, number }) => ({
      playerId,
      number: number.toString(),
    })),
  };
  try {
    if (docRef) {
      await setDoc(docRef, payload, { merge: true });
    } else {
      await addDoc(colRef, payload);
    }
    router.push({ name: 'admin-league-teams', params: { leagueId } });
  } catch (err) {
    console.warn('Error saving document:', err);
  } finally {
    isBusy.value = false;
  }
};
</script>
<template>
  <form @submit="handleSubmit">
    <FieldComp :label="$t('globals.sponsor')">
      <div class="row row-cols-2 align-items-end">
        <div>
          <SelectComp v-model="formData.sponsorId" :options="sponsorsOptions" required />
        </div>
        <template v-if="selectedSponsor">
          <div class="hstack gap-2">
            <span
              class="px-3 align-self-stretch"
              :style="`background-color: ${selectedSponsor.color};`"
            ></span>
            <ImageComp :src="selectedSponsor.logo" :width="50" />
          </div>
        </template>
      </div>
    </FieldComp>
    <FieldComp>
      <template #label>
        <div class="hstack justify-content-between gap-3">
          <label class="form-label">{{ $t('globals.player', 2) }}</label>
          <div class="hstack gap-2 mb-2">
            <ButtonComp variant="primary" @click="handeShowPlayerForm">{{
              $t('actions.add')
            }}</ButtonComp>
            <ButtonComp variant="primary" @click="handeImportPlayersForm">{{
              $t('actions.import')
            }}</ButtonComp>
          </div>
        </div>
      </template>
      <template v-if="invalidPlayers.length">
        <AlertComp>
          {{ invalidPlayers.length }} players are invalid.
          <ButtonComp variant="light" @click="handleDeleteInvalidPlayers">Remove them</ButtonComp>.
        </AlertComp>
      </template>
      <DataTableComp :fields="fields" :items="validPlayers">
        <template #row.actions="{ item }">
          <div class="hstack gap-2">
            <ButtonComp variant="light" size="sm" @click="handleEditPlayer(item.playerId)">{{
              $t('actions.edit')
            }}</ButtonComp>
            <ConfirmComp variant="danger" size="sm" @confirm="handleRemovePlayer(item.playerId)">{{
              $t('actions.remove')
            }}</ConfirmComp>
          </div>
        </template>
      </DataTableComp>
    </FieldComp>
    <hr />
    <div class="d-flex justify-content-end gap-2">
      <ButtonComp variant="primary" type="submit">Save</ButtonComp>
    </div>
  </form>
  <ModalComp
    :title="$t(`actions.${playerToEdit ? 'edit' : 'add'}Player`, 1)"
    :is-shown="Boolean(doAddPlayer)"
    size="lg"
    hide-footer
    @cancel="doAddPlayer?.reject?.()"
  >
    <PlayerForm
      :value="playerToEdit"
      :currentPlayers="validPlayers"
      @add="(player: TeamPlayer) => doAddPlayer?.resolve?.(player)"
    />
  </ModalComp>
  <ModalComp
    :title="$t(`actions.import`)"
    :is-shown="Boolean(doImportPlayers)"
    size="xl"
    hide-footer
    @cancel="doImportPlayers?.reject?.()"
  >
    <XlsxImport
      :current-team-id="teamId"
      :currentPlayers="validPlayers"
      @import="(data: {}[]) => doImportPlayers?.resolve?.(data)"
    />
  </ModalComp>
</template>
