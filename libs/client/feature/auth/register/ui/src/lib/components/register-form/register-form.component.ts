import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FilledButtonComponent, TextButtonComponent } from 'ui/button';
import { LabelComponent } from 'ui/common';
import { RegisterCredentials } from 'ui/data-access';
import {
  FormErrorComponent,
  FormErrorTranslationPipe,
  FormFieldComponent,
} from 'ui/form-field';
import { InputDirective } from 'ui/input';

const formGroupBuilder = () =>
  new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    repeatPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

@Component({
  selector: 'auth-register-form',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    InputDirective,
    LabelComponent,
    FilledButtonComponent,
    TextButtonComponent,
    FormErrorComponent,
    FormErrorTranslationPipe,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  readonly triggerSubmit = output<RegisterCredentials>();

  protected readonly form = formGroupBuilder();

  protected submitForm(): void {
    if (this.form.status === 'INVALID') {
      this.form.markAllAsTouched();
      return;
    }

    this.triggerSubmit.emit(this.form.getRawValue());
  }
}
