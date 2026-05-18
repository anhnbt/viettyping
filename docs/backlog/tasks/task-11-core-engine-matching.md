## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## What to build

- Define Discriminated Union Types for `MiniGameConfig` and `LessonConfig` in `src/types/lesson.ts`.
- Restructure the `sample_lesson.json` so that `mini_games` is an array.
- Create the `LessonRunner` pure component (Game Engine).
- Ensure `MatchingGame` integrates correctly and runs end-to-end within the engine.
- This slice establishes the architectural foundation (HITL required).

## Acceptance criteria

- [ ] `src/types/lesson.ts` is fully typed using Discriminated Unions.
- [ ] `sample_lesson.json` uses an Array for `mini_games`.
- [ ] `LessonRunner` is a pure component (receives props, manages `currentIndex`, no side effects).
- [ ] `LessonRunner` correctly renders `MatchingGame` based on the array sequence.
- [ ] HITL: Architecture review of `LessonRunner` props and Type Definitions.

## Blocked by

None - can start immediately
