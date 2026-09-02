import { Location } from '@angular/common';
import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

export const ACTIVE_STRENGTH_QUERY_PARAMS_KEY = 'active-strength-is-active';

export const isActiveStrengthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const queryParams = router.routerState.snapshot.root.queryParams;
  const isActiveStrength = queryParams[ACTIVE_STRENGTH_QUERY_PARAMS_KEY];

  if (isActiveStrength !== undefined) {
    const location = inject(Location);
    location.back();
    return false;
  }

  return true;
};
