import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChildren,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonItem,
  IonReorder,
  IonReorderGroup,
  ReorderEndCustomEvent,
} from '@ionic/angular';
import { HeaderComponent } from 'strength/ui';
import { AccordionComponent } from 'ui/accordion';
import {
  FilledButtonComponent,
  IconButtonComponent,
  TextButtonComponent,
} from 'ui/button';
import { LabelComponent } from 'ui/common';
import { FormFieldComponent } from 'ui/form-field';
import { IconDirective } from 'ui/icon';
import { InputDirective } from 'ui/input';
import { ExerciseTemplateFormComponent } from '../exercise-template-form/exercise-template-form.component';

type ExerciseType = 'alternative' | 'common';

export type ExerciseTemplateFormGroup = ReturnType<
  (typeof FormBuilder)['buildExerciseForm']
>;

export type AlternativeExercisesGroupFormGroup = ReturnType<
  (typeof FormBuilder)['buildAlternativeExercisesGroupForm']
>;

const FormBuilder = {
  buildMainForm: () =>
    new FormGroup({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl<string>(''),
      exercises: new FormArray([
        FormBuilder.buildExerciseForm(),
        FormBuilder.buildAlternativeExercisesGroupForm('1'),
      ]),
    }),

  buildAlternativeExercisesGroupForm: (groupId: string) =>
    new FormGroup({
      type: new FormControl<'alternative'>(
        { value: 'alternative', disabled: true },
        { nonNullable: true },
      ),
      groupId: new FormControl<string>(groupId, { nonNullable: true }),
      name: new FormControl<string | null>(null),
      exercises: new FormArray<ExerciseTemplateFormGroup>([
        FormBuilder.buildExerciseForm(),
      ]),
    }),

  buildExerciseForm: () =>
    new FormGroup({
      exercise: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      sets: new FormControl<number>(1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      reps: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tempo: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      note: new FormControl(null),
      type: new FormControl<'common'>(
        { value: 'common', disabled: true },
        { nonNullable: true },
      ),
    }),
};

@Component({
  selector: 'strength-instance',
  imports: [
    HeaderComponent,
    IconDirective,
    IconButtonComponent,
    TextButtonComponent,
    ReactiveFormsModule,
    FilledButtonComponent,
    FormFieldComponent,
    InputDirective,
    LabelComponent,
    IonItem,
    IonReorder,
    IonReorderGroup,
    AccordionComponent,
    ExerciseTemplateFormComponent,
  ],
  templateUrl: './instance.component.html',
  styleUrl: './instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstanceComponent {
  private readonly location = inject(Location);

  private readonly details = viewChildren<ElementRef<HTMLElement>>('summary');

  protected readonly form = FormBuilder.buildMainForm();
  protected readonly exerciseAccordionName = 'single_exercise';

  protected save(): void {}

  protected goBack(): void {
    this.location.back();
  }

  protected isAlternative(
    group: AlternativeExercisesGroupFormGroup | ExerciseTemplateFormGroup,
  ): group is AlternativeExercisesGroupFormGroup {
    return group.controls.type.value === 'alternative';
  }

  protected isCommon(
    group: AlternativeExercisesGroupFormGroup | ExerciseTemplateFormGroup,
  ): group is ExerciseTemplateFormGroup {
    return group.controls.type.value === 'common';
  }

  protected addAlternativeExerciseFor(
    group: AlternativeExercisesGroupFormGroup | null = null,
  ): void {
    if (group === null) {
      this.form.controls.exercises.push(
        FormBuilder.buildAlternativeExercisesGroupForm('12'),
      );
      return;
    }

    group.controls.exercises.push(FormBuilder.buildExerciseForm());
  }

  protected addExercise(): void {
    this.form.controls.exercises.push(FormBuilder.buildExerciseForm());
  }

  protected deleteAlternativeExercise(
    group: AlternativeExercisesGroupFormGroup,
    index: number,
  ): void {
    const removeGroupExercise = () => {
      this.form.controls.exercises.removeAt(
        this.form.controls.exercises.controls.indexOf(group) ?? -1,
      );
    };

    if (index === -1) return removeGroupExercise();

    const len = group.controls.exercises.length;
    group.controls.exercises.removeAt(index);

    if (len === 1) removeGroupExercise();
  }

  protected deleteExercise(index: number): void {
    this.form.controls.exercises.removeAt(index);
  }

  protected closeAllExercises(): void {
    this.details().forEach((element) => {
      element.nativeElement.click();
    });
  }

  protected handleReorderEnd(event: ReorderEndCustomEvent) {
    const isReorderInSamePlace = event.detail.from === event.detail.to;
    if (isReorderInSamePlace) {
      event.detail.complete();
      return;
    }

    this.moveItemInArray(event);

    event.detail.complete();
  }

  private moveItemInArray(event: ReorderEndCustomEvent) {
    const formArray = this.form.controls.exercises;
    const control = formArray.at(event.detail.from);

    formArray.removeAt(event.detail.from, { emitEvent: false });
    formArray.insert(event.detail.to, control, { emitEvent: false });
  }
}
