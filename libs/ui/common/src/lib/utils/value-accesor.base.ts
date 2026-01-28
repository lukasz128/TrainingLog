import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NgControl,
} from '@angular/forms';

export abstract class ValueAccessorBase<T> implements ControlValueAccessor {
  isDisabled = false;
  private innerValue: T | null = null;

  protected constructor(protected ngControl: NgControl | null) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    } else {
      console.error('ngControl not found');
      // throw new Error(`ngControl not found`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  emitValueChangeEvent: (value: T | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  emitTouchEvent: () => void = () => {};

  writeValue(value: T | null): void {
    this.innerValue = value;
    this.handleValueChangeFromOutside();
  }

  registerOnChange(onChangeFn: (_: T | null) => void): void {
    this.emitValueChangeEvent = onChangeFn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(onTouch: any): void {
    this.emitTouchEvent = onTouch;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  get value(): T | null {
    return this.innerValue;
  }

  set value(value: T | null) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.emitValueChangeEvent(value);
      this.emitTouchEvent();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected handleValueChangeFromOutside(): void {}

  get parentForm(): AbstractControl | null {
    return this.ngControl?.control?.root ?? null;
  }

  get control(): FormControl<T> | null {
    return this.ngControl?.control as FormControl<T>;
  }

  get isInvalid(): boolean {
    return !!this.ngControl?.touched && !!this.ngControl?.invalid;
  }

  get isValid(): boolean {
    return !!this.ngControl?.dirty && !!this.ngControl?.valid;
  }
}
