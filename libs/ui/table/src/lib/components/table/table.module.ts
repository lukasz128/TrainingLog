import { UiCellDefDirective } from './table-cell-def.directive';
import { UiColumnDefDirective } from './table-column-def.directive';
import { UiHeaderCellDefDirective } from './table-header-cell-def.directive';
import { UiHeaderRowDefDirective } from './table-header-row-def.directive';
import { UiRowDefDirective } from './table-row-def.directive';
import { UiTableComponent } from './table.component';

export const UiTable = [
  UiTableComponent,
  UiColumnDefDirective,
  UiHeaderCellDefDirective,
  UiCellDefDirective,
  UiHeaderRowDefDirective,
  UiRowDefDirective,
];
