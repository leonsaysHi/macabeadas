import './assets/main.scss';
import '../node_modules/bootstrap';

import { createApp } from 'vue';
import App from './App.vue';
import { VueFire, VueFireAuth, firestoreDefaultConverter, globalFirestoreOptions } from 'vuefire';
import { firebaseApp } from './firebase';

import router from './router';
import i18n from './i18n';

const app = createApp(App);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(i18n);

globalFirestoreOptions.converter = {
  toFirestore: firestoreDefaultConverter.toFirestore,
  fromFirestore: (snapshot, options) => {
    const data = firestoreDefaultConverter.fromFirestore(snapshot, options);
    if (!data) return null;
    data.docId = data.id;
    return data;
  },
};
app.use(router);

app.mount('#app');
