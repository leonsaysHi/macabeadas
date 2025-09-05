import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';
import FrontChildren from './front.ts';
import RootView from '@/views/RootView.vue';
import LoginView from '@/views/admin/LoginView.vue';
import AdminView from '@/views/admin/RootView.vue';
import AdminChildren from './admin.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: RootView,
      children: [...FrontChildren],
    },
    {
      path: '/admin',
      component: AdminView,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView,
        },
        ...AdminChildren.map((route) => ({
          ...route,
          meta: { requiresAuth: false },
        })),
      ],
    },
  ],
});
router.beforeEach(async (to) => {
  if (to.meta?.requiresAuth) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      };
    }
  }
});

export default router;
