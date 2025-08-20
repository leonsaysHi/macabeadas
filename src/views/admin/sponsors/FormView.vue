<script lang="ts" setup>
import { useDocument, useFirestore } from 'vuefire';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import { reactive, ref, watch } from 'vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { useRoute, useRouter } from 'vue-router';
import type { Sponsor } from '@/types/sponsors';
import type { Settings } from '@/types/settings';

const route = useRoute();
const router = useRouter();
const db = useFirestore();
const isBusy = ref<boolean>(false);
const sponsorId: string = route.params.id as string;
const formData = reactive<Sponsor>({
  title: '',
  color: '',
});
const colRef = collection(db, 'sponsors');
const docRef = sponsorId ? doc(colRef, sponsorId) : undefined;
const item = docRef
  ? useDocument<Sponsor>(docRef, {
      once: true,
    })
  : ref<Sponsor | null>(null);
watch(
  () => item.value,
  (val: Sponsor | null | undefined) => {
    formData.title = val?.title || '';
    formData.color = val?.color || '';
  },
);

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    if (docRef) {
      await setDoc(docRef, formData, { merge: true });
    } else {
      await addDoc(colRef, formData);
    }
    router.push({ name: 'admin-sponsors' });
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
    <FieldComp class="col-md-6" :label="$t('globals.color')">
      <InputComp v-model="formData.color" type="color" required />
    </FieldComp>
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
    </div>
  </form>
</template>
