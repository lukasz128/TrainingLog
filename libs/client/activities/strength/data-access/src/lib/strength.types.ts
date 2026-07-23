export interface StrengthSet {
  id?: string;
  done: boolean;
  weight: string;
  reps: string;
}

export interface StrengthExercise {
  id: string;
  exerciseId: string;
  title: string;
  description: string;
  phase: string;
  details: string;
  sets: StrengthSet[];
}

export interface StrengthExerciseDictionaryItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrengthActivity {
  id: string;
  name: string;
  subtitle: string;
  items: StrengthExercise[];
}

export type StrengthActivitiesState =
  | { state: 'IDLE' }
  | { state: 'LOADING' }
  | { state: 'ERROR'; errMsg: string }
  | { state: 'LOADED'; data: StrengthActivity[] };
