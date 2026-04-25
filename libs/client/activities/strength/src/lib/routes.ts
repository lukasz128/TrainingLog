import { Route } from '@angular/router';
import { ShellComponent } from 'strength/ui';

export const routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'test',
        loadComponent: () =>
          import('strength/ui').then((c) => c.InstanceComponent),
      },
      // {
      //   path: 'list',
      // },
      { path: '**', redirectTo: 'test' },
    ],
  },
] satisfies Route[];
