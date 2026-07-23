import { Component, inject } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { TextButtonComponent } from 'ui/button';

@Component({
  selector: 'menu-shell',
  imports: [TextButtonComponent, RouterLinkWithHref],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly router = inject(Router);

  protected readonly menuItems = [
    {
      label: 'Dashboard',
      href: '/instance/dashboard',
      disabled: false,
    },
    {
      label: 'Training',
      href: '/instance/training',
      disabled: false,
    },
    {
      label: 'Schedule',
      href: 'instance/schedule',
      disabled: true,
    },
    {
      label: 'Activities',
      href: 'instance/activities',
      disabled: true,
    },
    {
      label: 'Logout',
      disabled: false,
      onPoint: () => {
        this.router.navigate(['auth/login']);
        console.log('logout');
      },
    },
  ];
}
