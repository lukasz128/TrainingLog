import { assertInInjectionContext, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  interval,
  NEVER,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

export const sessionTimerFactory = (): SessionTimerAPI => {
  assertInInjectionContext(sessionTimerFactory);

  return new SessionTimer();
};

export interface SessionTimerAPI {
  timer$: Observable<number>;
  timer: Signal<number>;

  start(): void;
  stop(): void;
  togglePause(): void;
  kill(): void;
}

class SessionTimer implements SessionTimerAPI {
  private readonly isTimerWorking$ = new BehaviorSubject<boolean>(false);
  private readonly timerState = signal<number>(0);

  private readonly trainingTimer = this.isTimerWorking$
    .pipe(
      switchMap((isWorking) => {
        if (!isWorking) return NEVER;

        return interval(1000).pipe(
          tap(() => {
            this.timerState.update((time) => time + 1);
          }),
        );
      }),
      takeUntilDestroyed(),
    )
    .subscribe();

  readonly timer = this.timerState.asReadonly();
  readonly timer$ = toObservable(this.timer);

  start(): void {
    this.isTimerWorking$.next(true);
  }
  stop(): void {
    this.isTimerWorking$.next(false);
  }
  togglePause(): void {
    this.isTimerWorking$.next(!this.isTimerWorking$.value);
  }
  kill(): void {
    this.isTimerWorking$.next(false);
    this.timerState.set(0);
  }
}
