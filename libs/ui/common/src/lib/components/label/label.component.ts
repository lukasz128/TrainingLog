import { Component, InjectionToken } from '@angular/core';

// TODO Łukasz F - lightweight token to do - for all tokens in UI (its lib)
export const LABEL_TOKEN = new InjectionToken<LabelComponent>('Label Token');

@Component({
  selector: 'ui-label',
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
  providers: [{ provide: LABEL_TOKEN, useExisting: LabelComponent }],
  host: {
    class: 'text-truncate',
  },
})
export class LabelComponent {}
