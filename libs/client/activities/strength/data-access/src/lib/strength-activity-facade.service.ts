import { effect, inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  finalize,
  forkJoin,
  from,
  map,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { StrengthHttpService } from './strength-http.service';
import {
  ACTIVE_STRENGTH_WORKOUT_DRAFT_ID,
  StrengthWorkoutDraftService,
} from './strength-workout-draft.service';
import {
  StrengthActivitiesState,
  StrengthActivity,
  StrengthSet,
  StrengthWorkoutDraft,
} from './strength.types';

@Injectable()
export class StrengthActivityFacadeService {
  // private readonly activityManager = inject(ActivityManagerService);
  public readonly strengthHttpService = inject(StrengthHttpService);
  private readonly workoutDraftService = inject(StrengthWorkoutDraftService);

  readonly activitiesState = signal<StrengthActivitiesState>({ state: 'IDLE' });
  readonly activity = signal<StrengthActivity | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly savingExerciseId = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  private readonly autoSaveSuspended = signal(false);
  private draftStartTime = Date.now();

  constructor() {
    effect((onCleanup) => {
      const activity = this.activity();

      if (activity === null || this.autoSaveSuspended()) {
        return;
      }

      const draft = this.createDraft(activity);
      const saveTimeoutId = setTimeout(() => {
        this.workoutDraftService.saveDraft(draft).catch(() => {
          this.saveError.set('Cannot save local workout draft.');
        });
      }, 400);

      onCleanup(() => {
        clearTimeout(saveTimeoutId);
      });
    });
  }

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
    this.saveError.set(null);
    this.autoSaveSuspended.set(false);

    this.strengthHttpService.getActiveActivity$().subscribe({
      next: async (activity) => {
        let restoredActivity = activity;

        try {
          const draft = await this.workoutDraftService.getDraft();

          if (draft?.activityId === activity.id) {
            restoredActivity = draft.activity;
            this.draftStartTime = draft.startTime;
          } else {
            this.draftStartTime = Date.now();
          }
        } catch {
          this.saveError.set('Cannot load local workout draft.');
          this.draftStartTime = Date.now();
        }

        this.activity.set(restoredActivity);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Cannot load strength activity.');
        this.loading.set(false);
      },
    });
  }

  updateExerciseSets(exerciseId: string, sets: StrengthSet[]): void {
    this.activity.update((activity) => {
      if (activity === null) {
        return activity;
      }

      return {
        ...activity,
        items: activity.items.map((item) =>
          item.id === exerciseId
            ? { ...item, sets: sets.map((set) => ({ ...set })) }
            : item,
        ),
      };
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

  completeWorkout(): Observable<void> {
    const activity = this.activity();

    if (activity === null) {
      return from(this.workoutDraftService.clearDraft());
    }

    this.autoSaveSuspended.set(true);
    this.savingExerciseId.set('active_workout');
    this.saveError.set(null);

    const saveRequests = activity.items.map((item) =>
      this.strengthHttpService.saveExerciseSets$(item.id, item.sets).pipe(
        take(1),
        tap((savedSets) => {
          this.applySavedExerciseSets(item.id, savedSets);
        }),
      ),
    );

    if (saveRequests.length === 0) {
      return from(this.workoutDraftService.clearDraft()).pipe(
        finalize(() => {
          this.savingExerciseId.set(null);
        }),
      );
    }

    return forkJoin(saveRequests).pipe(
      switchMap(() => from(this.workoutDraftService.clearDraft())),
      map(() => undefined),
      finalize(() => {
        this.savingExerciseId.set(null);
      }),
      catchError((error) => {
        this.autoSaveSuspended.set(false);
        this.saveError.set('Cannot complete strength workout.');
        return throwError(() => error);
      }),
    );
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

  private createDraft(activity: StrengthActivity): StrengthWorkoutDraft {
    const now = Date.now();

    return {
      id: ACTIVE_STRENGTH_WORKOUT_DRAFT_ID,
      activityId: activity.id,
      startTime: this.draftStartTime,
      updatedAt: now,
      activity: this.cloneActivity(activity),
    };
  }

  private cloneActivity(activity: StrengthActivity): StrengthActivity {
    return {
      ...activity,
      items: activity.items.map((item) => ({
        ...item,
        sets: item.sets.map((set) => ({ ...set })),
      })),
    };
  }
}
