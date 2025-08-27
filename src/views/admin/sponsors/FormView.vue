<script lang="ts" setup>
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import { useDocument, useFirebaseStorage, useFirestore, useStorageFile } from 'vuefire';
import { ref as storageRef } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
import type { Sponsor } from '@/types/sponsors';
import FieldComp from '@/components/form/FieldComp.vue';
import ImageUpload from '@/components/form/ImageUpload.vue';
import InputComp from '@/components/form/InputComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import { rootProvided } from '@/types/injections';

const route = useRoute();
const router = useRouter();
const db = useFirestore();
const isBusy = ref<boolean>(false);
const sponsorId: string = route.params.sponsorId as string;

const injectedData = inject(rootProvided);
const sponsors = injectedData?.sponsors;
const item = computed<Sponsor>(
  () => sponsors?.value.find((item) => item.id === sponsorId) as Sponsor,
);

const formData = reactive<Sponsor>({
  title: '',
  shortTitle: '',
  color: '',
  logo: '',
});
const logoUpload = ref<File | undefined>();

const colRef = collection(db, 'sponsors');
const docRef = sponsorId ? doc(colRef, sponsorId) : undefined;

const storage = useFirebaseStorage();
const logoFileName = `sponsors/${new Date().getTime().toString()}`;
const logoFileRef = storageRef(storage, logoFileName);
const { url, uploadError, uploadTask, upload, refresh } = useStorageFile(logoFileRef);

onMounted(() => {
  if (item.value) {
    formData.title = item?.value.title;
    formData.shortTitle = item?.value.shortTitle;
    formData.color = item?.value.color;
    formData.logo = item?.value.logo;
  }
});

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    const _docRef = docRef || (await addDoc(colRef, { title: formData.title }));
    if (logoUpload.value) {
      await upload(logoUpload.value);
      await refresh();
      formData.logo = url.value as string;
    }
    await setDoc(_docRef, formData, { merge: true });
    router.push({ name: 'admin-sponsors' });
  } catch (err) {
    console.warn('Error saving document:', err);
    isBusy.value = false;
  }
};
const handleRemove = async () => {
  try {
    isBusy.value = true;
    await deleteDoc(doc(colRef, sponsorId));
    router.push({ name: 'admin-sponsors' });
  } catch (error) {
    console.warn('Error removing document:', error);
  }
};
</script>

<template>
  <div class="hstack justify-content-between">
    <h2>
      {{ $t('admin.sponsors.form.title') }}
    </h2>
    <template v-if="item?.id">
      <small class="text-body-secondary">{{ item.id }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <FieldComp class="col-md-6" :label="$t('globals.title')">
      <InputComp v-model="formData.title" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.shortTitle')">
      <InputComp v-model="formData.shortTitle" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.color')">
      <InputComp v-model="formData.color" type="color" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.logo')">
      <ImageUpload v-model="logoUpload" :src="formData.logo" :disabled="!!uploadTask" />
      {{ uploadError }}
    </FieldComp>
    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
      <template v-if="sponsorId">
        <ConfirmComp variant="danger" @confirm="handleRemove" :disabled="isBusy">{{
          $t('actions.remove')
        }}</ConfirmComp></template
      >
    </div>
  </form>
</template>
