## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## What to build

- Extend the Discriminated Unions in `src/types/lesson.ts` to support `FillInTheBlankItem` and `MultipleChoiceItem`.
- Update `sample_lesson.json` to include these games in the `mini_games` array.
- Integrate `FillInTheBlankGame` and `MultipleChoiceGame` into the `LessonRunner` orchestration.
- Ensure the full loop from game 1 to N runs flawlessly.

## Acceptance criteria

- [ ] Types for Fill in the Blank and Multiple Choice are defined and added to the Union.
- [ ] JSON data for these games conforms to the new Array structure.
- [ ] `LessonRunner` correctly transitions through all 5 game types in a single lesson.

## Blocked by

- [task-11-core-engine-matching.md](./task-11-core-engine-matching.md)
