import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, take, tap, throwError } from 'rxjs';
import { StrengthHttpService } from './strength-http.service';
import {
  StrengthActivitiesState,
  StrengthActivity,
  StrengthSet,
} from './strength.types';

@Injectable()
export class StrengthActivityFacadeService {
  public readonly strengthHttpService = inject(StrengthHttpService);

  readonly activitiesState = signal<StrengthActivitiesState>({ state: 'IDLE' });
  readonly activity = signal<StrengthActivity | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly savingExerciseId = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);

  loadActivities(): Observable<StrengthActivity[]> {
    this.activitiesState.set({ state: 'LOADING' });

    return this.strengthHttpService.getActivities$().pipe(
      take(1),
      tap((activities) => {
        this.activitiesState.set({ state: 'LOADED', data: activities });
      }),
      catchError((error) => {
        this.activitiesState.set({
          state: 'ERROR',
          errMsg: 'Cannot load strength activities.',
        });
        return throwError(() => error);
      }),
    );
  }

  loadActiveActivity(): void {
    this.loading.set(true);
    this.error.set(null);

    this.strengthHttpService.getActiveActivity$().subscribe({
      next: (activity) => {
        this.activity.set(activity);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Cannot load strength activity.');
        this.loading.set(false);
      },
    });
  }

  saveExerciseSets(
    exerciseId: string,
    sets: StrengthSet[],
  ): Observable<StrengthSet[]> {
    this.savingExerciseId.set(exerciseId);
    this.saveError.set(null);

    return this.strengthHttpService.saveExerciseSets$(exerciseId, sets).pipe(
      take(1),
      tap((savedSets) => {
        this.applySavedExerciseSets(exerciseId, savedSets);
        this.savingExerciseId.set(null);
      }),
      catchError((error) => {
        this.saveError.set('Cannot save exercise.');
        this.savingExerciseId.set(null);
        return throwError(() => error);
      }),
    );
  }

  saveExerciseSetsOnUnload(exerciseId: string, sets: StrengthSet[]): boolean {
    return this.strengthHttpService.saveExerciseSetsOnUnload(exerciseId, sets);
  }

  private applySavedExerciseSets(
    exerciseId: string,
    sets: StrengthSet[],
  ): void {
    this.activity.update((activity) => {
      if (activity === null) {
        return activity;
      }

      return {
        ...activity,
        items: activity.items.map((item) =>
          item.id === exerciseId ? { ...item, sets } : item,
        ),
      };
    });
  }
}
