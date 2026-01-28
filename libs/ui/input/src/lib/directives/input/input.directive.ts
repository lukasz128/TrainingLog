import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  InjectionToken,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ValueAccessorBase } from 'ui/common';
import {
  FORM_FIELD_CONTENT_TOKEN,
  FORM_FIELD_TOKEN,
  FormFieldContent,
} from 'ui/form-field';

type InputValue = string | undefined;

export const INPUT_TOKEN = new InjectionToken<InputDirective>(
  'Input directive',
);

let uniqueIdCounter = 0;

@Directive({
  selector: '[uiInput]',
  providers: [
    { provide: INPUT_TOKEN, useExisting: InputDirective },
    { provide: FORM_FIELD_CONTENT_TOKEN, useExisting: InputDirective },
  ],
  host: {
    '[id]': 'id',
  },
})
export class InputDirective
  extends ValueAccessorBase<InputValue>
  implements FormFieldContent<InputValue>
{
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _formField = inject(FORM_FIELD_TOKEN, { optional: true });

  protected readonly id =
    this._formField?.inputId ?? `ui-input-${uniqueIdCounter++}`;

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

  constructor() {
    super(inject(NgControl, { optional: true, self: true }));
  }

  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
