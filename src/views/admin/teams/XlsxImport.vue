<template>
  <form @submit="handleSubmit">
    <FieldComp>
      <XlsxUpload @parsed="handleParsed"></XlsxUpload>
    </FieldComp>
    <template v-if="comparedItems.length">
      <DataTableComp :fields="fields" :items="comparedItems" small>
        <template #row.identification="{ value, item }">
          <BadgeComp
            :variant="
              item.compared.noId ? 'danger' : item.compared.updatePlayer ? 'warning' : 'success'
            "
            >{{ item.compared.noId ? '...' : value }}</BadgeComp
          >
        </template>
        <template #row.number="{ value, item }">
          <BadgeComp
            :variant="
              item.compared.duplicatedNumber
                ? 'danger'
                : item.compared.duplicatedPlayer
                  ? 'secondary'
                  : item.compared.updateTeamPlayer
                    ? 'warning'
                    : 'success'
            "
            >{{ value }}</BadgeComp
          >
        </template>
        <template #row.name="{ item }">
          {{ `${item.fname} ${item.lname}` }}<br /><template v-if="item.compared.updatePlayer"
            ><BadgeComp variant="light" class="fw-normal text-decoration-line-through">{{
              `${item.compared.updatePlayer.fname} ${item.compared.updatePlayer.lname}`
            }}</BadgeComp></template
          >
        </template>
        <template #row.dob="{ value, item }">
          <DateFormat :value="value" /><br /><template v-if="item.compared.updatePlayer"
            ><BadgeComp variant="light" class="fw-normal text-decoration-line-through">
              <DateFormat :value="item.compared.updatePlayer.dob" /> </BadgeComp
          ></template>
        </template>
        <template #row.importTo="{ value }">
          <div class="vstack gap-1">
            <BadgeComp
              :variant="value.updatePlayer?.id ? 'warning' : 'success'"
              class="fw-normal"
              >{{
                value.updatePlayer?.id
                  ? $t('admin.teams.form.updateToDatabase')
                  : $t('admin.teams.form.addToDatabase')
              }}</BadgeComp
            >
            <BadgeComp
              :variant="
                value.duplicatedNumber || value.duplicatedPlayer
                  ? 'danger'
                  : value.updateTeamPlayer?.playerId
                    ? 'warning'
                    : 'success'
              "
              class="fw-normal"
              >{{
                value.duplicatedNumber
                  ? $t('admin.teams.form.error.duplicatedNumber')
                  : value.duplicatedPlayer
                    ? $t('admin.teams.form.error.duplicatedPlayer')
                    : value.updateTeamPlayer?.playerId
                      ? $t('admin.teams.form.updateToTeam')
                      : $t('admin.teams.form.addToTeam')
              }}</BadgeComp
            >
          </div>
        </template>
      </DataTableComp>
    </template>
    <div class="hstack justify-content-end gap-4">
      <template v-if="comparedItems.length">
        <div class="hstack gap-2 small">
          <span>{{ $t('admin.teams.form.counts.playerInformations') }}:</span>
          <BadgeComp variant="success"
            >{{ $t('actions.create') }}&nbsp;{{
              comparedItems.filter((item) => !item.compared.updatePlayer).length
            }}</BadgeComp
          >
          <BadgeComp variant="warning"
            >{{ $t('actions.update') }}&nbsp;{{
              comparedItems.filter((item) => item.compared.updatePlayer).length
            }}</BadgeComp
          >
        </div>
        <div class="hstack gap-2 small">
          <span>{{ $t('admin.teams.form.counts.teamPlayers') }}:</span>
          <BadgeComp variant="success"
            >{{ $t('actions.add') }}&nbsp;{{
              comparedItems.filter(
                (item) =>
                  !item.compared.updateTeamPlayer &&
                  !item.compared.duplicatedNumber &&
                  !item.compared.duplicatedPlayer,
              ).length
            }}</BadgeComp
          >
          <BadgeComp variant="warning"
            >{{ $t('actions.update') }}&nbsp;{{
              comparedItems.filter((item) => item.compared.updateTeamPlayer).length
            }}</BadgeComp
          >
          <BadgeComp variant="danger"
            >{{
              comparedItems.filter(
                (item) => item.compared.duplicatedNumber || item.compared.duplicatedPlayer,
              ).length
            }}&nbsp;{{ $t('globals.error', 2) }}</BadgeComp
          >
        </div>
      </template>
      <ButtonComp type="submit" variant="primary">{{ $t(`actions.import`) }}</ButtonComp>
    </div>
  </form>
</template>

<script setup lang="ts">
import FieldComp from '@/components/form/FieldComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { computed, inject, reactive, ref } from 'vue';
import XlsxUpload from '@/components/form/XlsxUpload.vue';
import { adminLeagueProvided, rootProvided } from '@/types/injections';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import { useI18n } from 'vue-i18n';
import type { PlayerId, TeamId, TeamPlayer } from '@/types/teams';
import BadgeComp from '@/components/ui/BadgeComp.vue';
import { collection, CollectionReference, doc, writeBatch } from 'firebase/firestore';
import { playerConverter } from '@/utils/firestore';
import type { Player } from '@/types/players';
import { useFirestore } from 'vuefire';
import DateFormat from '@/components/ui/DateFormat.vue';
import { isTemplateExpression } from 'typescript';

const db = useFirestore();
const { t } = useI18n();
const injectedData = inject(rootProvided);
const players = injectedData?.players;

