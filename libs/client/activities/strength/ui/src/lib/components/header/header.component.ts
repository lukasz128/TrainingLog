import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'strength-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'banner',
  },
})
export class HeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
