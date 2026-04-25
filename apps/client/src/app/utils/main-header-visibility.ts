import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, ResolveFn, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

const HAS_MAIN_HEADER_DEFAULT_VALUE = true;

@Injectable({ providedIn: 'root' })
export class MainHeaderVisibilityService {
  private readonly router = inject(Router);
  private readonly state = signal<boolean>(HAS_MAIN_HEADER_DEFAULT_VALUE);
  private readonly manualTriggered = signal<boolean>(false);

  private readonly resetStateOnNavigationEnd = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => {
        if (this.manualTriggered()) {
          this.manualTriggered.set(false);
          return;
        }
        this.state.set(HAS_MAIN_HEADER_DEFAULT_VALUE);
      }),
      takeUntilDestroyed(),
    )
    .subscribe();

  readonly stateValue = this.state.asReadonly();

  setState(value: boolean): void {
    this.manualTriggered.set(true);
    this.state.set(value);
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
