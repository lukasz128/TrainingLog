import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  readonly sets = input.required<ExerciseSet[]>();
  readonly closed = output<void>();
  readonly changed = output<void>();
  readonly remove = output<void>();

  addSeries(): void {
    this.sets().push({ done: false, weight: '', reps: '' });
    this.changed.emit();
  }
}
