<script setup lang="ts">
import { useRoute, useRouter, RouterView } from 'vue-router';
import SpinnerComp from '@/components/SpinnerComp.vue';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useFirebaseAuth, useCurrentUser, useFirestore, useCollection } from 'vuefire';
import { collection, collectionGroup, doc } from 'firebase/firestore';
import { computed, provide } from 'vue';
import type { User } from '@/types/users';
import type { Player } from '@/types/players';
import type { Settings } from '@/types/settings';
import type { Categorie } from '@/types/categories';
import type { Multi } from '@/types/multies';
import type { League } from '@/types/leagues';
import type { Sponsor } from '@/types/sponsors';
import { rootProvided } from '@/types/injections';
import type { Court, Facilitie } from '@/types/facilities';
import { playerConverter } from '@/utils/firestore';

const route = useRoute();
const router = useRouter();

const db = useFirestore();
const user = useCurrentUser();
const auth = useFirebaseAuth()!; // only exists on client side

// user is editor
const colRef = collection(db, 'users');
const users = useCollection<User>(colRef, { once: true });
const isEditor = computed<boolean>(
  () => users.value?.findIndex((u) => u.email === user.value?.email && u.role === 'editor') > -1,
);

// provide
const settingsColRef = collection(db, 'settings');
const categoriesColRef = collection(db, 'categories');
const multiesColRef = collection(db, 'multies');
const leaguesColRef = collection(db, 'leagues');
const sponsorsColRef = collection(db, 'sponsors');
const playersColRef = collection(db, 'players').withConverter(playerConverter);
const facilitiesColRef = collection(db, 'facilities');
const courtsColRef = collection(db, 'courts');
const { data: settingsList, pending: isSetsPending } = useCollection<Settings>(settingsColRef);
const { data: categories, pending: isCatsPending } = useCollection<Categorie>(categoriesColRef);
const { data: multies, pending: isMulsPending } = useCollection<Multi>(multiesColRef);
const { data: leagues, pending: isLeasPending } = useCollection<League>(leaguesColRef);
const { data: sponsors, pending: isSposPending } = useCollection<Sponsor>(sponsorsColRef);
const { data: players, pending: isPlasPending } = useCollection<Player>(playersColRef);
const { data: facilities, pending: isFacsPending } = useCollection<Facilitie>(facilitiesColRef);
const { data: courts, pending: isCousPending } = useCollection<Court>(courtsColRef);
const settings = computed(() => (Array.isArray(settingsList) ? settingsList[0] : {}));

provide(rootProvided, {
  settings,
  categories,
  multies,
  leagues,
  sponsors,
  players,
  facilities,
  courts,
  isEditor,
});

// sign in/out
const handleSignOut = () => signOut(auth);
onAuthStateChanged(auth, (user) => {
  if (user) {
    router.replace({ name: (route?.query?.redirectTo || route?.name || 'admin') as string });
  } else {
    router.replace({ name: 'login', query: { redirectTo: route.name as string } });
  }
});
</script>

<template>
  <nav class="navbar bg-body-secondary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" :to="{ name: 'admin' }">{{ $t('admin.title') }}</RouterLink>
      <div class="d-flex navbar-nav">
        <template v-if="user"
          ><button class="nav-link" type="button" @click="handleSignOut">
            {{ $t('actions.signout') }}
          </button></template
        >
      </div>
    </div>
  </nav>
  <div class="container-fluid py-4">
    <template v-if="false">
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else>
      <template
        v-if="
          isSetsPending ||
          isCatsPending ||
          isMulsPending ||
          isLeasPending ||
          isSposPending ||
          isPlasPending ||
          isFacsPending ||
          isCousPending
        "
      >
        <div class="p-5 hstack justify-content-center">
          <SpinnerComp />
        </div>
      </template>
      <template v-else>
        <RouterView />
      </template>
    </template>
  </div>
</template>
