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
import type { User, UserRole } from '@/types/users';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import ConfirmComp from '@/components/ui/ConfirmComp.vue';

const route = useRoute();
const router = useRouter();
const db = useFirestore();

const roleOptions = [
  {
    value: 'editor' as UserRole,
    text: 'Editor',
  },
];
const isBusy = ref<boolean>(false);
const userId: string = route.params.userId as string;
const formData = reactive<User>({
  email: '',
  role: roleOptions[0].value,
});
const colRef = collection(db, 'users') as CollectionReference<User>;
const docRef = userId ? doc(colRef, userId) : undefined;
const item = docRef ? useDocument<User>(docRef, { once: true }) : ref<User | null>(null);
watch(
  () => item.value,
  (val: User | null | undefined) => {
    if (val) {
      formData.email = val.email || '';
      formData.role = val.role || roleOptions[0].value;
    }
  },
  { immediate: true },
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
    router.push({ name: 'admin-editors' });
  } catch (err) {
    console.warn('Error saving document:', err);
    isBusy.value = false;
  }
};
const handleRemove = async () => {
  try {
    isBusy.value = true;
    await deleteDoc(doc(colRef, userId));
    router.push({ name: 'admin-editors' });
  } catch (error) {
    console.warn('Error removing document:', error);
    isBusy.value = false;
  }
};
</script>

<template>
  <div class="hstack justify-content-between">
    <h2>
      {{ $t('admin.editors.form.title') }}
    </h2>
    <template v-if="userId">
      <small class="text-body-secondary">{{ userId }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <FieldComp class="col-md-6" :label="$t('globals.email')">
      <InputComp v-model="formData.email" type="email" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.role')">
      <SelectComp v-model="formData.role" :options="roleOptions" disabled required />
    </FieldComp>
    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
      <template v-if="userId">
        <ConfirmComp variant="danger" @confirm="handleRemove">{{
          $t('actions.remove')
        }}</ConfirmComp>
      </template>
    </div>
  </form>
</template>
