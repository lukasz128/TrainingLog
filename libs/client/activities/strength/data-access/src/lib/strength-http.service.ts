import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  StrengthActivity,
  StrengthExerciseDictionaryItem,
  StrengthSet,
} from './strength.types';

export interface StrengthHttp {
  getActivities$: () => Observable<StrengthActivity[]>;
  getActiveActivity$: () => Observable<StrengthActivity>;
  getExerciseDictionary$: () => Observable<StrengthExerciseDictionaryItem[]>;
  saveExerciseSets$: (...args: any[]) => Observable<StrengthSet[]>;
  saveExerciseSetsOnUnload: (...args: any[]) => boolean;
}

@Injectable()
export class StrengthHttpService implements StrengthHttp {
  private readonly http = inject(HttpClient);

  getActivities$(): Observable<StrengthActivity[]> {
    return this.http.get<StrengthActivity[]>('/api/activities/strength');
  }

  getActiveActivity$(): Observable<StrengthActivity> {
    return this.http.get<StrengthActivity>('/api/activities/strength/active');
  }

  getExerciseDictionary$(): Observable<StrengthExerciseDictionaryItem[]> {
    return this.http.get<StrengthExerciseDictionaryItem[]>(
      '/api/activities/strength/exercises',
    );
  }

  saveExerciseSets$(
    exerciseId: string,
    sets: StrengthSet[],
  ): Observable<StrengthSet[]> {
    return this.http.put<StrengthSet[]>(
      `/api/activities/strength/exercises/${exerciseId}/sets`,
      sets,
    );
  }

  saveExerciseSetsOnUnload(exerciseId: string, sets: StrengthSet[]): boolean {
    if (globalThis.navigator?.sendBeacon === undefined) {
      return false;
    }

    return globalThis.navigator.sendBeacon(
      `/api/activities/strength/exercises/${exerciseId}/sets`,
      new Blob([JSON.stringify(sets)], { type: 'application/json' }),
    );
  }
}
