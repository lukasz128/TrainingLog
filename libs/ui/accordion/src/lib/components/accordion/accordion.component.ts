import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { IconButtonComponent } from 'ui/button';
import { IconDirective } from 'ui/icon';

let uniqueIdCounter = 0;

@Component({
  selector: 'ui-accordion',
  imports: [IconDirective, IconButtonComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'id()',
    '[class.--disabled]': 'disabled()',
  },
})
export class AccordionComponent {
  readonly id = input<string>(`ui-accordion-${uniqueIdCounter++}`);
  readonly name = input<string>(`ui-accordion-${uniqueIdCounter++}`);

  readonly expanded = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hiddenToggleExpandBtn = input(false, {
    transform: booleanAttribute,
  });
}
