# Strength templates and training sessions

## Goal

Use the existing `strength_activity`, `strength_activity_exercise`, and
`strength_set` tables for both reusable workout templates and recorded training
sessions. Do not introduce separate template tables.

## Data model

Add one column to `strength_activity`:

```ts
@Column({ default: false })
isTemplate!: boolean;
```

All primary keys should be UUIDs. Every template and every saved session has
its own UUID.

| Record | `isTemplate` | Meaning |
| --- | --- | --- |
| Workout template | `true` | Reusable workout definition |
| Training session | `false` | A workout performed or in progress |
| Manually created session | `false` | A session not based on a template |

`strength_activity_exercise` and `strength_set` remain children of
`strength_activity`; they do not need an `isTemplate` column because their
parent determines their role.

## Start a session from a template

1. Load the template activity with its exercises and sets.
2. Create a new `strength_activity` with a new UUID and `isTemplate: false`.
3. Copy every exercise into new `strength_activity_exercise` rows with new
   UUIDs and the new activity ID.
4. Copy every set into new `strength_set` rows with new UUIDs and the new
   activity-exercise IDs. Set `done` to `false` for the new session.
5. Do all writes in one database transaction.

The copied rows are a snapshot. Editing a template later must not modify an
existing or finished session.

## API and query rules

- Template list: query `strength_activity` with `isTemplate: true`.
- Session history: query `strength_activity` with `isTemplate: false`.
- Active session: query `isTemplate: false` and `status: 'active'`.
- The current hard-coded `getTemplateActivity()` method should be removed once
  templates are persisted.
- Add an endpoint/service operation such as `POST
  /activities/strength/templates/:templateId/sessions` to clone a template.

## Deliberately deferred

Do not add `templateId` / `sourceTemplateId` yet. It is only needed later if we
want to show which template produced a session, template usage statistics, or
template-based session history. Adding it later does not change the cloning
approach.
