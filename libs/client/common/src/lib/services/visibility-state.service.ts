import {
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

@Injectable()
export abstract class VisibilityStateService {
  private readonly router = inject(Router);

  private readonly manualTriggered = signal<boolean>(false);

  private readonly state: WritableSignal<boolean>;

  readonly stateValue: Signal<boolean>;

  constructor(private readonly defaultValue: boolean) {
    this.state = signal<boolean>(defaultValue);
    this.stateValue = this.state.asReadonly();
  }

  private readonly resetStateOnNavigationEnd = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => {
        if (this.manualTriggered()) {
          this.manualTriggered.set(false);
          return;
        }
        this.state.set(this.defaultValue);
      }),
      takeUntilDestroyed(),
    )
    .subscribe();

  setState(value: boolean): void {
    this.manualTriggered.set(true);
    this.state.set(value);
  }
}
