<script lang="ts" setup>
import { useCollection, useDocument, useFirestore } from 'vuefire';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Court, Facilitie, FacilitieId } from '@/types/facilities';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import CourtForm from './CourtForm.vue';
import { useI18n } from 'vue-i18n';
import DataTableComp from '@/components/ui/DataTableComp.vue';
import ModalComp from '@/components/ui/ModalComp.vue';
import useFirestoreLeagueRefs from '@/composables/useFirestoreLeagueRefs';
import useFirestoreRefs from '@/composables/useFirestoreRefs';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const db = useFirestore();

const isBusy = ref<boolean>(false);
const facilitieId = route.params.facilitieId as FacilitieId;

const formData = reactive<Facilitie>({
  title: '',
  link: '',
  map: '',
});
const courtsData = ref<Court[]>([]);

const { getFacilitieRef, courtsColRef } = useFirestoreRefs();
const docRef = facilitieId ? getFacilitieRef(facilitieId) : undefined;
const item = useDocument<Facilitie>(docRef, { once: true });
const courts = facilitieId
  ? useCollection<Court>(query(courtsColRef, where('facilitieId', '==', facilitieId)), {
      once: true,
    })
  : ref([]);

const courtsFields = [
  { key: 'title', label: t('globals.title') },
  { key: 'actions', label: '' },
];

watch(
  () => item.value,
  (val) => {
    if (val?.title) {
      formData.title = val.title;
      formData.link = val.link || '';
      formData.map = val.map || '';
    }
  },
  { immediate: true },
);
watch(
  () => courts.value,
  (val) => {
    if (Array.isArray(val)) {
      courtsData.value.splice(0, courtsData.value.length, ...val);
    }
  },
  { immediate: true },
);

// Add courtsData
const selectedCourtIdx = ref<number>(-1);
const doAddCourt = ref<{ resolve: (value: Court) => void; reject: () => void } | undefined>();
const handeShowCourtForm = async () => {
  try {
    const court: Court = await new Promise((resolve, reject) => {
      doAddCourt.value = { resolve, reject };
    });
    if (selectedCourtIdx.value === -1) {
      courtsData.value.push(court);
    } else {
      courtsData.value.splice(selectedCourtIdx.value, 1, court);
    }
  } catch (err) {
    console.log(err);
  } finally {
    selectedCourtIdx.value = -1;
    doAddCourt.value = undefined;
  }
};
const handleEditCourt = (idx: number) => {
  selectedCourtIdx.value = idx;
  handeShowCourtForm();
};
const handleRemoveCourt = async (idx: number) => {
  courtsData.value.splice(idx, 1);
};

// Save
const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    if (docRef.value) {
      await setDoc(docRef.value, { ...formData }, { merge: true });
    } else {
      const docRef = await addDoc(colRef, { ...formData });
      facilitieId.value = docRef.id;
    }
    const batch = writeBatch(db);
    courtsData.value.forEach((item) => {
      if (item.id) {
        batch.set(
          doc(courtsColRef, item.id),
          { ...item, facilitieId: facilitieId.value },
          { merge: true },
        );
      } else {
        const _docRef = doc(collection(db, 'courts'));
        batch.set(_docRef, { ...item, facilitieId: facilitieId.value });
      }
    });
    const courtsToDelete = courts.value.filter(
      (item) => courtsData.value.findIndex((i) => i.docId === item.id) === -1,
    );
    courtsToDelete.forEach((item) => {
      batch.delete(doc(courtsColRef, item.id));
    });
    await batch.commit();
    router.push({ name: 'admin-facilities' });
  } catch (err) {
    console.warn('Error saving document:', err);
  } finally {
    isBusy.value = false;
  }
};
const handleRemove = async () => {
  try {
    const batch = writeBatch(db);
    if (docRef.value) {
      batch.delete(docRef.value);
      courts.value.forEach((item) => {
        if (item.id) {
          batch.delete(doc(courtsColRef, item.id));
        }
      });
    }
    await batch.commit();
    router.push({ name: 'admin-facilities' });
  } catch (error) {
    console.warn('Error removing document:', error);
  }
};
</script>

<template>
  <div class="hstack justify-content-between">
    <h2>
      {{ $t('admin.facilities.form.title') }}
    </h2>
    <template v-if="item?.id">
      <small class="text-body-secondary">{{ item.id }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <div class="col-md-6">
      <FieldComp :label="$t('globals.title')">
        <InputComp v-model="formData.title" required />
      </FieldComp>
      <FieldComp :label="$t('globals.link')">
        <InputComp v-model="formData.link" />
      </FieldComp>
      <FieldComp :label="$t('globals.map')">
        <InputComp v-model="formData.map" />
      </FieldComp>
    </div>
    <div class="col-md-6">
      <FieldComp>
        <template #label>
          <div class="hstack justify-content-between gap-3">
            <label class="form-label">{{ $t('admin.courts.title', 2) }}</label>
            <div class="hstack gap-2 mb-2">
              <ButtonComp variant="primary" :disabled="!courtsColRef" @click="handeShowCourtForm">{{
                $t('actions.add')
              }}</ButtonComp>
            </div>
          </div>
        </template>
        <DataTableComp :fields="courtsFields" :items="courtsData">
          <template #row.actions="{ index }">
            <div class="hstack gap-2 justify-content-end">
              <ButtonComp variant="light" size="sm" @click="() => handleEditCourt(index)">{{
                $t('actions.edit')
              }}</ButtonComp>
              <ConfirmComp variant="danger" size="sm" @confirm="() => handleRemoveCourt(index)">{{
                $t('actions.remove')
              }}</ConfirmComp>
            </div>
          </template>
        </DataTableComp>
      </FieldComp>
    </div>

    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
      <template v-if="facilitieId">
        <ConfirmComp variant="danger" @confirm="handleRemove">{{
          $t('actions.remove')
        }}</ConfirmComp>
      </template>
    </div>
  </form>
  <template v-if="doAddCourt?.resolve">
    <ModalComp
      :title="$t(`actions.${selectedCourtIdx > -1 ? 'edit' : 'add'}`, 1)"
      is-shown
      hide-footer
      @cancel="doAddCourt?.reject?.()"
    >
      <CourtForm
        :value="courtsData[selectedCourtIdx]"
        @add="(court: Court) => doAddCourt?.resolve?.(court)"
      /> </ModalComp
  ></template>
</template>
