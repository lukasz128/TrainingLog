import { Component, input } from '@angular/core';
import { RippleDirective } from 'ui/common';

let uniqueIdCounter = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[ui-text-btn], a[ui-text-btn]',
  imports: [],
  templateUrl: './text-button.component.html',
  styleUrl: './text-button.component.scss',
  hostDirectives: [{ directive: RippleDirective }],
  host: {
    '[id]': 'id()',
    '[class.disabled]': 'disabled()',
    class: 'reset-btn',
  },
})
export class TextButtonComponent {
  readonly id = input(`ui-filled-button-${uniqueIdCounter++}`);
  readonly disabled = input<boolean>(false);
}
