import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvailableIcon, IconDirective } from 'ui/icon';

@Component({
  selector: 'ui-banner',
  imports: [IconDirective],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
  },
})
export class BannerComponent {
  readonly title = input('Information');
  readonly icon = input<AvailableIcon>('info');
}