interface IProps {
  currentTeamId?: TeamId;
  currentPlayers: TeamPlayer[];
}
const props = withDefaults(defineProps<IProps>(), {
  currentTeamId: undefined,
});

interface ImportedPlayer {
  identification: string;
  fname1: string;
  fname2: string;
  lname1: string;
  lname2: string;
  number: string;
  dob: Date;
}
interface ImportedStatus {
  noId: boolean;
  updatePlayer: Player | undefined;
  updateTeamPlayer: TeamPlayer | undefined;
  duplicatedPlayer: boolean | undefined;
  duplicatedNumber: boolean;
}
interface ComparedPlayer extends ImportedPlayer {
  compared: ImportedStatus;
}

const injectedAdminLeagueData = inject(adminLeagueProvided);
const teams = injectedAdminLeagueData?.teams;
const multi = injectedAdminLeagueData?.multi;

const leaguePlayers = computed<PlayerId[]>(() =>
  Array.isArray(teams?.value)
    ? teams.value.reduce((acc, item) => {
        return [
          ...acc,
          ...((!props.currentTeamId || item.id !== props.currentTeamId) &&
          Array.isArray(item.players)
            ? item.players.map((p) => p.playerId)
            : []),
        ];
      }, [] as PlayerId[])
    : [],
);

const isBusy = ref(false);
const fields = [
  {
    key: 'identification',
    label: t('globals.identification'),
  },
  { key: 'number', label: t('globals.number') },
  {
    key: 'name',
    label: t('globals.name'),
  },
  {
    key: 'dob',
    label: t('globals.dob'),
  },
  {
    key: 'importTo',
    label: t('admin.teams.form.importTo'),
    formatter: (value: string | undefined, item: ComparedPlayer) => {
      return item.compared as ImportedStatus;
    },
  },
];
const importedItems = computed<ImportedPlayer[]>(() => {
  return Array.isArray(formData.data) ? formData.data : [];
});
const comparedItems = computed<ComparedPlayer[]>(() => {
  return Array.isArray(importedItems.value)
    ? importedItems.value.map((item: ImportedPlayer, idx: number) => {
        const noId = !item.identification;
        const existingPlayer: Player | undefined = !noId
          ? players?.value.find(
              (i) =>
                i.identification.toLocaleLowerCase() === item.identification.toLocaleLowerCase(),
            )
          : undefined;
        const existingLeaguePlayer =
          Boolean(existingPlayer?.id) && leaguePlayers.value.includes(existingPlayer.id);
        const existingTeamPlayer = props.currentPlayers.find(
          (i) => existingPlayer?.id && i.playerId === existingPlayer.id,
        );
        const duplicatedNumber =
          props.currentPlayers.findIndex(
            (i) => i.number == item.number && (!existingPlayer || i.playerId !== existingPlayer.id),
          ) > -1 ||
          importedItems.value.findIndex(
            (i, _idx: number) => i.number == item.number && idx > _idx,
          ) > -1;
        const compared: ImportedStatus = {
          noId,
          updatePlayer: existingPlayer?.id ? existingPlayer : undefined,
          updateTeamPlayer:
            !duplicatedNumber && existingTeamPlayer?.playerId ? existingTeamPlayer : undefined,
          duplicatedPlayer: existingLeaguePlayer,
          duplicatedNumber,
        };
        return {
          ...item,
          compared,
        };
      })
    : [];
});

const formData = reactive<{ data: ImportedPlayer[] | undefined }>({
  data: undefined,
});

const emit = defineEmits(['import']);

const handleParsed = (data: ImportedPlayer[]) => {
  formData.data = data.map((row) => ({
    ...row,
    identification: row.identification ? row.identification.toString() : '',
    fname1: row.fname1 || '',
    fname2: row.fname2 || '',
    lname1: row.lname1 || '',
    lname2: row.lname2 || '',
    dob: row.dob ? new Date(row.dob) : new Date(),
    gender: multi?.value?.gender,
  }));
};

const handleSubmit = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    const colRef = collection(db, 'players').withConverter(
      playerConverter,
    ) as CollectionReference<Player>;
    const teamPlayers: TeamPlayer[] = [];
    const batch = writeBatch(db);
    comparedItems.value
      .filter((item) => !item.compared.noId)
      .forEach(async (item: ComparedPlayer) => {
        const { compared }: { compared: ImportedStatus } = item;
        const { identification, fname1, fname2, lname1, lname2, dob, number } = item;
        const player = {
          identification,
          fname1,
          fname2,
          lname1,
          lname2,
          dob,
        } as Player;
        const teamPlayer = {
          number,
          playerId: compared.updatePlayer?.id,
        } as TeamPlayer;
        // add / update player's data
        if (compared.updatePlayer?.id) {
          const docRef = doc(colRef, compared.updatePlayer?.id);
          batch.set(docRef, player, { merge: true });
        } else {
          const _docRef = doc(colRef);
          batch.set(_docRef, player, { merge: true });
          teamPlayer.playerId = _docRef.id;
        }
        // add to team
        if (!compared.duplicatedNumber && !compared.duplicatedPlayer) {
          teamPlayers.push(teamPlayer);
        }
      });
    await batch.commit();
    emit('import', teamPlayers);
  } catch (err) {
    console.log(err);
  } finally {
    isBusy.value = false;
  }
};
</script>
