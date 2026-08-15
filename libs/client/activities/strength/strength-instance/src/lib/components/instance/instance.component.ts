import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ACTIVE_STRENGTH_QUERY_PARAMS_KEY } from 'strength';
import {
  StrengthActivityFacadeService,
  StrengthExercise,
} from 'strength/data-access';
import { IconButtonComponent } from 'ui/button';
import { BottomSheetComponent, RippleDirective } from 'ui/common';
import { IconDirective } from 'ui/icon';
import { ExerciseItemComponent } from '../exercise-item/exercise-item.component';
import { ExerciseLinkingComponent } from '../exercise-linking/exercise-linking.component';
import { ExerciseSheetComponent } from '../exercise-sheet/exercise-sheet.component';
import { TrainingPanelComponent } from '../training-panel/training-panel.component';

@Component({
  selector: 'strength-instance',
  imports: [
    IconButtonComponent,
    IconDirective,
    ExerciseItemComponent,
    ExerciseLinkingComponent,
    ExerciseSheetComponent,
    TrainingPanelComponent,
    BottomSheetComponent,
    RippleDirective,
  ],
  templateUrl: './instance.component.html',
  styleUrl: './instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstanceComponent implements OnDestroy {
  private readonly location = inject(Location);
  private readonly strengthActivityFacade = inject(
    StrengthActivityFacadeService,
  );
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private pendingExercise: StrengthExercise | null = null;
  private saveTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private saveSubscription: Subscription | null = null;

  protected readonly activity = this.strengthActivityFacade.activity;
  protected readonly error = this.strengthActivityFacade.error;
  protected readonly loading = this.strengthActivityFacade.loading;
  protected readonly savingExerciseId =
    this.strengthActivityFacade.savingExerciseId;
  protected readonly saveError = this.strengthActivityFacade.saveError;
  protected selectedExercise: StrengthExercise | null = null;

  constructor() {
    this.strengthActivityFacade.loadActiveActivity();
  }

  protected goBack(): void {
    this.router.navigate([], {
      queryParams: { [ACTIVE_STRENGTH_QUERY_PARAMS_KEY]: true },
      skipLocationChange: true,
      relativeTo: this.activatedRoute,
    });
    this.location.back();
  }

  protected openExerciseSheet(item: StrengthExercise): void {
    this.selectedExercise = item;
  }

  protected closeExerciseSheet(): void {
    if (this.selectedExercise !== null) {
      this.saveExerciseNow(this.selectedExercise);
    }

    this.selectedExercise = null;
  }

  protected scheduleExerciseSave(exercise: StrengthExercise): void {
    this.pendingExercise = exercise;

    if (this.saveTimeoutId !== null) {
      clearTimeout(this.saveTimeoutId);
    }

    this.saveTimeoutId = setTimeout(() => {
      this.saveExerciseNow(exercise);
    }, 500);
  }

  protected getProgress(item: StrengthExercise): string {
    return `${item.sets.filter((set) => set.done).length}/${item.sets.length}`;
  }

  @HostListener('window:beforeunload')
  protected saveExerciseBeforeUnload(): void {
    const exercise = this.pendingExercise ?? this.selectedExercise;

    if (exercise === null) {
      return;
    }

    this.strengthActivityFacade.saveExerciseSetsOnUnload(
      exercise.id,
      exercise.sets,
    );
  }

  ngOnDestroy(): void {
    if (this.pendingExercise !== null) {
      this.saveExerciseNow(this.pendingExercise);
    }

    this.saveSubscription?.unsubscribe();
  }

  private saveExerciseNow(exercise: StrengthExercise): void {
    if (this.saveTimeoutId !== null) {
      clearTimeout(this.saveTimeoutId);
      this.saveTimeoutId = null;
    }

    this.pendingExercise = null;
    this.saveSubscription?.unsubscribe();
    this.saveSubscription = this.strengthActivityFacade
      .saveExerciseSets(exercise.id, exercise.sets)
      .subscribe();
  }
}
