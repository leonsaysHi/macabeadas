<script lang="ts" setup>
import { useDocument, useFirestore } from 'vuefire';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import { inject, onMounted, reactive, ref, watch } from 'vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { useRoute, useRouter } from 'vue-router';
import type { Categorie } from '@/types/categories';
import { rootProvided } from '@/types/injections';
import type { Multi } from '@/types/multies';

const route = useRoute();
const router = useRouter();
const db = useFirestore();
const catColRef = collection(db, 'categories');
const mulColRef = collection(db, 'multies');

const injectedData = inject(rootProvided);
const multies = injectedData?.multies;

const gradesOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((value) => ({
  value,
  text: value.toString(),
}));

const isBusy = ref<boolean>(false);
const categorieId: string = route.params.id as string;
const formData = reactive<Categorie>({
  title: '',
  grades: [],
});

const multiMascData = reactive<Multi>({
  gender: 'm',
  categorieId,
  color: '',
});
const multiFemData = reactive<Multi>({
  gender: 'f',
  categorieId,
  color: '',
});

onMounted(() => {
  const multiMasc = multies?.value.find((i) => i.categorieId === categorieId && i.gender === 'm');
  multiMascData.color = multiMasc?.color || '';
  multiMascData.id = multiMasc?.id || undefined;
  const multiFem = multies?.value.find((i) => i.categorieId === categorieId && i.gender === 'f');
  multiFemData.color = multiFem?.color || '';
  multiFemData.id = multiFem?.id || undefined;
});

const catDocRef = route.params.id ? doc(catColRef, categorieId) : undefined;
const { data: item, pending } = catDocRef
  ? useDocument<Categorie>(catDocRef, {
      once: true,
    })
  : { data: ref<Categorie | null>(null), pending: ref(false) };
watch(
  [item, pending],
  ([val, isLoading]) => {
    if (!isLoading && val) {
      formData.title = val.title || '';
      formData.grades = val.grades || [];
    }
  },
  { immediate: true },
);

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    if (catDocRef) {
      await setDoc(catDocRef, formData, { merge: true });
      await setDoc(doc(mulColRef, multiMascData.id), multiMascData, { merge: true });
      await setDoc(doc(mulColRef, multiFemData.id), multiFemData, { merge: true });
    } else {
      const docRef = await addDoc(catColRef, formData);
      multiMascData.categorieId = multiFemData.categorieId = docRef.id;
      await addDoc(mulColRef, multiMascData);
      await addDoc(mulColRef, multiFemData);
    }
    router.push({ name: 'admin-categories' });
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
      {{ $t('admin.categories.form.title') }}
    </h2>
    <template v-if="item?.id">
      <small class="text-body-secondary">{{ item.id }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <FieldComp class="col-md-6" :label="$t('globals.title')">
      <InputComp v-model="formData.title" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.grade', 2)">
      <SelectComp v-model="formData.grades" :options="gradesOptions" multiple required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.genders.m')">
      <InputComp v-model="multiMascData.color" type="color" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.genders.f')">
      <InputComp v-model="multiFemData.color" type="color" required />
    </FieldComp>
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
    </div>
  </form>
</template>
