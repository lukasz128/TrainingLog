import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'ui-information-banner',
  imports: [BannerComponent],
  templateUrl: './information-banner.component.html',
  styleUrl: './information-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status' },
})
export class InformationBannerComponent {
  readonly title = input('Information');
}
