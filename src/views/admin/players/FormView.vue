<script lang="ts" setup>
import { useDocument, useFirestore } from 'vuefire';
import { addDoc, collection, CollectionReference, doc, setDoc } from 'firebase/firestore';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import { computed, inject, reactive, ref, watch } from 'vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { Gender } from '@/types/categories';
import type { Player } from '@/types/players';
const route = useRoute();
const router = useRouter();
const db = useFirestore();
const { t } = useI18n();

const players = inject('players');

const genderOptions = [
  {
    value: 'm' as Gender,
    text: t('globals.genders.m'),
  },
  {
    value: 'f' as Gender,
    text: t('globals.genders.m'),
  },
];
const isBusy = ref<boolean>(false);
const editorId: string = route.params.id as string;
const formData = reactive<Player>({
  identification: '',
  fname: '',
  lname: '',
  dob: '',
  gender: genderOptions[0].value,
});
const colRef = collection(db, 'players') as CollectionReference<Player>;
const docRef = editorId ? doc(colRef, editorId) : undefined;
const item = docRef ? useDocument<Player>(docRef, { once: true }) : ref<Player | null>(null);
watch(
  () => item.value,
  (val: Player | null | undefined) => {
    if (val) {
      formData.identification = val.identification || '';
      formData.fname = val.fname || '';
      formData.lname = val.lname || '';
      formData.gender = val.gender || genderOptions[0].value;
      formData.dob = val.dob || '';
    }
  },
  { immediate: true },
);
const duplicatedIdentification = computed(() => {
  return players.value.findIndex((p: Player) => p.identification === formData.identification) > -1;
});

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    if (docRef) {
      await setDoc(docRef, formData, { merge: true });
    } else {
      await addDoc(colRef, formData);
    }
    router.push({ name: 'admin-players' });
  } catch (err) {
    console.warn('Error saving document:', err);
  } finally {
    isBusy.value = false;
  }
};
</script>

<template>
  <div class="hstack justify-content-between">
    <h2>
      {{ $t('admin.editors.form.title') }}
    </h2>
    <template v-if="item?.id">
      <small class="text-body-secondary">{{ item.id }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <FieldComp
      class="col-md-6"
      :label="$t('globals.identification')"
      :invalid-feedback="duplicatedIdentification ? 'Identification is duplicated' : undefined"
    >
      <InputComp
        v-model="formData.identification"
        :is-invalid="duplicatedIdentification"
        required
      />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.fname')">
      <InputComp v-model="formData.fname" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.lname')">
      <InputComp v-model="formData.lname" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.gender')">
      <SelectComp v-model="formData.gender" :options="genderOptions" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.dob')">
      <InputComp v-model="formData.dob" type="date" required />
    </FieldComp>
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp
        type="submit"
        variant="primary"
        :disabled="duplicatedIdentification"
        :is-busy="isBusy"
        >Save</ButtonComp
      >
    </div>
  </form>
</template>
