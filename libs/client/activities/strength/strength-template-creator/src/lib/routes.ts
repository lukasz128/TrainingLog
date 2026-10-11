import { Route } from '@angular/router';

export const IS_NEW_TEMPLATE = 'IS_NEW_TEMPLATE';

export const router: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'new',
        pathMatch: 'full',
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./components/instance/instance.component').then(
            (c) => c.InstanceComponent,
          ),
        data: {
          [IS_NEW_TEMPLATE]: true,
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/instance/instance.component').then(
            (c) => c.InstanceComponent,
          ),
        data: {
          [IS_NEW_TEMPLATE]: false,
        },
      },
    ],
  },
];
