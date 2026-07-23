import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { StrengthSet } from 'strength/data-access';
import { IconDirective } from 'ui/icon';

export interface ExerciseItemData {
  title: string;
  phase: string;
  details: string;
  sets: StrengthSet[];
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
  readonly progressPercent = computed(() =>
    this._parseProgress(this.data().sets.length, this.doneSetsLength()),
  );

  protected readonly doneSetsLength = computed(() => {
    const data = this.data();

    return data.sets.filter((item) => item.done).length;
  });

  private _parseProgress(
    allSetsLength: number,
    doneSetsLength: number,
  ): number {
    return (doneSetsLength / allSetsLength) * 100;
  }
}
