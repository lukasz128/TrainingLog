import { Route } from '@angular/router';
import { ActivitiesComponent } from './activities.component';

export default [
  {
    path: '',
    component: ActivitiesComponent,
    children: [
      {
        path: 'strength',
        loadChildren: () => import('strength').then(({ routes }) => routes),
      },
      { path: '**', redirectTo: 'strength' },
    ],
  },
] satisfies Route[];
