import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  TrackByFunction,
  computed,
  contentChild,
  contentChildren,
  effect,
  input,
  signal,
} from '@angular/core';
import { UiColumnDefDirective } from './table-column-def.directive';
import { UiHeaderRowDefDirective } from './table-header-row-def.directive';
import { UiRowDefDirective } from './table-row-def.directive';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableComponent<T = unknown> {
  readonly data = input<T[]>([]);
  readonly columns = input<string[] | null>(null);
  readonly columnSizes = input<string[] | null>(null);
  readonly showHeader = input(true);
  readonly trackBy = input<TrackByFunction<T>>((index) => index);

  private readonly columnDefs = contentChildren(UiColumnDefDirective) as Signal<
    UiColumnDefDirective<T>[]
  >;
  private readonly headerRowDef = contentChild(UiHeaderRowDefDirective);
  protected readonly rowDef = contentChild.required(
    UiRowDefDirective,
  ) as Signal<UiRowDefDirective<T> | undefined>;

  readonly resolvedColumns = signal<UiColumnDefDirective<T>[]>([]);
  readonly rowDefColumns = computed(() => {
    const rowDef = this.rowDef();
    const headerDef = this.headerRowDef();

    return rowDef?.resolvedColumns ?? headerDef?.columns() ?? null;
  });
  readonly effectiveColumns = computed(
    () => this.columns() ?? this.rowDefColumns(),
  );

  readonly gridTemplateColumns = computed(() => {
    const resolved = this.resolvedColumns();
    const sizes = this.columnSizes();

    if (sizes && sizes.length === resolved.length) {
      return sizes.join(' ');
    }

    if (resolved.length === 0) return 'minmax(0, 1fr)';

    return `repeat(${resolved.length}, minmax(0, 1fr))`;
  });

  protected readonly columnsSync = effect(() => {
    this.columnDefs();
    this.effectiveColumns();
    this.updateColumns();
  });

  private updateColumns(): void {
    const map = new Map<string, UiColumnDefDirective<T>>();
    this.columnDefs().forEach((def) => map.set(def.name(), def));

    const columns = this.effectiveColumns();
    const names = columns && columns.length ? columns : Array.from(map.keys());

    this.resolvedColumns.set(
      names
        .map((name) => map.get(name))
        .filter((def): def is UiColumnDefDirective<T> => def !== undefined),
    );
  }
}
