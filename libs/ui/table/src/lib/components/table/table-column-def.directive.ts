import { contentChild, Directive, input } from '@angular/core';
import { UiCellDefDirective } from './table-cell-def.directive';
import { UiHeaderCellDefDirective } from './table-header-cell-def.directive';

@Directive({
  selector: '[uiColumnDef]',
  standalone: true,
})
export class UiColumnDefDirective<T = unknown> {
  readonly name = input.required<string>({ alias: 'uiColumnDef' });
  readonly headerCellDef = contentChild(UiHeaderCellDefDirective);
  readonly cellDef = contentChild<UiCellDefDirective<T>>(UiCellDefDirective);
}
