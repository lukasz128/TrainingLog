import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  Signal,
} from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { RippleDirective } from 'ui/common';
import { AvailableIcon, IconDirective } from 'ui/icon';

type BaseNavbarItem = {
  id: string;
  label: string;
  icon: AvailableIcon;
  highlight: boolean;
};

type NavbarItemLink = BaseNavbarItem & {
  href: string;
  type: 'link';
};

type NavbarItemAction = BaseNavbarItem & {
  onPoint: () => void;
  isActive: boolean;
  type: 'action';
};

export type NavbarItem = NavbarItemLink | NavbarItemAction;

export const NAVBAR_ITEMS_TOKEN = new InjectionToken<Signal<NavbarItem[]>>(
  'Navbar items token',
);

@Component({
  selector: 'ui-navbar',
  imports: [
    IconDirective,
    RippleDirective,
    RouterLinkActive,
    RouterLinkWithHref,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: {
    role: 'list',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly items = inject(NAVBAR_ITEMS_TOKEN);

  protected onPoint(event: Event, item: NavbarItem): void {
    if (item.type === 'link') return;

    event.preventDefault();
    item.onPoint();
  }
}
