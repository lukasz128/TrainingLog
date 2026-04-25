import { Component, input } from '@angular/core';
import { RippleDirective } from 'ui/common';

let uniqueIdCounter = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[ui-icon-btn], a[ui-icon-btn]',
  imports: [],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  hostDirectives: [{ directive: RippleDirective }],
  host: {
    '[id]': 'id()',
    '[class.disabled]': 'disabled()',
    class: 'reset-btn',
  },
})
export class IconButtonComponent {
  readonly id = input(`ui-icon-button-${uniqueIdCounter++}`);
  readonly disabled = input<boolean>(false);
}
