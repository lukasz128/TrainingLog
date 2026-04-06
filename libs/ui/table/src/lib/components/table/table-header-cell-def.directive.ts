import { Directive, TemplateRef } from '@angular/core';

export interface UiHeaderCellContext {
  column: string;
}

@Directive({
  selector: '[uiHeaderCellDef]',
  standalone: true,
})
export class UiHeaderCellDefDirective {
  constructor(readonly template: TemplateRef<UiHeaderCellContext>) {}

  static ngTemplateContextGuard(
    _dir: UiHeaderCellDefDirective,
    ctx: unknown,
  ): ctx is UiHeaderCellContext {
    return true;
  }
}
