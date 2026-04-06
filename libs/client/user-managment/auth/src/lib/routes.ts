import { Route } from '@angular/router';

export const routes = [
  {
    path: '',
    loadComponent: () => import('auth/ui').then((c) => c.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('login/ui').then((c) => c.LoginPageComponent),
      },
      {
        path: 'registration',
        loadComponent: () =>
          import('register/ui').then((c) => c.RegisterPageComponent),
      },
    ],
  },
] satisfies Route[];
