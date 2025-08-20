<script setup lang="ts">
import { collection } from 'firebase/firestore';
import { RouterView } from 'vue-router';
import { useCollection, useFirestore } from 'vuefire';
const db = useFirestore();
const colRef = collection(db, 'settings');
const items = useCollection(colRef);
</script>

<template>
  <nav class="navbar bg-body-secondary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" :to="{ name: 'home' }">
        <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="50" height="70" />
        {{ items?.[0]?.title || 'Macabeadas' }}
      </RouterLink>
    </div>
  </nav>
  <div class="container-fluid"><RouterView /></div>
</template>
