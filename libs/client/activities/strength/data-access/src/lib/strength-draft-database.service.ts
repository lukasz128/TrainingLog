import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { StrengthWorkoutDraft } from './strength.types';

@Injectable({ providedIn: 'root' })
export class StrengthDraftDatabaseService extends Dexie {
  workoutDrafts!: Table<StrengthWorkoutDraft, string>;

  constructor() {
    super('StrengthWorkoutDB');

    this.version(1).stores({
      workoutDrafts: 'id, updatedAt',
    });
  }
}
