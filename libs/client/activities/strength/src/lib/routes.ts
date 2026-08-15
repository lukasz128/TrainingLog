import { Route } from '@angular/router';
import {
  getHttpService,
  mainHeaderVisibilitySetterResolver,
  mainNavbarVisibilitySetterResolver,
} from 'common';
import {
  StrengthActivityFacadeService,
  StrengthHttpMockService,
  StrengthHttpService,
} from 'strength/data-access';
import { ShellComponent } from 'strength/ui';
import { activityListResolver } from './activity-list-resolver/activity-list.resolver';
import { isActiveStrengthGuard } from './utils/route/is-active-strength-guard';

export const routes = [
  {
    path: '',
    component: ShellComponent,
    providers: [
      StrengthActivityFacadeService,
      {
        provide: StrengthHttpService,
        useFactory: getHttpService({
          service: StrengthHttpService,
          mockService: StrengthHttpMockService,
        }),
      },
    ],
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('strength/ui').then((c) => c.ActivityListComponent),
        canActivate: [isActiveStrengthGuard],
        resolve: {
          activities: activityListResolver,
          mainHeaderVisibility: mainHeaderVisibilitySetterResolver(false),
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('strength/strength-instance').then((c) => c.InstanceComponent),
        resolve: {
          mainHeaderVisibility: mainHeaderVisibilitySetterResolver(false),
          mainNavbarVisibility: mainNavbarVisibilitySetterResolver(false),
        },
      },
      { path: '**', redirectTo: 'list' },
    ],
  },
] satisfies Route[];
