import { Directive, inject, input, TemplateRef } from '@angular/core';

export interface UiRowContext<T> {
  $implicit: T;
  row: T;
  index: number;
  columns: string[];
}

@Directive({
  selector: '[uiRowDef]',
  standalone: true,
})
export class UiRowDefDirective<T = unknown> {
  readonly columns = input<unknown>(null, { alias: 'uiRowDef' });
  readonly columnsAlias = input<string[] | null>(null, {
    alias: 'uiRowDefColumns',
  });
  readonly template = inject(TemplateRef<UiRowContext<T>>);

  get resolvedColumns(): string[] | null {
    const alias = this.columnsAlias();
    if (alias) return alias;

    const primary = this.columns();
    return Array.isArray(primary) ? primary : null;
  }

  static ngTemplateContextGuard<T>(
    _dir: UiRowDefDirective<T>,
    ctx: unknown,
  ): ctx is UiRowContext<T> {
    return true;
  }
}
