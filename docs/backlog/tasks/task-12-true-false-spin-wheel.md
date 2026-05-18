## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## What to build

- Extend the Discriminated Unions in `src/types/lesson.ts` to support `TrueFalseItem` and `SpinWheelItem`.
- Update `sample_lesson.json` to include these games in the `mini_games` array.
- Integrate `TrueFalseGame` and `SpinWheelGame` components into the `LessonRunner` orchestration.

## Acceptance criteria

- [ ] Types for True/False and Spin Wheel are defined and added to the Union.
- [ ] JSON data for these games conforms to the new Array structure.
- [ ] `LessonRunner` correctly transitions into and out of these games.

## Blocked by

- [task-11-core-engine-matching.md](./task-11-core-engine-matching.md)
