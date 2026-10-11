import { BadRequestException } from '@nestjs/common';
import {
  REPS_PATTERN,
  StrengthSetUpdateDto,
  TEMPO_PATTERN,
  TemplateAlternativeGroupUpsertDto,
  TemplateExerciseUpsertDto,
  WorkoutTemplateUpsertDto,
} from './strength.types';

export const MAX_TEMPLATE_NAME_LENGTH = 120;
export const MAX_GROUP_NAME_LENGTH = 120;
export const MAX_PRESCRIBED_SETS = 50;
export const MIN_ALTERNATIVE_GROUP_MEMBERS = 2;
/** numeric(6,2) → at most 9999.99 */
export const MAX_SET_WEIGHT = 9999.99;
export const MAX_SET_REPS = 999;

export function isValidReps(value: string): boolean {
  if (!REPS_PATTERN.test(value)) {
    return false;
  }

  const range = value.match(/^(\d+)-(\d+)$/);
  if (range) {
    return Number(range[1]) <= Number(range[2]);
  }

  return true;
}

export function isValidTempo(value: string): boolean {
  return TEMPO_PATTERN.test(value);
}

/** Normalizes optional string input: trims, empty string → null. */
export function normalizeOptional(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function optionalId(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

/**
 * Validates and normalizes a template payload.
 * Throws BadRequestException listing every problem found.
 *
 * Alternative group rules (see TEMPLATE_SESSIONS.md → Alternatives):
 * - every item references an existing `clientKey` (or none),
 * - a group has at least 2 members,
 * - members of a group occupy consecutive positions (no foreign item in between).
 * Ownership of `id`s ("same template") is checked by the service.
 */
export function validateTemplateUpsert(
  payload: WorkoutTemplateUpsertDto,
): WorkoutTemplateUpsertDto {
  const errors: string[] = [];

  if (payload === null || typeof payload !== 'object') {
    throw new BadRequestException(['Payload must be an object']);
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  if (name === '') {
    errors.push('name is required');
  } else if (name.length > MAX_TEMPLATE_NAME_LENGTH) {
    errors.push(`name must be at most ${MAX_TEMPLATE_NAME_LENGTH} characters`);
  }

  if (!Array.isArray(payload.items)) {
    errors.push('items must be an array');
    throw new BadRequestException(errors);
  }

  const rawGroups: unknown = payload.alternativeGroups ?? [];
  if (!Array.isArray(rawGroups)) {
    errors.push('alternativeGroups must be an array');
    throw new BadRequestException(errors);
  }

  // --- groups -------------------------------------------------------------
  const groupKeys = new Set<string>();
  const alternativeGroups: TemplateAlternativeGroupUpsertDto[] = (
    rawGroups as TemplateAlternativeGroupUpsertDto[]
  ).map((group, index) => {
    const path = `alternativeGroups[${index}]`;
    const clientKey =
      typeof group?.clientKey === 'string' ? group.clientKey.trim() : '';
    const groupName = typeof group?.name === 'string' ? group.name.trim() : '';

    if (clientKey === '') {
      errors.push(`${path}.clientKey is required`);
    } else if (groupKeys.has(clientKey)) {
      errors.push(`${path}.clientKey "${clientKey}" is duplicated`);
    } else {
      groupKeys.add(clientKey);
    }

    if (groupName === '') {
      errors.push(`${path}.name is required`);
    } else if (groupName.length > MAX_GROUP_NAME_LENGTH) {
      errors.push(`${path}.name must be at most ${MAX_GROUP_NAME_LENGTH} characters`);
    }

    const id = optionalId(group?.id);
    return id ? { id, clientKey, name: groupName } : { clientKey, name: groupName };
  });

  // --- items --------------------------------------------------------------
  const items: TemplateExerciseUpsertDto[] = payload.items.map((item, index) => {
    const path = `items[${index}]`;

    if (typeof item?.exerciseId !== 'string' || item.exerciseId.trim() === '') {
      errors.push(`${path}.exerciseId is required`);
    }

    if (
      !Number.isInteger(item?.sets) ||
      item.sets < 1 ||
      item.sets > MAX_PRESCRIBED_SETS
    ) {
      errors.push(`${path}.sets must be an integer between 1 and ${MAX_PRESCRIBED_SETS}`);
    }

    const reps = typeof item?.reps === 'string' ? item.reps.trim() : '';
    if (!isValidReps(reps)) {
      errors.push(`${path}.reps "${item?.reps}" is invalid (allowed: "5", "4-6", "ALL", "~")`);
    }

    const tempo = normalizeOptional(item?.tempo);
    if (tempo !== null && !isValidTempo(tempo)) {
      errors.push(`${path}.tempo "${tempo}" is invalid (e.g. "1/0/1/0", "3/1/X/0")`);
    }

    const alternativeGroupKey = normalizeOptional(item?.alternativeGroupKey);
    if (alternativeGroupKey !== null && !groupKeys.has(alternativeGroupKey)) {
      errors.push(`${path}.alternativeGroupKey "${alternativeGroupKey}" does not match any alternativeGroups[].clientKey`);
    }

    const normalized: TemplateExerciseUpsertDto = {
      exerciseId: typeof item?.exerciseId === 'string' ? item.exerciseId.trim() : '',
      alternativeGroupKey,
      sets: item?.sets,
      reps,
      tempo,
      note: normalizeOptional(item?.note),
    };
    const id = optionalId(item?.id);
    return id ? { id, ...normalized } : normalized;
  });

  // --- group rules ----------------------------------------------------------
  for (const group of alternativeGroups) {
    if (group.clientKey === '') {
      continue;
    }
    const positions = items
      .map((item, index) => (item.alternativeGroupKey === group.clientKey ? index : -1))
      .filter((index) => index >= 0);

    if (positions.length < MIN_ALTERNATIVE_GROUP_MEMBERS) {
      errors.push(
        `alternative group "${group.clientKey}" must have at least ${MIN_ALTERNATIVE_GROUP_MEMBERS} members`,
      );
    } else if (positions[positions.length - 1] - positions[0] !== positions.length - 1) {
      errors.push(
        `members of alternative group "${group.clientKey}" must be consecutive`,
      );
    }
  }

  // --- duplicated ids -------------------------------------------------------
  const duplicated = (ids: (string | undefined)[]) =>
    ids.filter((id, index) => id !== undefined && ids.indexOf(id) !== index);
  for (const id of new Set(duplicated(items.map((item) => item.id)))) {
    errors.push(`items: id "${id}" is duplicated`);
  }
  for (const id of new Set(duplicated(alternativeGroups.map((group) => group.id)))) {
    errors.push(`alternativeGroups: id "${id}" is duplicated`);
  }

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }

  return {
    name,
    description: normalizeOptional(payload.description),
    alternativeGroups,
    items,
  };
}

function toOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim().replace(',', '.');
    return trimmed === '' ? null : Number(trimmed);
  }
  return typeof value === 'number' ? value : NaN;
}

