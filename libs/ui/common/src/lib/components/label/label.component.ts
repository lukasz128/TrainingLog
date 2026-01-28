import { Component, InjectionToken } from '@angular/core';

export const LABEL_TOKEN = new InjectionToken<LabelComponent>('Label Token');

@Component({
  selector: 'ui-label',
  imports: [],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
  providers: [{ provide: LABEL_TOKEN, useExisting: LabelComponent }],
})
export class LabelComponent {}
