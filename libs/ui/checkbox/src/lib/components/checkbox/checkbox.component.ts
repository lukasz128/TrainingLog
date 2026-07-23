import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ValueAccessorBase } from 'ui/common';

let uniqueIdCounter = 0;

@Component({
  selector: 'ui-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'id()',
    '[attr.role]': '"checkbox"',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'isDisabled',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.tabindex]': 'isDisabled ? -1 : 0',
    '[class.ui-checkbox--checked]': 'checked',
    '[class.ui-checkbox--disabled]': 'isDisabled',
  },
})
export class CheckboxComponent extends ValueAccessorBase<boolean> {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  readonly id = input(`ui-checkbox-${uniqueIdCounter++}`);
  readonly ariaLabel = input<string | null>(null);

  get checked(): boolean {
    return this.value === true;
  }

  constructor() {
    super(inject(NgControl, { optional: true, self: true }));
  }

  @HostListener('click')
  toggle(): void {
    if (this.isDisabled) return;

    this.value = !this.checked;
    this._changeDetectorRef.markForCheck();
  }

  @HostListener('keydown.space', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  handleKeyboardToggle(event: Event): void {
    event.preventDefault();
    this.toggle();
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    this._changeDetectorRef.markForCheck();
  }

  protected override handleValueChangeFromOutside(): void {
    this._changeDetectorRef.markForCheck();
  }
}
