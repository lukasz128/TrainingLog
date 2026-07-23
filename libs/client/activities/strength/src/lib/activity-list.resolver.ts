import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import {
  StrengthActivity,
  StrengthActivityFacadeService,
} from 'strength/data-access';

export const activityListResolver: ResolveFn<
  StrengthActivity[] | null
> = () => {
  const strengthActivityFacade = inject(StrengthActivityFacadeService);

  return strengthActivityFacade
    .loadActivities()
    .pipe(catchError(() => of(null)));
};
