// ---------------------------------------------------------------------------
// Shared validation patterns (reusable by the client)
// ---------------------------------------------------------------------------

/** Prescribed reps: exact ("5"), range ("4-6"), as many as possible ("ALL") or not fixed ("~"). */
export const REPS_PATTERN = /^(?:\d{1,3}(?:-\d{1,3})?|ALL|~)$/;

/** Tempo: eccentric / pause / concentric / pause, "X" = explosive, e.g. "1/0/1/0", "3/1/X/0". */
export const TEMPO_PATTERN = /^[0-9X](?:\/[0-9X]){3}$/;

// ---------------------------------------------------------------------------
// Strength sessions
// ---------------------------------------------------------------------------

export interface StrengthSetDto {
  id: string;
  done: boolean;
  /** Kilograms, max 2 decimals. Null until entered. */
  weight: number | null;
  /** Performed reps. Null until entered. */
  reps: number | null;
}

export interface StrengthSetUpdateDto {
  id?: string;
  done: boolean;
  weight: number | null;
  reps: number | null;
}

export interface AlternativeGroupDto {
  id: string;
  name: string;
}

export interface StrengthExerciseDto {
  id: string;
  exerciseId: string;
  title: string;
  description: string;
  alternativeGroupId: string | null;
  /** Prescribed number of working sets (null for ad-hoc exercises). */
  targetSets: number | null;
  reps: string | null;
  tempo: string | null;
  note: string | null;
  /** Performed sets. */
  sets: StrengthSetDto[];
}

export interface StrengthActivityDto {
  id: string;
  name: string;
  items: StrengthExerciseDto[];
  /** Ordered by position (lowest orderIndex of the members). */
  alternativeGroups: AlternativeGroupDto[];
}

export interface StrengthExerciseDictionaryDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrengthActivityFinishDto {
  id: string;
  status: 'finished';
  finishedAt: string;
}

// ---------------------------------------------------------------------------
// Workout templates
// ---------------------------------------------------------------------------

export interface TemplateExerciseDto {
  id: string;
  exerciseId: string;
  /** From dictionary. */
  title: string;
  /** From dictionary. */
  description: string;
  alternativeGroupId: string | null;
  sets: number;
  reps: string;
  tempo: string | null;
  note: string | null;
}

export interface WorkoutTemplateDto {
  id: string;
  name: string;
  description: string | null;
  /** Ordered by orderIndex. */
  items: TemplateExerciseDto[];
  /** Ordered by position (lowest orderIndex of the members). */
  alternativeGroups: AlternativeGroupDto[];
}

export interface WorkoutTemplateSummaryDto {
  id: string;
  name: string;
  description: string | null;
  exerciseCount: number;
  updatedAt: string;
}

export interface TemplateAlternativeGroupUpsertDto {
  /** Existing group (PUT). */
  id?: string;
  /** Referenced by items[].alternativeGroupKey in the same payload. */
  clientKey: string;
  name: string;
}

export interface TemplateExerciseUpsertDto {
  /** Existing template_exercise (PUT). */
  id?: string;
  exerciseId: string;
  /** = alternativeGroups[].clientKey */
  alternativeGroupKey?: string | null;
  sets: number;
  reps: string;
  tempo?: string | null;
  note?: string | null;
}

/** Order of `items` defines orderIndex. */
export interface WorkoutTemplateUpsertDto {
  name: string;
  description?: string | null;
  alternativeGroups: TemplateAlternativeGroupUpsertDto[];
  items: TemplateExerciseUpsertDto[];
}
