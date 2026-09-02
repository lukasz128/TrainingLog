import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { ActivityManagerService } from 'activity';
import { catchError, of } from 'rxjs';
import {
  StrengthActivity,
  StrengthActivityFacadeService,
} from 'strength/data-access';

export const activityListResolver: ResolveFn<
  StrengthActivity[] | null
> = () => {
  const strengthActivityFacade = inject(StrengthActivityFacadeService);
  const activityManager = inject(ActivityManagerService);

  const activeActivity = activityManager.activeActivity();
  if (activeActivity !== undefined) {
    const router = inject(Router);
    const path = router.parseUrl(activeActivity.routerLink);

    return new RedirectCommand(path);
  }

  return strengthActivityFacade
    .loadActivities()
    .pipe(catchError(() => of(null)));
};
