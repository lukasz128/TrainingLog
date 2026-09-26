import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  defer,
  EMPTY,
  filter,
  map,
  mergeMap,
  of,
  ReplaySubject,
  take,
} from 'rxjs';
import { AvailableIcon, ICON_STORE } from './icon-store';

export type IconCache = {
  svg: string;
  path: string;
};

@Injectable({
  providedIn: 'root',
})
export class IconCacheService {
  private readonly _cache = new Map<AvailableIcon, IconCache>();
  private readonly _iconStore = inject(ICON_STORE);
  private readonly _http = inject(HttpClient);

  private readonly _availableIcons = new ReplaySubject<
    Map<AvailableIcon, IconCache>
  >();
  private readonly _addIconOnQueue = new ReplaySubject<AvailableIcon>();
  private readonly _downloadQueue = defer(() => {
    const innerQueue: { name: AvailableIcon }[] = [];

    return this._addIconOnQueue.pipe(
      mergeMap((name) => {
        const store = this._iconStore[name];

        const isAlreadyInQueue = innerQueue.find((item) => item.name === name);
        if (isAlreadyInQueue) return EMPTY;

        innerQueue.push({ name });

        // Note need to think about fail - probably need mock icon
        return this._http.get(store.path, { responseType: 'text' }).pipe(
          map((svgElement) => {
            const iconCache: IconCache = {
              svg: svgElement,
              path: store.path,
            };
            this._cache.set(name, iconCache);
            this._availableIcons.next(this._cache);

            return iconCache;
          }),
          take(1),
        );
      }, 3),
      takeUntilDestroyed(),
    );
  }).subscribe();

  getIconBy(name: AvailableIcon) {
    if (this._cache.has(name)) {
      return of(this._cache.get(name)!);
    }

    this._addIconOnQueue.next(name);
    return this._availableIcons.pipe(
      filter((store) => store.has(name)),
      map((store) => store.get(name)!),
      take(1),
    );
  }
}
