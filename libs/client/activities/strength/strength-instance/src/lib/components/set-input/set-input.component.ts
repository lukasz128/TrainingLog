import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ValueAccessorBase } from 'ui/common';

let uniqueIdCounter = 0;

@Component({
  selector: 'strength-set-input',
  imports: [],
  templateUrl: './set-input.component.html',
  styleUrl: './set-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.strength-set-input--disabled]': 'isDisabled',
  },
})
export class SetInputComponent extends ValueAccessorBase<string> {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _input =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');

  readonly id = input(`strength-set-input-${uniqueIdCounter++}`);
  readonly suffix = input('');
  readonly ariaLabel = input<string | null>(null);
  readonly inputMode = input('decimal');

  @HostListener('click') onClick() {
    this.focus();
  }

  get inputValue(): string {
    return this.value ?? '';
  }

  constructor() {
    super(inject(NgControl, { optional: true, self: true }));
  }

  updateValue(value: string): void {
    this.value = value;
    this._changeDetectorRef.markForCheck();
  }

  focus(): void {
    this._input()?.nativeElement.focus();
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    this._changeDetectorRef.markForCheck();
  }

  protected override handleValueChangeFromOutside(): void {
    this._changeDetectorRef.markForCheck();
  }
}
