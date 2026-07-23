import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { StrengthHttp } from '../lib/strength-http.service';
import { StrengthSet } from '../lib/strength.types';
import {
  strengthActivities,
  strengthActivity,
  strengthExerciseDictionaryItems,
} from './strength.mocks';

@Injectable()
export class StrengthHttpMockService implements StrengthHttp {
  getActivities$ = () => of(strengthActivities);
  getActiveActivity$ = () => of(strengthActivity);
  getExerciseDictionary$ = () => of(strengthExerciseDictionaryItems);
  saveExerciseSets$ = (_: string, sets: StrengthSet[]) => of(sets);
  saveExerciseSetsOnUnload = (...args: any[]) => false;
}
