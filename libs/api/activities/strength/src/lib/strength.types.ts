export interface StrengthSetDto {
  id: string;
  done: boolean;
  weight: string;
  reps: string;
}

export interface StrengthSetUpdateDto {
  id?: string;
  done: boolean;
  weight: string;
  reps: string;
}

export interface StrengthExerciseDto {
  id: string;
  exerciseId: string;
  title: string;
  description: string;
  phase: string;
  details: string;
  sets: StrengthSetDto[];
}

export interface StrengthActivityDto {
  id: string;
  name: string;
  subtitle: string;
  items: StrengthExerciseDto[];
}

export interface StrengthExerciseDictionaryDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
