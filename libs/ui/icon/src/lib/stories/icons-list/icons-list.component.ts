import { Component, inject } from '@angular/core';
import { ICON_STORE, IconDirective } from '../../public-api';

@Component({
  selector: 'ui-icons-list',
  imports: [IconDirective],
  styleUrls: ['./icons-list.component.scss'],
  template: `
    @for (icon of icons; track icon) {
      <div class="icon-container">
        <i [uiIcon]="$any(icon)"></i>
        <span>{{ icon }}</span>
      </div>
    }
  `,
})
export class IconsListComponent {
  private readonly iconsStore = inject(ICON_STORE);

  protected readonly icons = Object.keys(this.iconsStore);
}
