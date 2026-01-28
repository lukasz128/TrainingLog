import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RIPPLE_COLOR, RippleDirective } from 'ui/common';

let uniqueIdCounter = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[ui-filled-btn], a[ui-filled-btn]',
  exportAs: 'uiFilledBtn',
  imports: [],
  templateUrl: './filled-button.component.html',
  styleUrl: './filled-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: RippleDirective }],
  host: {
    '[id]': 'id()',
    '[class.disabled]': 'disabled()',
    class: 'reset-btn',
  },
  providers: [
    {
      provide: RIPPLE_COLOR,
      useValue: 'rgba(0, 0, 0, 0.35)',
    },
  ],
})
export class FilledButtonComponent {
  readonly id = input(`ui-filled-button-${uniqueIdCounter++}`);
  readonly disabled = input<boolean>(false);
}
