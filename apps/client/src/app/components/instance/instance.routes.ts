import { Route } from '@angular/router';
import { IS_REUSE_KEY } from '../../utils/custom-router-reuse-strategy.service';
import { mainHeaderVisibilitySetterResolver } from '../../utils/main-header-visibility';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./instance.component').then((c) => c.InstanceComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('dashboard').then((c) => c.DashboardComponent),
        title: undefined,
      },
      {
        path: 'training',
        loadChildren: () => import('../activities/activities.routes'),
        resolve: {
          mainHeaderVisibility: mainHeaderVisibilitySetterResolver(false),
        },
      },
      {
        path: 'menu',
        loadComponent: () => import('menu').then((c) => c.ShellComponent),
        data: { [IS_REUSE_KEY]: true },
        title: 'Menu',
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
] satisfies Route[];
