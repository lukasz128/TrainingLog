import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionSheetService, ShowActionParams } from 'common';
import { FilledButtonComponent, IconButtonComponent } from 'ui/button';
import { CheckboxComponent } from 'ui/checkbox';
import { IconDirective } from 'ui/icon';
import { SetInputComponent } from '../set-input/set-input.component';

export interface ExerciseSet {
  done: boolean;
  weight: string;
  reps: string;
}

@Component({
  selector: 'strength-exercise-sheet',
  imports: [
    FormsModule,
    CheckboxComponent,
    SetInputComponent,
    FilledButtonComponent,
    IconButtonComponent,
    IconDirective,
  ],
  templateUrl: './exercise-sheet.component.html',
  styleUrl: './exercise-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseSheetComponent {
  private readonly actionSheet = inject(ActionSheetService);

  protected readonly previousTrainings = signal<
    { name: string; value: { value: string }[] }[]
  >([
    { name: '26.08', value: [{ value: '50kg' }] },
    { name: '20.08', value: [{ value: '45kg' }] },
    { name: '06.08', value: [{ value: '40kg' }] },
  ]);

  protected readonly selectedPreviousTraining = signal<{
    name: string;
    value: { value: string }[];
  } | null>(this.previousTrainings()[0] || null);

  readonly sets = model.required<ExerciseSet[]>();
  readonly closed = output<void>();
  readonly changed = output<void>();
  readonly remove = output<void>();

  addSeries(): void {
    this.sets().push({ done: false, weight: '', reps: '' });
    this.changed.emit();
  }

  protected showActions(set: ExerciseSet) {
    const actionParams: ShowActionParams = {
      options: [
        {
          title: 'Remove',
          type: 'delete',
          action: () => this.removeSet(set),
        },
      ],
    };

    this.actionSheet.showActions(actionParams).subscribe();
  }

  private removeSet(set: ExerciseSet): void {
    const setToRemove = this.sets().indexOf(set);

    this.sets().splice(setToRemove, 1);
    const updatedSet = [...this.sets()];

    this.sets.set(updatedSet);
  }

  protected showPreviousTrainings(): void {
    const actionParams: ShowActionParams = {
      title: 'Pick previous training to see them results',
      options: this.previousTrainings().map((item) => ({
        title: item.name,
        action: () => {
          this.selectedPreviousTraining.set(item);
        },
      })),
    };

    this.actionSheet.showActions(actionParams).subscribe();
  }
}
