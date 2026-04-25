import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { IconDirective } from 'ui/icon';

export interface ExerciseItemData {
  title: string;
  phase: string;
  details: string;
}

@Component({
  selector: 'strength-exercise-item',
  imports: [IconDirective],
  templateUrl: './exercise-item.component.html',
  styleUrl: './exercise-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseItemComponent {
  readonly data = input.required<ExerciseItemData>();
  readonly progress = input<string | number>('0/1');
  readonly progressPercent = computed(() =>
    this._parseProgress(this.progress()),
  );

  private _parseProgress(value: string | number): number {
    if (typeof value === 'number') {
      if (Number.isNaN(value)) return 0;
      if (value <= 1) return this._clamp(value * 100);
      return this._clamp(value);
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) return 0;

    if (trimmedValue.endsWith('%')) {
      return this._clamp(Number.parseFloat(trimmedValue));
    }

    const [doneRaw, totalRaw] = trimmedValue.split('/');
    const done = Number.parseFloat(doneRaw ?? '');
    const total = Number.parseFloat(totalRaw ?? '');
    if (!Number.isFinite(done) || !Number.isFinite(total) || total <= 0) {
      return 0;
    }

    return this._clamp((done / total) * 100);
  }

  private _clamp(value: number): number {
    return Math.min(Math.max(value, 0), 100);
  }
}
