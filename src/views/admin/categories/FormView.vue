<script lang="ts" setup>
import { addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Categorie } from '@/types/categories';
import { rootProvided } from '@/types/injections';
import type { Multi } from '@/types/multies';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';
import useFirestoreRefs from '@/composables/useFirestoreRefs';

const route = useRoute();
const router = useRouter();

const { categoriesColRef, multiesColRef } = useFirestoreRefs();

const injectedData = inject(rootProvided);
const categories = injectedData?.categories;
const multies = injectedData?.multies;

const gradesOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((value) => ({
  value,
  text: value.toString(),
}));

const isBusy = ref<boolean>(false);
const categorieId: string = route.params.categorieId as string;
const item = computed(() => categories?.value.find((i) => i.id === categorieId));
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
  if (item.value) {
    formData.title = item.value.title;
    formData.grades = item.value.grades;
  }
  const multiMasc = multies?.value.find((i) => i.categorieId === categorieId && i.gender === 'm');
  if (multiMasc) {
    multiMascData.color = multiMasc?.color;
    multiMascData.id = multiMasc?.id;
  }
  const multiFem = multies?.value.find((i) => i.categorieId === categorieId && i.gender === 'f');
  if (multiFem) {
    multiFemData.color = multiFem?.color;
    multiFemData.id = multiFem?.id;
  }
});

const catDocRef = categorieId ? doc(categoriesColRef, categorieId) : undefined;

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    if (catDocRef) {
      await setDoc(catDocRef, formData, { merge: true });
      await setDoc(doc(multiesColRef, multiMascData.id), multiMascData, { merge: true });
      await setDoc(doc(multiesColRef, multiFemData.id), multiFemData, { merge: true });
    } else {
      const docRef = await addDoc(categoriesColRef, formData);
      multiMascData.categorieId = multiFemData.categorieId = docRef.id;
      await addDoc(multiesColRef, multiMascData);
      await addDoc(multiesColRef, multiFemData);
    }
    router.push({ name: 'admin-categories' });
  } catch (err) {
    console.warn('Error saving document:', err);
  } finally {
    isBusy.value = false;
  }
};
const handleRemove = async () => {
  try {
    multies?.value
      .filter((multi) => multi.categorieId === categorieId)
      .forEach(async (multi) => await deleteDoc(doc(multiesColRef, multi.id)));
    await deleteDoc(doc(categoriesColRef, categorieId));
    router.push({ name: 'admin-categories' });
  } catch (error) {
    console.warn('Error removing document:', error);
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
    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
      <template v-if="categorieId"
        ><ConfirmComp variant="danger" @confirm="handleRemove">{{
          $t('actions.remove')
        }}</ConfirmComp></template
      >
    </div>
  </form>
</template>
