import HomeView from '@/views/HomeView.vue';
import MultiView from '@/views/MultiView.vue';
import LeagueData from '@/views/LeagueData.vue';
import LeagueView from '@/views/LeagueView.vue';
import RankView from '@/views/league/RankView.vue';
import StatsView from '@/views/league/StatsView.vue';
import TeamsView from '@/views/teams/ListView.vue';
import GamesView from '@/views/games/ListView.vue';
import GameView from '@/views/games/ItemView.vue';
export default [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/category/:multiId',
    name: 'multi',
    component: MultiView,
  },

  {
    path: '',
    component: LeagueData,
    children: [
      {
        path: '/league/:leagueId',
        name: 'league',
        redirect: { name: 'league-teams' },
        component: LeagueView,
        children: [
          {
            path: 'rank',
            name: 'league-rank',
            component: RankView,
          },
          {
            path: 'stats',
            name: 'league-stats',
            component: StatsView,
          },
          {
            path: 'games',
            name: 'league-games',
            component: GamesView,
          },
          {
            path: 'game/:gameId',
            name: 'league-game',
            component: GameView,
          },
          {
            path: 'teams',
            name: 'league-teams',
            component: TeamsView,
          },
        ],
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
];
