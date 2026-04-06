import { Directive, inject, input, TemplateRef } from '@angular/core';

export interface UiHeaderRowContext {
  columns: string[];
}

@Directive({
  selector: '[uiHeaderRowDef]',
  standalone: true,
})
export class UiHeaderRowDefDirective {
  readonly columns = input<string[] | null>(null, { alias: 'uiHeaderRowDef' });
  readonly template = inject(TemplateRef<UiHeaderRowContext>);

  static ngTemplateContextGuard(
    _dir: UiHeaderRowDefDirective,
    ctx: unknown,
  ): ctx is UiHeaderRowContext {
    return true;
  }
}
