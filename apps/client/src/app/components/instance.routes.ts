import { Route } from '@angular/router';
import { IS_REUSE_KEY } from '../utils/custom-router-reuse-strategy.service';

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
        path: 'menu',
        loadComponent: () => import('menu').then((c) => c.ShellComponent),
        data: { [IS_REUSE_KEY]: true },
        title: 'Menu',
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
] satisfies Route[];
