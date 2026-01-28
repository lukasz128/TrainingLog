import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
