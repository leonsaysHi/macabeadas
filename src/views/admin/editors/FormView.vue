<script lang="ts" setup>
import { useDocument, useFirestore } from 'vuefire';
import { addDoc, collection, CollectionReference, doc, setDoc } from 'firebase/firestore';
import FieldComp from '@/components/form/FieldComp.vue';
import InputComp from '@/components/form/InputComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import { reactive, ref, watch } from 'vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { useRoute, useRouter } from 'vue-router';
import type { User, UserRole } from '@/types/users';
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
const editorId: string = route.params.id as string;
const formData = reactive<User>({
  email: '',
  role: roleOptions[0].value,
});
const colRef = collection(db, 'users') as CollectionReference<User>;
const docRef = editorId ? doc(colRef, editorId) : undefined;
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
    <FieldComp class="col-md-6" :label="$t('globals.email')">
      <InputComp v-model="formData.email" type="email" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.role')">
      <SelectComp v-model="formData.role" :options="roleOptions" disabled required />
    </FieldComp>
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
    </div>
  </form>
</template>
