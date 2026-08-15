import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ActivityManagerService } from 'activity';
import {
  MainHeaderVisibilityService,
  MainNavbarVisibilityService,
} from 'common';
import { NAVBAR_ITEMS_TOKEN, NavbarComponent, NavbarItem } from 'ui/navbar';

@Component({
  selector: 'app-instance',
  imports: [RouterOutlet, NgOptimizedImage, NavbarComponent],
  templateUrl: './instance.component.html',
  styleUrl: './instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAVBAR_ITEMS_TOKEN,
      deps: [ActivityManagerService],
      useFactory: (): Signal<NavbarItem[]> => {
        const activityManager = inject(ActivityManagerService);
        const router = inject(Router);

        return computed(() => {
          const activeActivity = activityManager.activeActivity();
          console.log({ activeActivity });

          const items: NavbarItem[] = [
            {
              id: 'Dashboard',
              label: 'Dashboard',
              icon: 'dashboard',
              highlight: false,
              href: '/instance/dashboard',
              type: 'link',
            },
            {
              id: 'Training',
              label: 'Training',
              icon: 'training',
              highlight: true,
              onPoint: () => {
                if (activeActivity === undefined) return;

                router.navigate([activeActivity.routerLink]);
              },
              isActive: activeActivity !== undefined,
              type: 'action',
            },
            {
              id: 'Menu',
              label: 'Menu',
              icon: 'menu',
              highlight: false,
              href: '/instance/menu',
              type: 'link',
            },
          ];

          return items;
        });
      },
    },
  ],
})
export class InstanceComponent {
  private readonly activatedRouter = inject(ActivatedRoute);
  private readonly activityManager = inject(ActivityManagerService);

  protected readonly isNavbarVisible = inject(MainNavbarVisibilityService)
    .stateValue;
  protected readonly title = toSignal(this.activatedRouter.title);
  protected readonly isHeaderVisible = inject(MainHeaderVisibilityService)
    .stateValue;
}
