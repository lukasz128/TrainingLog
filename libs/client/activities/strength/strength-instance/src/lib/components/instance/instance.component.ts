import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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

  private completeSubscription: Subscription | null = null;

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
    this.selectedExercise = null;
  }

  protected updateExerciseDraft(exercise: StrengthExercise): void {
    this.strengthActivityFacade.updateExerciseSets(exercise.id, exercise.sets);
  }

  protected getProgress(item: StrengthExercise): string {
    return `${item.sets.filter((set) => set.done).length}/${item.sets.length}`;
  }

  protected completeWorkout(): void {
    this.completeSubscription?.unsubscribe();
    this.completeSubscription = this.strengthActivityFacade
      .completeWorkout()
      .subscribe({
        next: () => this.goBack(),
      });
  }

  ngOnDestroy(): void {
    this.completeSubscription?.unsubscribe();
  }
}
