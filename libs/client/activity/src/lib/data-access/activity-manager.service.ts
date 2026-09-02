import { Injectable, InjectionToken, signal } from '@angular/core';

export interface ActiveActivity {
  name: string;
  routerLink: string;
}

export const ACTIVE_ACTIVITY = new InjectionToken<ActiveActivity | undefined>(
  'Active activity',
);

@Injectable({ providedIn: 'root' })
export class ActivityManagerService {
  private readonly activeActivityState = signal<ActiveActivity | undefined>(
    undefined,
  );

  readonly activeActivity = this.activeActivityState.asReadonly();

  setActiveActivity(activity: ActiveActivity): void {
    if (this.activeActivityState() !== undefined) {
      console.error(
        `Activity is already running -> ${this.activeActivityState()?.name}`,
      );
      return;
    }

    this.activeActivityState.set(activity);
  }

  finishActiveActivity(): void {
    this.activeActivityState.set(undefined);
  }
}
