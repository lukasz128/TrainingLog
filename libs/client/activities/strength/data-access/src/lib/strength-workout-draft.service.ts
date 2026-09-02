import { inject, Injectable } from '@angular/core';
import { StrengthDraftDatabaseService } from './strength-draft-database.service';
import { StrengthWorkoutDraft } from './strength.types';

export const ACTIVE_STRENGTH_WORKOUT_DRAFT_ID = 'active_strength_workout';

@Injectable({ providedIn: 'root' })
export class StrengthWorkoutDraftService {
  private readonly database = inject(StrengthDraftDatabaseService);

  saveDraft(draft: StrengthWorkoutDraft): Promise<void> {
    return this.database.workoutDrafts.put(draft).then(() => undefined);
  }

  getDraft(): Promise<StrengthWorkoutDraft | undefined> {
    return this.database.workoutDrafts.get(ACTIVE_STRENGTH_WORKOUT_DRAFT_ID);
  }

  clearDraft(): Promise<void> {
    return this.database.workoutDrafts.delete(ACTIVE_STRENGTH_WORKOUT_DRAFT_ID);
  }
}
