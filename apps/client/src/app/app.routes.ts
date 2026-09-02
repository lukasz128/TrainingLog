import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('auth').then(({ routes }) => routes),
  },
  {
    path: 'instance',
    loadChildren: () => import('./components/instance/instance.routes'),
  },
  { path: '**', redirectTo: 'auth' },
];
