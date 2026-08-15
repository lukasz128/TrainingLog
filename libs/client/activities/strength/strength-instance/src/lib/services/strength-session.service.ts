import { inject, Injectable, signal } from '@angular/core';
import { ActiveActivity, ActivityManagerService } from 'activity';
import { sessionTimerFactory } from '../utils/session-timer.util';

export type SessionState = 'ACTIVE' | 'STOPPED' | 'IDLE';

@Injectable({ providedIn: 'root' })
export class StrengthSessionService {
  private readonly activityManager = inject(ActivityManagerService);

  private readonly sessionState = signal<SessionState>('IDLE');
  private readonly timerState = sessionTimerFactory();

  readonly state = this.sessionState.asReadonly();
  readonly timer = this.timerState.timer;

  start(activity: ActiveActivity): void {
    this.sessionState.set('ACTIVE');
    this.timerState.start();
    this.activityManager.setActiveActivity(activity);
  }

  togglePause(): void {
    this.timerState.togglePause();
  }

  stop(): void {
    this.sessionState.set('STOPPED');
    this.timerState.stop();
  }

  finish(): void {
    this.sessionState.set('IDLE');
    this.timerState.kill();
    this.activityManager.finishActiveActivity();
  }
}
