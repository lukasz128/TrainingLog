import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconButtonComponent } from 'ui/button';
import { RippleDirective } from 'ui/common';
import { IconDirective } from 'ui/icon';
import { ExerciseLinkingComponent } from '../exercise-linking/exercise-linking.component';
import {
  ExerciseItemComponent,
  ExerciseItemData,
} from '../exercise-item/exercise-item.component';

interface Activity {
  name: string;
  items: ExerciseItemData[];
}

@Component({
  selector: 'strength-instance',
  imports: [
    IconButtonComponent,
    IconDirective,
    ExerciseItemComponent,
    ExerciseLinkingComponent,
    RippleDirective,
  ],
  templateUrl: './instance.component.html',
  styleUrl: './instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstanceComponent {
  private readonly location = inject(Location);

  protected readonly activity: Activity = {
    name: 'FBW A (dominacja klata)',
    items: [
      {
        title: 'Wyciskanie sztangi na ławce płaskiej',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
      {
        title: 'Podciąganie podchwytem',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
      {
        title: 'Hack Squat',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
      {
        title: 'Wyciskanie hantli siedząc w oparciu o ławkę',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
      {
        title: 'Unoszenie biodra w lezeniu tyłem ze stopami na piłce',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
      {
        title: 'Pompki z pogłębioną fazą rozciągania',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
      {
        title: 'Unoszenie biodra w lezeniu tyłem ze stopami na piłce',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
      {
        title: 'Pompki z pogłębioną fazą rozciągania',
        phase: 'progress',
        details: '3×4-6 | 1/0/1/0',
      },
    ],
  };

  protected goBack(): void {
    this.location.back();
  }
}
