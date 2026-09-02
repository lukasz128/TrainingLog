import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityManagerService } from 'activity';
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
    RouterLink,
    ActivitesTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly activityManager = inject(ActivityManagerService);

  protected readonly activities = shortListActivities;
  protected readonly activeSession = computed(() =>
    this.activityManager.activeActivity(),
  );
}
