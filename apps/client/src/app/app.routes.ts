import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('auth').then(({ routes }) => routes),
  },
  {
    path: 'instance',
    loadComponent: () => import('dashboard').then((c) => c.Dashboard),
  },
  { path: '**', redirectTo: 'auth' },
];