function hasAtMostTwoDecimals(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-9;
}

/**
 * Validates performed sets (PUT exercises/:id/sets).
 * `weight >= 0` with max 2 decimals, `reps` integer >= 0, both nullable.
 * Numeric strings ("60", "82,5") and "" are accepted and normalized.
 */
export function validateSetsUpdate(sets: StrengthSetUpdateDto[]): StrengthSetUpdateDto[] {
  if (!Array.isArray(sets)) {
    throw new BadRequestException(['Payload must be an array of sets']);
  }

  const errors: string[] = [];

  const normalized = sets.map((set, index) => {
    const path = `[${index}]`;

    if (set === null || typeof set !== 'object') {
      errors.push(`${path} must be an object`);
      return { done: false, weight: null, reps: null };
    }

    if (typeof set.done !== 'boolean') {
      errors.push(`${path}.done must be a boolean`);
    }

    const weight = toOptionalNumber(set.weight);
    if (
      weight !== null &&
      (!Number.isFinite(weight) ||
        weight < 0 ||
        weight > MAX_SET_WEIGHT ||
        !hasAtMostTwoDecimals(weight))
    ) {
      errors.push(
        `${path}.weight must be a number between 0 and ${MAX_SET_WEIGHT} with at most 2 decimals`,
      );
    }

    const reps = toOptionalNumber(set.reps);
    if (
      reps !== null &&
      (!Number.isInteger(reps) || reps < 0 || reps > MAX_SET_REPS)
    ) {
      errors.push(`${path}.reps must be an integer between 0 and ${MAX_SET_REPS}`);
    }

    const result: StrengthSetUpdateDto = {
      done: set.done,
      weight: weight === null ? null : Math.round(weight * 100) / 100,
      reps,
    };
    const id = optionalId(set.id);
    return id ? { id, ...result } : result;
  });

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }

  return normalized;
}
