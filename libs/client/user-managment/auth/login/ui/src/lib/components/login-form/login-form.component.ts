import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FilledButtonComponent, TextButtonComponent } from 'ui/button';
import { LabelComponent } from 'ui/common';
import { LoginCredentials } from 'ui/data-access';
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
  });

@Component({
  selector: 'auth-login-form',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    InputDirective,
    LabelComponent,
    FilledButtonComponent,
    TextButtonComponent,
    FormErrorComponent,
    FormErrorTranslationPipe,
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  readonly triggerSubmit = output<LoginCredentials>();

  protected readonly form = formGroupBuilder();

  protected submitForm(): void {
    if (this.form.status === 'INVALID') {
      this.form.markAllAsTouched();
      return;
    }

    this.triggerSubmit.emit(this.form.getRawValue());
  }
}
