import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivitesTableComponent } from 'dashboard/ui';
import { InformationBannerComponent } from 'ui/banner';
import { FilledButtonComponent } from 'ui/button';
import { shortListActivities } from '../../../data-access/src/lib/activities.mocks';

@Component({
  selector: 'dashboard-dashboard',
  imports: [
    NgOptimizedImage,
    InformationBannerComponent,
    FilledButtonComponent,
    ActivitesTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly activities = shortListActivities;
}
