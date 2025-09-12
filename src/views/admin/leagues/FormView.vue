<script lang="ts" setup>
import { useDocument } from 'vuefire';
import { setDoc } from 'firebase/firestore';
import FieldComp from '@/components/form/FieldComp.vue';
import SelectComp from '@/components/form/SelectComp.vue';
import { defineProps, computed, inject, reactive, ref, watch } from 'vue';
import ButtonComp from '@/components/ui/ButtonComp.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { League, Sport } from '@/types/leagues';
import { rootProvided } from '@/types/injections';
import type { Categorie } from '@/types/categories';
import useFirestoreLeagueRefs from '@/composables/useFirestoreLeagueRefs';

const { t } = useI18n();
const router = useRouter();
const { leagueRef } = useFirestoreLeagueRefs();

const props = defineProps({
  multiId: String,
});

const injectedData = inject(rootProvided);
const categories = injectedData?.categories;
const multies = injectedData?.multies;

const multiOptions = computed(() => {
  const results = Array.isArray(multies?.value)
    ? multies.value.map((item) => {
        const cat = categories?.value?.find((i) => i.id === item.categorieId) as Categorie;
        return {
          value: item.id,
          text: `${cat.title} ${t(`globals.genders.${item.gender}`)}`,
        };
      })
    : [];
  return results;
});

const sports: Sport[] = ['soccer', 'basketball', 'flag', 'baseball', 'kickball', 'volleyball'];
const sportOptions = sports.map((value) => ({
  value,
  text: t(`globals.sports.${value}`),
}));

const isBusy = ref<boolean>(false);
const formData = reactive<League>({
  multiId: props.multiId || '',
  sport: sports[0],
  fases: [],
});
const item = leagueRef
  ? useDocument(leagueRef, {
      once: true,
    })
  : ref();
watch(item, (val) => {
  formData.multiId = val?.multiId;
  formData.sport = val?.sport;
  formData.fases = Array.isArray(val?.fases) ? val.fases : [];
});

const handleSave = async (ev: Event) => {
  ev.preventDefault();
  isBusy.value = true;
  try {
    await setDoc(leagueRef, formData, { merge: true });
    router.push({ name: 'admin' });
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
      {{ $t('admin.leagues.form.title') }}
    </h2>
    <template v-if="item?.id">
      <small class="text-body-secondary">{{ item.id }}</small>
    </template>
  </div>
  <form class="row g-3" @submit="handleSave">
    <FieldComp class="col-md-6" :label="$t('globals.categorie')">
      <SelectComp v-model="formData.multiId" :options="multiOptions" required />
    </FieldComp>
    <FieldComp class="col-md-6" :label="$t('globals.sport')">
      <SelectComp v-model="formData.sport" :options="sportOptions" required />
    </FieldComp>
    <hr />
    <div class="col-12 hstack gap-1 justify-content-end">
      <ButtonComp type="submit" variant="primary" :is-busy="isBusy">Save</ButtonComp>
    </div>
  </form>
</template>
