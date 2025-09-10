import HomeView from '@/views/HomeView.vue';
import MultiView from '@/views/MultiView.vue';
import LeagueData from '@/views/LeagueData.vue';
import LeagueView from '@/views/LeagueView.vue';
import RankView from '@/views/league/RankView.vue';
import PlayerView from '@/views/players/ItemView.vue';
import StatsView from '@/views/league/StatsView.vue';
import TeamsView from '@/views/teams/ListView.vue';
import TeamView from '@/views/teams/ItemView.vue';
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
            path: 'player/:playerId',
            name: 'league-player',
            component: PlayerView,
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
          {
            path: 'team/:teamId',
            name: 'league-team',
            component: TeamView,
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
