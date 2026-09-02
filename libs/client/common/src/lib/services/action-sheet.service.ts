import { Injectable } from '@angular/core';
import {
  ActionSheet,
  ActionSheetButton,
  ActionSheetButtonStyle,
} from '@capacitor/action-sheet';
import { from, Observable, take } from 'rxjs';

export type ShowActionOptionType = 'normal' | 'delete';

export type ShowActionParams = {
  title?: string;
  message?: string;
  options: {
    title: string;
    type?: ShowActionOptionType;
    action: () => void;
  }[];
};

export interface ActionSheet {
  showActions(params: ShowActionParams): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class ActionSheetService implements ActionSheet {
  showActions(params: ShowActionParams) {
    return from(this._showAction(params)).pipe(take(1));
  }

  private _showAction = async (params: ShowActionParams) => {
    const computedOptions: ActionSheetButton[] = params.options.map(
      ({ title, type }) => {
        const option: ActionSheetButton = {
          title,
          style:
            type === 'delete'
              ? ActionSheetButtonStyle.Destructive
              : ActionSheetButtonStyle.Default,
        };

        return option;
      },
    );

    const result = await ActionSheet.showActions({
      cancelable: true,
      title: params.title,
      message: params.message,
      options: computedOptions,
    });

    if (result.index !== -1) params.options[result.index].action();
  };
}
