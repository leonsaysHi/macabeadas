<script lang="ts" setup>
import { useCollection, useFirestore } from 'vuefire';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import { computed, reactive, ref, watch } from 'vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { useRouter } from 'vue-router';
import type { Settings } from '@/types/settings';

const router = useRouter();
const db = useFirestore();
const colRef = collection(db, 'settings');
const items = useCollection<Settings>(colRef);
const docRef = computed(() => (items.value?.[0]?.id ? doc(colRef, items.value[0].id) : undefined));

const isBusy = ref<boolean>(false);
const formData = reactive<Settings>({
  title: '',
  color: '',
});

watch(items, (val) => {
  formData.title = val?.[0]?.title || '';
  formData.color = val?.[0]?.color || '';
});

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    if (docRef.value) {
      await setDoc(docRef.value, formData, { merge: true });
    } else {
      await addDoc(colRef, formData);
    }
  } catch (err) {
    console.warn('Error saving document:', err);
  } finally {
    router.push({ name: 'admin' });
  }
};
</script>

<template>
  <h2>{{ $t('admin.settings.title') }}</h2>
  <form class="row g-3" @submit="handleSave">
    <FieldComp class="col-md-6" :label="$t('globals.title')">
      <InputComp v-model="formData.title" type="text" />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.color')">
      <InputComp v-model="formData.color" type="color" />
    </FieldComp>
    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
    </div>
  </form>
</template>
