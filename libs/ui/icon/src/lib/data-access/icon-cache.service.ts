import { inject, Injectable } from '@angular/core';
import { AvailableIcon, ICON_STORE } from './icon-store';

@Injectable({
  providedIn: 'root',
})
export class IconCacheService {
  private readonly _iconStore = inject(ICON_STORE);

  getIconBy(name: AvailableIcon | undefined) {
    if (name === undefined) return undefined;
    const findIconName = this._iconStore[name];

    return findIconName ?? undefined;
  }
}
