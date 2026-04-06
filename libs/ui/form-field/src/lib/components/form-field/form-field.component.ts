import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  HostListener,
  InjectionToken,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, filter, map, switchMap } from 'rxjs';
import { LabelComponent, RippleDirective, ValueAccessorBase } from 'ui/common';

export interface FormField {
  inputId: string;
}

export const FORM_FIELD_TOKEN = new InjectionToken<FormField>(
  'Form field token',
);

export interface FormFieldContent<TValue> extends ValueAccessorBase<TValue> {
  focus: () => void;
}

export const FORM_FIELD_CONTENT_TOKEN = new InjectionToken<
  FormFieldContent<unknown>
>('Form field content token');

// TODO (Łukasz) Maybe do service/separated class for counter
let uniqueIdCounter = 0;
let uniqueInputIdCounter = 0;

@Component({
  selector: 'ui-form-field',
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [RippleDirective],
  host: {
    class: 'ui-form-field',
    tabindex: '0',
    '[id]': 'id()',
    '[class.valid]': 'isErrorActive()',
  },
  providers: [{ provide: FORM_FIELD_TOKEN, useExisting: FormFieldComponent }],
})
export class FormFieldComponent implements FormField {
  private readonly _labelChild = contentChild(LabelComponent);
  private readonly _inputChild = contentChild(FORM_FIELD_CONTENT_TOKEN);

  readonly id = input(`ui-form-field-${uniqueIdCounter++}`);

  readonly inputId = `ui-input-${uniqueInputIdCounter++}`;

  @HostListener('keydown.enter')
  @HostListener('keydown.space')
  onKeydown(): void {
    this._inputChild()?.focus();
  }

  protected readonly isErrorActive = toSignal(
    toObservable(this._inputChild).pipe(
      filter(
        (inputChild): inputChild is FormFieldContent<unknown> =>
          inputChild !== undefined,
      ),

      switchMap((inputChild) => inputChild.control?.statusChanges ?? EMPTY),
      map((status) => status === 'INVALID'),
    ),
  );

  protected readonly isLabelChildActive = computed(
    () => this._labelChild() !== undefined,
  );
}
