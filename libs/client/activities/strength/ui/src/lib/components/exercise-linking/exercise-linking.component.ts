import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButtonComponent } from 'ui/button';
import { IconDirective } from 'ui/icon';

@Component({
  selector: 'strength-exercise-linking',
  imports: [IconButtonComponent, IconDirective],
  templateUrl: './exercise-linking.component.html',
  styleUrl: './exercise-linking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseLinkingComponent {}
