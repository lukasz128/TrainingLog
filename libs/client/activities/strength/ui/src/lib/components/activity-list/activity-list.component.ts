import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StrengthActivityFacadeService } from 'strength/data-access';
import { IconButtonComponent } from 'ui/button';
import { RippleDirective } from 'ui/common';
import { IconDirective } from 'ui/icon';

@Component({
  selector: 'strength-activity-list',
  imports: [IconButtonComponent, IconDirective, RippleDirective, RouterLink],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListComponent {
  private readonly location = inject(Location);
  private readonly strengthActivityFacade = inject(
    StrengthActivityFacadeService,
  );

  protected readonly activitiesState =
    this.strengthActivityFacade.activitiesState;

  protected goBack(): void {
    this.location.back();
  }
}
