import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-activities',
  imports: [RouterOutlet],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesComponent {}
