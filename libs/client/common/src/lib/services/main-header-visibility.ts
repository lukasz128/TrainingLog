import { inject, Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VisibilityStateService } from './visibility-state.service';

const MAIN_HEADER_DEFAULT_VALUE = true;

@Injectable({ providedIn: 'root' })
export class MainHeaderVisibilityService extends VisibilityStateService {
  constructor() {
    super(MAIN_HEADER_DEFAULT_VALUE);
  }
}

export const mainHeaderVisibilitySetterResolver = (
  value: boolean,
): ResolveFn<boolean> => {
  return (_) => {
    const store = inject(MainHeaderVisibilityService);
    store.setState(value);

    return value;
  };
};
