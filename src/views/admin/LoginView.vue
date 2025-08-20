<script lang="ts" setup>
import { /* getRedirectResult, signInWithRedirect, */ signInWithPopup } from 'firebase/auth'
import { ref, type Ref } from 'vue'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { googleAuthProvider } from '../../firebase.ts'
const user = useCurrentUser()
const auth = useFirebaseAuth()!

// display errors if any
const error: Ref<null | string> = ref(null)
function signinRedirect() {
  signInWithPopup(auth, googleAuthProvider).catch((reason) => {
    console.error('Failed signinRedirect', reason)
    error.value = reason
  })
}
</script>

<template>
  <main>
    <h2>Login</h2>
    <template v-if="error">
      <p class="text-danger border-danger p-3">{{ error }}</p>
    </template>
    <template v-if="!user">
      <button class="btn btn-primary" @click="signinRedirect()">SignIn with Google</button>
    </template>
    <template v-else>
      <p>User: {{ user.displayName }}</p>
    </template>
  </main>
</template>
