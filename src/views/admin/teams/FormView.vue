<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

// import RosterForm from './RosterForm.vue';
import FieldComp from '@/components/form/FieldComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useDocument, useFirestore } from 'vuefire';
import { computed, inject, reactive, ref, watch } from 'vue';
import type { Team } from '@/types/teams';
import type { Option } from '@/types/comp-fields';
import { adminLeagueProvided, rootProvided } from '@/types/injections';

const route = useRoute();
const router = useRouter();
const db = useFirestore();

const leagueId = route.params.leagueId as string;
const teamId = route.params.teamId as string;

const injectedData = inject(rootProvided);
const sponsors = injectedData?.sponsors;

const injectedAdminLeagueData = inject(adminLeagueProvided);
const teams = injectedAdminLeagueData?.teams;

const isBusy = ref<boolean>(false);
const sponsorsOptions = computed<Option[]>(() => {
  return sponsors?.value.map((item) => ({
    value: item.id,
    text: item.title,
    disabled:
      teams?.value.findIndex((t) => (!teamId || t.id !== teamId) && t.sponsorId === item.id) > -1,
  }));
});
const formData = reactive<Team>({
  sponsorId: '',
});
const colRef = collection(db, `leagues/${leagueId}/teams`);
const docRef = teamId ? doc(colRef, teamId) : undefined;
const item = docRef
  ? useDocument(docRef, {
      once: true,
    })
  : ref();
watch(item, (val) => {
  formData.sponsorId = val?.sponsorId;
});
const handleSubmit = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    if (docRef) {
      await setDoc(docRef, formData, { merge: true });
    } else {
      await addDoc(colRef, formData);
    }
    router.push({ name: 'admin-league-teams', params: { leagueId } });
  } catch (err) {
    console.warn('Error saving document:', err);
  } finally {
    isBusy.value = false;
  }
};
</script>
<template>
  <form @submit="handleSubmit">
    <FieldComp label="Sponsor">
      <SelectComp v-model="formData.sponsorId" :options="sponsorsOptions" required />
    </FieldComp>
    <div class="d-flex justify-content-end gap-2">
      <ButtonComp variant="primary" type="submit">Save</ButtonComp>
    </div>
  </form>
</template>
