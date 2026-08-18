import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActiveActivity } from 'activity';
import { filter, take, tap } from 'rxjs';
import { StrengthActivityFacadeService } from 'strength/data-access';
import { StrengthSessionService } from '../../services/strength-session.service';

@Component({
  selector: 'strength-training-panel',
  imports: [],
  templateUrl: './training-panel.component.html',
  styleUrl: './training-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingPanelComponent {
  private readonly sessionService = inject(StrengthSessionService);
  private readonly strengthActivityFacade = inject(
    StrengthActivityFacadeService,
  );

  private readonly initSession = toObservable(
    this.strengthActivityFacade.activity,
  )
    .pipe(
      filter((activity) => activity !== null),
      take(1),
      tap(({ name, id }) => {
        const activity: ActiveActivity = {
          name: name,
          routerLink: `instance/training/strength/${id}`,
        };
        this.sessionService.start(activity);
      }),
    )
    .subscribe();

  private readonly isPaused = signal(false);

  protected readonly formattedTime = computed(() =>
    this.formatDuration(this.sessionService.timer()),
  );
  protected readonly status = computed(() =>
    this.isPaused() ? 'Paused' : 'Running',
  );

  readonly stopped = output<void>();

  protected togglePause(): void {
    this.isPaused.update((paused) => !paused);
    this.sessionService.togglePause();
  }

  protected finishTraining(): void {
    this.sessionService.finish();
    this.stopped.emit();
  }

  private formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((part) => part.toString().padStart(2, '0'))
      .join(':');
  }
}
