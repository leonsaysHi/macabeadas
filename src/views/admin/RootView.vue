<script setup lang="ts">
import { useRoute, useRouter, RouterView } from 'vue-router';
import SpinnerComp from '@/components/SpinnerComp.vue';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  useFirebaseAuth,
  useCurrentUser,
  useFirestore,
  useCollection,
  type _RefFirestore,
} from 'vuefire';
import { collection } from 'firebase/firestore';
import { computed, provide } from 'vue';
import type { User } from '@/types/users';
import type { Player } from '@/types/players';

const route = useRoute();
const router = useRouter();

const db = useFirestore();
const user = useCurrentUser();
const auth = useFirebaseAuth()!; // only exists on client side

const playersColRef = collection(db, 'players');
const { data: players, pending: isplayersPending } = useCollection<Player>(playersColRef);

// user is editor
const colRef = collection(db, 'users');
const users = useCollection(colRef) as _RefFirestore<User[]>;
const isEditor = computed<boolean>(
  () => users.value?.findIndex((u) => u.email === user.value?.email && u.role === 'editor') > -1,
);
provide('isEditor', isEditor);
provide('players', players);

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
    <template v-if="isplayersPending">
      <div class="p-5 hstack justify-content-center">
        <SpinnerComp />
      </div>
    </template>
    <template v-else><RouterView /></template>
  </div>
</template>
