import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StrengthActivityFacadeService } from 'strength/data-access';
import { IconButtonComponent } from 'ui/button';
import { RippleDirective } from 'ui/common';
import { IconDirective } from 'ui/icon';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'strength-activity-list',
  imports: [
    IconButtonComponent,
    IconDirective,
    RippleDirective,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListComponent {
  private readonly location = inject(Location);
  private readonly strengthActivityFacade = inject(
    StrengthActivityFacadeService,
  );
  private readonly router = inject(Router);

  protected readonly activitiesState =
    this.strengthActivityFacade.activitiesState;

  protected goBack(): void {
    this.location.back();
  }

  protected addTemplate(): void {
    this.router.navigate(['/instance/training/strength/template']);
  }
}
