<script lang="ts" setup>
import { useDocument, useFirestore } from 'vuefire';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import type { Fase, FaseId, FaseType } from '@/types/fases';
import type { LeagueId } from '@/types/leagues';
import GroupsForm from './GroupsForm.vue';

const route = useRoute();
const router = useRouter();
const db = useFirestore();
const { t } = useI18n();

const typeOptions: { value: FaseType; text: string }[] = [
  {
    value: 'groups',
    text: t('globals.faseTypes.groups', 2),
  },
  {
    value: 'playins',
    text: t('globals.faseTypes.playins', 2),
  },
  {
    value: 'playoffs',
    text: t('globals.faseTypes.playoffs', 2),
  },
];
const isBusy = ref<boolean>(false);
const leagueId = route.params.leagueId as LeagueId;
const faseId: FaseId = route.params.faseId as FaseId;
const formData = reactive<Fase>({
  title: '',
  type: typeOptions[0].value,
  groups: [],
});
const colRef = collection(db, `leagues/${leagueId}/fases`) as CollectionReference<Fase>;
const docRef = faseId ? doc(colRef, faseId) : undefined;
const item = docRef
  ? useDocument(docRef, {
      once: true,
    })
  : ref();
watch(
  () => item?.value,
  (val) => {
    if (val) {
      formData.title = val.title || '';
      formData.type = val.type || typeOptions[0].value;
      formData.groups = val.groups || [];
    }
  },
  { immediate: true },
);

const handleAddGroup = () => {
  formData.groups = [...formData.groups, { title: 'new Group', teams: [] }];
};

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  const payload = { ...formData, groups: formData.groups.filter((item) => item.teams?.length > 0) };
  try {
    if (docRef) {
      await setDoc(docRef, payload, { merge: true });
    } else {
      await addDoc(colRef, payload);
    }
    router.push({ name: 'admin-league-fases' });
  } catch (err) {
    console.warn('Error saving document:', err);
  } finally {
    isBusy.value = false;
  }
};
const handleRemove = async () => {
  try {
    await deleteDoc(doc(colRef, faseId));
    router.push({ name: 'admin-league-fases' });
  } catch (error) {
    console.warn('Error removing document:', error);
  }
};
</script>

<template>
  <div class="hstack justify-content-between">
    <h2>
      {{ $t('admin.fases.form.title') }}
    </h2>
    <template v-if="item?.id">
      <small class="text-body-secondary">{{ item.id }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <FieldComp class="col-6" :label="$t('globals.title')">
      <InputComp v-model="formData.title" required />
    </FieldComp>
    <FieldComp class="col-6" :label="$t('globals.type')">
      <SelectComp v-model="formData.type" :options="typeOptions" required />
    </FieldComp>
    <FieldComp class="col-12">
      <template #label>
        <div class="mb-2 hstack gap-3 align-items-end justify-content-between">
          <span>{{ $t('globals.group', 2) }}</span>
          <ButtonComp variant="primary" @click="handleAddGroup">{{ $t('actions.add') }}</ButtonComp>
        </div>
      </template>
      <GroupsForm v-model="formData.groups" />
    </FieldComp>
    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
      <template v-if="faseId">
        <ConfirmComp variant="danger" @confirm="handleRemove">{{
          $t('actions.remove')
        }}</ConfirmComp>
      </template>
    </div>
  </form>
</template>
