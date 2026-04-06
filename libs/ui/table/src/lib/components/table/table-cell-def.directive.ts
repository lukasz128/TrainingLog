import { Directive, inject, TemplateRef } from '@angular/core';

export interface UiCellContext<T> {
  $implicit: T;
  row: T;
  index: number;
  column: string;
}

@Directive({
  selector: '[uiCellDef]',
  standalone: true,
})
export class UiCellDefDirective<T = unknown> {
  readonly template = inject(TemplateRef<UiCellContext<T>>);

  static ngTemplateContextGuard<T>(
    _dir: UiCellDefDirective<T>,
    ctx: unknown,
  ): ctx is any {
    return true;
  }
}
