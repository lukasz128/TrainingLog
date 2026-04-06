import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RippleDirective } from 'ui/common';
import { IconDirective } from 'ui/icon';
import { UiTable } from 'ui/table';

export interface ActivityRow {
  date: string;
  time: string;
  title: string;
}

@Component({
  selector: 'dashboard-activites-table',
  imports: [UiTable, IconDirective, RippleDirective],
  templateUrl: './activites-table.component.html',
  styleUrl: './activites-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitesTableComponent {
  protected readonly columns = ['date', 'time', 'title', 'action'];
  protected readonly columnSizes = ['140px', '90px', '1fr', '36px'];

  readonly rows = input.required<ActivityRow[]>();

  protected onClick(dd: any): void {}
}
