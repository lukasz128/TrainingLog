import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from 'ui/common';
import { FormFieldComponent } from 'ui/form-field';
import { InputDirective } from 'ui/input';
import { ExerciseTemplateFormGroup } from '../instance/instance.component';

@Component({
  selector: 'strength-exercise-template-form',
  imports: [
    FormFieldComponent,
    InputDirective,
    LabelComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './exercise-template-form.component.html',
  styleUrl: './exercise-template-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseTemplateFormComponent {
  readonly group = input.required<ExerciseTemplateFormGroup>();
}
