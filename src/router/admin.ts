export default [
  {
    path: '',
    name: 'admin',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/MainView.vue'),
  },
  {
    path: 'settings',
    name: 'admin-settings',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/settings/FormView.vue'),
  },
  {
    path: 'editors',
    name: 'admin-editors',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/editors/ListView.vue'),
  },
  {
    path: 'editor-edit/:userId?',
    name: 'admin-editor-edit',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/editors/FormView.vue'),
  },
  {
    path: 'sponsors',
    name: 'admin-sponsors',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/sponsors/ListView.vue'),
  },
  {
    path: 'sponsor-edit/:sponsorId?',
    name: 'admin-sponsor-edit',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/sponsors/FormView.vue'),
  },
  {
    path: 'players',
    name: 'admin-players',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/players/ListView.vue'),
  },
  {
    path: 'player-edit/:playerId?',
    name: 'admin-player-edit',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/players/FormView.vue'),
  },
  {
    path: 'categories',
    name: 'admin-categories',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/categories/ListView.vue'),
  },
  {
    path: 'categorie-edit/:categorieId?',
    name: 'admin-categorie-edit',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/categories/FormView.vue'),
  },
  {
    path: 'league-edit/:leagueId?',
    name: 'admin-league-edit',
    meta: { requiresAuth: true },
    props: (route) => ({
      multiId: route.query.multiId,
    }),
    component: () => import('@/views/admin/leagues/FormView.vue'),
  },
  {
    path: 'league/:leagueId',
    meta: { requiresAuth: true },
    component: () => import('@/views/admin/leagues/HomeView.vue'),
    children: [
      {
        path: 'games',
        name: 'admin-league',
        component: () => import('@/views/admin/games/ListView.vue'),
      },
      {
        path: 'teams',
        name: 'admin-league-teams',
        component: () => import('@/views/admin/teams/ListView.vue'),
      },
      {
        path: 'team/:teamId?',
        name: 'admin-league-team-edit',
        component: () => import('@/views/admin/teams/FormView.vue'),
      },
      {
        path: 'fases',
        name: 'admin-league-fases',
        component: () => import('@/views/admin/fases/ListView.vue'),
      },
    ],
  },
];
