import { inject, Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VisibilityStateService } from './visibility-state.service';

const MAIN_NAVBAR_VISIBILITY_DEFAULT_VALUE = true;

@Injectable({ providedIn: 'root' })
export class MainNavbarVisibilityService extends VisibilityStateService {
  constructor() {
    super(MAIN_NAVBAR_VISIBILITY_DEFAULT_VALUE);
  }
}

export const mainNavbarVisibilitySetterResolver = (
  value: boolean,
): ResolveFn<boolean> => {
  return (_) => {
    const store = inject(MainNavbarVisibilityService);
    store.setState(value);

    return value;
  };
};
