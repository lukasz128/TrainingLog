import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ActiveActivity } from 'activity';
import { StrengthActivityFacadeService } from 'strength/data-access';
import { StrengthSessionService } from '../../services/strength-session.service';

@Component({
  selector: 'strength-training-panel',
  imports: [],
  templateUrl: './training-panel.component.html',
  styleUrl: './training-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingPanelComponent implements OnInit {
  private readonly sessionService = inject(StrengthSessionService);
  private readonly strengthActivityFacade = inject(
    StrengthActivityFacadeService,
  );
  private readonly isPaused = signal(false);

  protected readonly formattedTime = computed(() =>
    this.formatDuration(this.sessionService.timer()),
  );
  protected readonly status = computed(() =>
    this.isPaused() ? 'Paused' : 'Running',
  );

  readonly stopped = output<void>();

  ngOnInit(): void {
    const a = this.strengthActivityFacade.activity();
    if (a === null) return;

    const activity: ActiveActivity = {
      name: a.name,
      routerLink: `instance/training/strength/${a.id}`,
    };
    this.sessionService.start(activity);
  }

  protected togglePause(): void {
    this.isPaused.update((paused) => !paused);
    this.sessionService.togglePause();
  }

  protected stopTraining(): void {
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
