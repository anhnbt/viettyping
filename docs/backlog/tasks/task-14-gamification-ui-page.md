## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## What to build

- Strip any remaining context calls or side-effects from `LessonRunner`.
- Refactor `src/app/lesson/games/page.tsx` to act as an Adapter. It must:
  - Fetch/Provide the JSON config to `LessonRunner`.
  - Handle the `onAllGamesComplete` callback.
  - Dispatch XP (`addXP`) and completion flags safely to `LessonContext`.
  - Trigger Confetti, Audio, and show the Completion Popup.
- This step ensures Gamification Context is cleanly separated from the Engine.

## Acceptance criteria

- [ ] `LessonRunner` imports no Context hooks or side-effect libraries.
- [ ] `page.tsx` correctly handles `onAllGamesComplete`.
- [ ] XP and Badges are reliably updated in Context without race conditions.
- [ ] Gamification UI (Confetti/Popup) runs exactly as before.
- [ ] HITL: Review page transitions and Gamification Side-effects for memory leaks.

## Blocked by

- [task-11-core-engine-matching.md](./task-11-core-engine-matching.md)
- [task-12-true-false-spin-wheel.md](./task-12-true-false-spin-wheel.md)
- [task-13-fill-blank-multi-choice.md](./task-13-fill-blank-multi-choice.md)
