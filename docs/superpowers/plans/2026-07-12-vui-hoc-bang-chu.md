# Vui Học Bảng Chữ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, single-screen web game "Vui Học Bảng Chữ" where a Vietnamese 6-year-old hears a letter's phonic sound and taps the matching letter button, with XP and confetti on completing a round.

**Architecture:** Vite + React + TypeScript single-page app with no backend and no persistence. Game state (deck order, XP, progress) lives in a single React hook (`useGame`). Pure game logic (shuffling, phonic lookup, speech synthesis wrapper) is split into standalone, unit-testable modules under `src/game/`, decoupled from React so they can be tested without rendering anything.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Vitest 2 + @testing-library/react (jsdom environment), canvas-confetti.

**Repo location:** `~/Code/oss/projects/viettyping-workshop-demo` — an existing empty git repo (already `git init`'d, no commits yet). This is a **separate repository from `viettyping`**; every file path below is relative to that repo's root, not the `viettyping` repo. This plan itself is written and stored inside the `viettyping` repo per that project's spec-writing convention, but implementation happens entirely in the other repo.

## Global Constraints

- Node.js 18+ / npm 9+ required (verified locally: Node v22.20.0, npm 11.12.1).
- Standalone app: no dependency on or import from the `viettyping` repo's source code.
- No login, no persistent storage (no `localStorage`, no database, no server) — all state is in-memory React state, reset on page reload.
- No countdown/timer of any kind.
- Exactly 5 letters, fixed: `a`, `b`, `c`, `o`, `ô` — never more, never fewer.
- Letter choices render as plain text buttons only — no per-choice illustrations/images.
- TTS is Web Speech API only (`SpeechSynthesisUtterance`, `lang: "vi-VN"`) — no pre-recorded audio files.
- Phonic readings (not letter names) exactly as follows: `a`→"a", `b`→"bờ", `c`→"cờ", `o`→"o", `ô`→"ô".
- Correct answer: +10 XP, advance to next question immediately.
- Wrong answer: shake animation ~0.3s on the tapped button, no XP change, no advance, no penalty — player retries the same question.
- One round = 5 questions, each of the 5 letters used as the question exactly once, order shuffled ("bag without replacement") at round start and on restart.
- Round complete (5/5 correct) → confetti + total XP for the round + "Chơi lại" button that starts a fresh shuffled round with XP reset to 0.
- UI style: playful/cartoonish, bright colors, large rounded corners, bold neubrutalism-style drop shadows on buttons — no 3D mascot.

---

### Task 1: Project scaffold (Vite + React + TypeScript + Vitest)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/setupTests.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/sanity.test.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a working `npm run dev` / `npm test` / `npm run build` toolchain that every later task builds on. `src/App.tsx` exports `App` (a component), which Task 8 will modify to render the real game.

- [ ] **Step 1: Confirm the target repo and its current state**

Run:
```bash
cd ~/Code/oss/projects/viettyping-workshop-demo && git status
```
Expected: on branch with no commits yet (`No commits yet`), working tree otherwise empty aside from `.git/`. If this repo doesn't exist or already has unrelated content, stop and confirm the correct location with the user before continuing — do not scaffold on top of unknown existing work.

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "vui-hoc-bang-chu",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/canvas-confetti": "^1.9.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vite": "^6.0.5",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vui Học Bảng Chữ</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules
dist
*.local
.DS_Store
```

- [ ] **Step 7: Create `src/setupTests.ts`**

```ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});
```

(`globals: true` is intentionally off in `vite.config.ts`, so Testing Library's automatic cleanup-after-each-test never registers unless it's wired explicitly here — without this, a second `render()` in the same test file leaves stale DOM nodes from the previous test, causing "multiple elements found" failures.)

- [ ] **Step 8: Create `src/App.tsx`** (placeholder — Task 8 replaces the body with the real game screen)

```tsx
export function App() {
  return <div className="app">Đang tải Vui Học Bảng Chữ…</div>;
}
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 10: Create `src/sanity.test.ts`** (verifies the test runner itself is wired correctly)

```ts
import { describe, expect, it } from "vitest";

describe("test runner sanity check", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 11: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json` and `node_modules/`.

- [ ] **Step 12: Run the test suite**

Run: `npm test`
Expected: `1 passed` (the sanity test), no failures.

- [ ] **Step 13: Run the production build**

Run: `npm run build`
Expected: TypeScript type-checks with no errors, Vite build completes, `dist/` is created.

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts index.html .gitignore src/setupTests.ts src/App.tsx src/main.tsx src/sanity.test.ts
git commit -m "chore: scaffold Vite + React + TypeScript + Vitest project"
```

---

### Task 2: Deck logic — 5-letter shuffle ("bag without replacement")

**Files:**
- Create: `src/game/deck.ts`
- Test: `src/game/deck.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `LETTERS: readonly ["a", "b", "c", "o", "ô"]` and `shuffleLetters(letters?: readonly string[]): string[]`, both imported by Task 5 (`useGame`) and Task 8 (`GameScreen`).

- [ ] **Step 1: Write the failing test**

`src/game/deck.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { LETTERS, shuffleLetters } from "./deck";

describe("LETTERS", () => {
  it("contains exactly the 5 letters in the spec, in a fixed order", () => {
    expect(LETTERS).toEqual(["a", "b", "c", "o", "ô"]);
  });
});

describe("shuffleLetters", () => {
  it("returns all 5 letters with no duplicates and no extras", () => {
    const result = shuffleLetters();
    expect(result).toHaveLength(5);
    expect([...result].sort()).toEqual([...LETTERS].sort());
  });

  it("does not mutate the original LETTERS constant", () => {
    const before = [...LETTERS];
    shuffleLetters();
    expect(LETTERS).toEqual(before);
  });

  it("produces more than one distinct order across many draws", () => {
    const orders = Array.from({ length: 30 }, () => shuffleLetters().join(""));
    const uniqueOrders = new Set(orders);
    expect(uniqueOrders.size).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/game/deck.test.ts`
Expected: FAIL — `Cannot find module './deck'` (or similar resolution error), since `deck.ts` doesn't exist yet.

- [ ] **Step 3: Write minimal implementation**

`src/game/deck.ts`:
```ts
export const LETTERS = ["a", "b", "c", "o", "ô"] as const;

export type Letter = (typeof LETTERS)[number];

export function shuffleLetters(letters: readonly string[] = LETTERS): string[] {
  const shuffled = [...letters];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/game/deck.test.ts`
Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/game/deck.ts src/game/deck.test.ts
git commit -m "feat: add letter deck with shuffle logic"
```

---

### Task 3: Phonic reading lookup

**Files:**
- Create: `src/game/phonics.ts`
- Test: `src/game/phonics.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `getPhonicReading(letter: string): string`, imported by Task 8 (`GameScreen`).

- [ ] **Step 1: Write the failing test**

`src/game/phonics.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { getPhonicReading } from "./phonics";

describe("getPhonicReading", () => {
  it.each([
    ["a", "a"],
    ["b", "bờ"],
    ["c", "cờ"],
    ["o", "o"],
    ["ô", "ô"],
  ])("reads %s as phonic sound %s", (letter, expected) => {
    expect(getPhonicReading(letter)).toBe(expected);
  });

  it("throws for a letter outside the 5-letter spec", () => {
    expect(() => getPhonicReading("x")).toThrow(
      'Không có âm đọc phô-nic cho chữ "x"'
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/game/phonics.test.ts`
Expected: FAIL — `Cannot find module './phonics'`.

- [ ] **Step 3: Write minimal implementation**

`src/game/phonics.ts`:
```ts
const PHONIC_READINGS: Record<string, string> = {
  a: "a",
  b: "bờ",
  c: "cờ",
  o: "o",
  ô: "ô",
};

export function getPhonicReading(letter: string): string {
  const reading = PHONIC_READINGS[letter];
  if (!reading) {
    throw new Error(`Không có âm đọc phô-nic cho chữ "${letter}"`);
  }
  return reading;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/game/phonics.test.ts`
Expected: `6 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/game/phonics.ts src/game/phonics.test.ts
git commit -m "feat: add phonic reading lookup for the 5 letters"
```

---

### Task 4: Web Speech API wrapper

**Files:**
- Create: `src/game/speech.ts`
- Test: `src/game/speech.test.ts`

**Interfaces:**
- Consumes: nothing (wraps browser `window.speechSynthesis`).
- Produces: `webSpeechEngine: { speak(text: string): void }`, imported by Task 8 (`GameScreen`).

- [ ] **Step 1: Write the failing test**

`src/game/speech.test.ts`:
```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { webSpeechEngine } from "./speech";

describe("webSpeechEngine.speak", () => {
  const speakMock = vi.fn();

  beforeEach(() => {
    speakMock.mockClear();
    vi.stubGlobal(
      "SpeechSynthesisUtterance",
      vi.fn().mockImplementation((text: string) => ({ text, lang: "" }))
    );
    vi.stubGlobal("speechSynthesis", { speak: speakMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("speaks the given text in Vietnamese", () => {
    webSpeechEngine.speak("bờ");

    expect(speakMock).toHaveBeenCalledTimes(1);
    const utterance = speakMock.mock.calls[0][0];
    expect(utterance.text).toBe("bờ");
    expect(utterance.lang).toBe("vi-VN");
  });

  it("does nothing when speechSynthesis is unavailable", () => {
    vi.stubGlobal("speechSynthesis", undefined);
    expect(() => webSpeechEngine.speak("a")).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/game/speech.test.ts`
Expected: FAIL — `Cannot find module './speech'`.

- [ ] **Step 3: Write minimal implementation**

`src/game/speech.ts`:
```ts
export interface SpeechEngine {
  speak(text: string): void;
}

export const webSpeechEngine: SpeechEngine = {
  speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    window.speechSynthesis.speak(utterance);
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/game/speech.test.ts`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/game/speech.ts src/game/speech.test.ts
git commit -m "feat: add Web Speech API wrapper for Vietnamese TTS"
```

---

### Task 5: `useGame` state hook

**Files:**
- Create: `src/hooks/useGame.ts`
- Test: `src/hooks/useGame.test.ts`

**Interfaces:**
- Consumes: `LETTERS`, `shuffleLetters` from `src/game/deck.ts` (Task 2).
- Produces: `useGame(): UseGameResult` where
  ```ts
  type GameStatus = "playing" | "completed";
  interface UseGameResult {
    letters: string[];
    currentIndex: number;
    xp: number;
    status: GameStatus;
    currentLetter: string; // "" when status is "completed"
    answer: (letter: string) => boolean; // true if correct
    restart: () => void;
  }
  ```
  Imported by Task 8 (`GameScreen`).

- [ ] **Step 1: Write the failing test**

`src/hooks/useGame.test.ts`:
```tsx
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LETTERS } from "../game/deck";
import { useGame } from "./useGame";

function wrongLetterFor(current: string): string {
  const candidate = LETTERS.find((letter) => letter !== current);
  if (!candidate) {
    throw new Error("Cần ít nhất 2 chữ khác nhau để test câu trả lời sai");
  }
  return candidate;
}

describe("useGame", () => {
  it("starts a round with 5 letters, 0 XP, and status playing", () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.letters).toHaveLength(5);
    expect(result.current.xp).toBe(0);
    expect(result.current.status).toBe("playing");
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentLetter).toBe(result.current.letters[0]);
  });

  it("awards 10 XP and advances to the next question on a correct answer", () => {
    const { result } = renderHook(() => useGame());
    const firstLetter = result.current.currentLetter;

    let wasCorrect = false;
    act(() => {
      wasCorrect = result.current.answer(firstLetter);
    });

    expect(wasCorrect).toBe(true);
    expect(result.current.xp).toBe(10);
    expect(result.current.currentIndex).toBe(1);
  });

  it("does not change XP or advance on a wrong answer", () => {
    const { result } = renderHook(() => useGame());
    const wrongLetter = wrongLetterFor(result.current.currentLetter);

    let wasCorrect = true;
    act(() => {
      wasCorrect = result.current.answer(wrongLetter);
    });

    expect(wasCorrect).toBe(false);
    expect(result.current.xp).toBe(0);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.status).toBe("playing");
  });

  it("marks the round completed after 5 correct answers, with 50 total XP", () => {
    const { result } = renderHook(() => useGame());

    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.answer(result.current.currentLetter);
      });
    }

    expect(result.current.status).toBe("completed");
    expect(result.current.xp).toBe(50);
    expect(result.current.currentIndex).toBe(5);
    expect(result.current.currentLetter).toBe("");
  });

  it("restart reshuffles the deck and resets XP and progress", () => {
    const { result } = renderHook(() => useGame());

    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.answer(result.current.currentLetter);
      });
    }
    expect(result.current.status).toBe("completed");

    act(() => {
      result.current.restart();
    });

    expect(result.current.status).toBe("playing");
    expect(result.current.xp).toBe(0);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.letters).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useGame.test.ts`
Expected: FAIL — `Cannot find module './useGame'`.

- [ ] **Step 3: Write minimal implementation**

`src/hooks/useGame.ts`:
```ts
import { useCallback, useState } from "react";
import { shuffleLetters } from "../game/deck";

export type GameStatus = "playing" | "completed";

interface GameState {
  letters: string[];
  currentIndex: number;
  xp: number;
  status: GameStatus;
}

export interface UseGameResult extends GameState {
  currentLetter: string;
  answer: (letter: string) => boolean;
  restart: () => void;
}

function createRound(): GameState {
  return {
    letters: shuffleLetters(),
    currentIndex: 0,
    xp: 0,
    status: "playing",
  };
}

export function useGame(): UseGameResult {
  const [state, setState] = useState<GameState>(createRound);

  const answer = useCallback(
    (letter: string): boolean => {
      const isCorrect = letter === state.letters[state.currentIndex];
      if (isCorrect) {
        setState((prev) => {
          const nextIndex = prev.currentIndex + 1;
          const isRoundComplete = nextIndex >= prev.letters.length;
          return {
            ...prev,
            xp: prev.xp + 10,
            currentIndex: nextIndex,
            status: isRoundComplete ? "completed" : "playing",
          };
        });
      }
      return isCorrect;
    },
    [state.letters, state.currentIndex]
  );

  const restart = useCallback(() => {
    setState(createRound());
  }, []);

  const currentLetter =
    state.status === "playing" ? state.letters[state.currentIndex] : "";

  return { ...state, currentLetter, answer, restart };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useGame.test.ts`
Expected: `5 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useGame.ts src/hooks/useGame.test.ts
git commit -m "feat: add useGame hook for round state and scoring"
```

---

### Task 6: `LetterButton` component

**Files:**
- Create: `src/components/LetterButton.tsx`
- Test: `src/components/LetterButton.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `LetterButton({ letter, isShaking, onClick }): JSX.Element`, imported by Task 8 (`GameScreen`). Renders a `<button>` with `aria-label="Chọn chữ {letter}"` and CSS class `letter-button` (plus `letter-button--shake` when `isShaking`).

- [ ] **Step 1: Write the failing test**

`src/components/LetterButton.test.tsx`:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LetterButton } from "./LetterButton";

describe("LetterButton", () => {
  it("renders the letter and calls onClick when pressed", () => {
    const handleClick = vi.fn();
    render(<LetterButton letter="a" isShaking={false} onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Chọn chữ a" });
    expect(button).toHaveTextContent("a");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies the shake class when isShaking is true", () => {
    render(<LetterButton letter="b" isShaking onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Chọn chữ b" });
    expect(button).toHaveClass("letter-button--shake");
  });

  it("does not apply the shake class when isShaking is false", () => {
    render(<LetterButton letter="c" isShaking={false} onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Chọn chữ c" });
    expect(button).not.toHaveClass("letter-button--shake");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/LetterButton.test.tsx`
Expected: FAIL — `Cannot find module './LetterButton'`.

- [ ] **Step 3: Write minimal implementation**

`src/components/LetterButton.tsx`:
```tsx
interface LetterButtonProps {
  letter: string;
  isShaking: boolean;
  onClick: () => void;
}

export function LetterButton({ letter, isShaking, onClick }: LetterButtonProps) {
  const className = isShaking
    ? "letter-button letter-button--shake"
    : "letter-button";

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={`Chọn chữ ${letter}`}
    >
      {letter}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/LetterButton.test.tsx`
Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/LetterButton.tsx src/components/LetterButton.test.tsx
git commit -m "feat: add LetterButton component"
```

---

### Task 7: `CompletionModal` component

**Files:**
- Create: `src/components/CompletionModal.tsx`
- Test: `src/components/CompletionModal.test.tsx`

**Interfaces:**
- Consumes: `confetti` default export from `canvas-confetti`.
- Produces: `CompletionModal({ xp, onRestart }): JSX.Element`, imported by Task 8 (`GameScreen`). Renders `role="dialog"` with `aria-label="Hoàn thành lượt chơi"`, the total XP text, and a "Chơi lại" button.

- [ ] **Step 1: Write the failing test**

`src/components/CompletionModal.test.tsx`:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import confetti from "canvas-confetti";
import { CompletionModal } from "./CompletionModal";

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("CompletionModal", () => {
  it("fires confetti on mount and shows the total XP", () => {
    render(<CompletionModal xp={50} onRestart={() => {}} />);

    expect(confetti).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it("calls onRestart when 'Chơi lại' is clicked", () => {
    const handleRestart = vi.fn();
    render(<CompletionModal xp={50} onRestart={handleRestart} />);

    fireEvent.click(screen.getByRole("button", { name: "Chơi lại" }));
    expect(handleRestart).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/CompletionModal.test.tsx`
Expected: FAIL — `Cannot find module './CompletionModal'`.

- [ ] **Step 3: Write minimal implementation**

`src/components/CompletionModal.tsx`:
```tsx
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface CompletionModalProps {
  xp: number;
  onRestart: () => void;
}

export function CompletionModal({ xp, onRestart }: CompletionModalProps) {
  useEffect(() => {
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
  }, []);

  return (
    <div
      className="completion-modal"
      role="dialog"
      aria-label="Hoàn thành lượt chơi"
    >
      <p className="completion-modal__title">Giỏi quá! 🎉</p>
      <p className="completion-modal__xp">Tổng điểm: {xp} XP</p>
      <button type="button" className="primary-button" onClick={onRestart}>
        Chơi lại
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/CompletionModal.test.tsx`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/CompletionModal.tsx src/components/CompletionModal.test.tsx
git commit -m "feat: add CompletionModal with confetti and restart"
```

---

### Task 8: `GameScreen` component — wire everything together

**Files:**
- Create: `src/components/GameScreen.tsx`
- Test: `src/components/GameScreen.test.tsx`
- Modify: `src/App.tsx` — render `GameScreen` instead of the Task 1 placeholder
- Delete: `src/sanity.test.ts` — superseded by real tests, no longer needed

**Interfaces:**
- Consumes: `LETTERS` from `src/game/deck.ts` (Task 2), `getPhonicReading` from `src/game/phonics.ts` (Task 3), `webSpeechEngine` from `src/game/speech.ts` (Task 4), `useGame` from `src/hooks/useGame.ts` (Task 5), `LetterButton` from `src/components/LetterButton.tsx` (Task 6), `CompletionModal` from `src/components/CompletionModal.tsx` (Task 7).
- Produces: `GameScreen(): JSX.Element`, imported by `src/App.tsx`.

**Design note:** the 5 letter buttons always render in the fixed `LETTERS` order (`a, b, c, o, ô`), not in the shuffled round order — only which letter is currently being asked for (`currentLetter`) changes between questions. This keeps button positions stable across a round so a 6-year-old isn't hunting for a button that moved.

- [ ] **Step 1: Write the failing test**

`src/components/GameScreen.test.tsx`:
```tsx
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GameScreen } from "./GameScreen";
import * as deck from "../game/deck";
import { webSpeechEngine } from "../game/speech";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

const FIXED_ORDER = ["a", "b", "c", "o", "ô"];

beforeEach(() => {
  vi.spyOn(deck, "shuffleLetters").mockReturnValue([...FIXED_ORDER]);
  vi.spyOn(webSpeechEngine, "speak").mockImplementation(() => {});
});

describe("GameScreen", () => {
  it("renders 5 letter choices, XP 0, and progress 'Câu 1/5' on mount", () => {
    render(<GameScreen />);

    for (const letter of deck.LETTERS) {
      expect(
        screen.getByRole("button", { name: `Chọn chữ ${letter}` })
      ).toBeInTheDocument();
    }
    expect(screen.getByText("0 XP")).toBeInTheDocument();
    expect(screen.getByText("Câu 1/5")).toBeInTheDocument();
  });

  it("speaks the phonic reading of the current letter on mount", () => {
    render(<GameScreen />);
    expect(webSpeechEngine.speak).toHaveBeenCalledWith("a");
  });

  it("shakes the wrong button and keeps XP at 0 on a wrong answer", () => {
    render(<GameScreen />);

    const wrongButton = screen.getByRole("button", { name: "Chọn chữ b" });
    fireEvent.click(wrongButton);

    expect(wrongButton).toHaveClass("letter-button--shake");
    expect(screen.getByText("0 XP")).toBeInTheDocument();
  });

  it("removes the shake class after 300ms", () => {
    vi.useFakeTimers();
    render(<GameScreen />);

    const wrongButton = screen.getByRole("button", { name: "Chọn chữ b" });
    fireEvent.click(wrongButton);
    expect(wrongButton).toHaveClass("letter-button--shake");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(wrongButton).not.toHaveClass("letter-button--shake");
    vi.useRealTimers();
  });

  it("advances to the next question and adds XP on a correct answer", () => {
    render(<GameScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Chọn chữ a" }));

    expect(screen.getByText("10 XP")).toBeInTheDocument();
    expect(screen.getByText("Câu 2/5")).toBeInTheDocument();
    expect(webSpeechEngine.speak).toHaveBeenCalledWith("bờ");
  });

  it("shows the completion modal with 50 XP after 5 correct answers", () => {
    render(<GameScreen />);

    for (const letter of FIXED_ORDER) {
      fireEvent.click(
        screen.getByRole("button", { name: `Chọn chữ ${letter}` })
      );
    }

    const dialog = screen.getByRole("dialog", { name: "Hoàn thành lượt chơi" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/50/)).toBeInTheDocument();
  });
});
```

(The header keeps showing `{xp} XP` even after the round completes, so a bare `screen.getByText(/50/)` matches both the header and the modal — scope the query to the dialog with `within`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/GameScreen.test.tsx`
Expected: FAIL — `Cannot find module './GameScreen'`.

- [ ] **Step 3: Write minimal implementation**

`src/components/GameScreen.tsx`:
```tsx
import { useEffect, useRef, useState } from "react";
import { LETTERS } from "../game/deck";
import { getPhonicReading } from "../game/phonics";
import { webSpeechEngine } from "../game/speech";
import { useGame } from "../hooks/useGame";
import { LetterButton } from "./LetterButton";
import { CompletionModal } from "./CompletionModal";

export function GameScreen() {
  const { letters, currentIndex, currentLetter, xp, status, answer, restart } =
    useGame();
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const shakeTimeoutRef = useRef<number>();

  useEffect(() => {
    if (status === "playing" && currentLetter) {
      webSpeechEngine.speak(getPhonicReading(currentLetter));
    }
  }, [status, currentLetter]);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        window.clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  function handleChoice(letter: string) {
    const isCorrect = answer(letter);
    if (!isCorrect) {
      setWrongLetter(letter);
      shakeTimeoutRef.current = window.setTimeout(() => {
        setWrongLetter(null);
      }, 300);
    }
  }

  function handleReplay() {
    if (currentLetter) {
      webSpeechEngine.speak(getPhonicReading(currentLetter));
    }
  }

  return (
    <div className="game-screen">
      <header className="game-screen__header">
        <span className="game-screen__xp">{xp} XP</span>
        {status === "playing" && (
          <span className="game-screen__progress">
            Câu {currentIndex + 1}/{letters.length}
          </span>
        )}
      </header>

      {status === "playing" && (
        <main className="game-screen__body">
          <button
            type="button"
            className="speaker-button"
            onClick={handleReplay}
            aria-label="Nghe lại"
          >
            🔊
          </button>
          <div className="letter-grid">
            {LETTERS.map((letter) => (
              <LetterButton
                key={letter}
                letter={letter}
                isShaking={wrongLetter === letter}
                onClick={() => handleChoice(letter)}
              />
            ))}
          </div>
        </main>
      )}

      {status === "completed" && (
        <CompletionModal xp={xp} onRestart={restart} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/GameScreen.test.tsx`
Expected: `6 passed`.

- [ ] **Step 5: Wire `GameScreen` into the app and remove the sanity test**

Replace `src/App.tsx`:
```tsx
import { GameScreen } from "./components/GameScreen";

export function App() {
  return <GameScreen />;
}
```

Delete `src/sanity.test.ts`.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all tests pass (deck: 4, phonics: 6, speech: 2, useGame: 5, LetterButton: 3, CompletionModal: 2, GameScreen: 6 — `28 passed`, 0 failed).

- [ ] **Step 7: Commit**

```bash
git add src/components/GameScreen.tsx src/components/GameScreen.test.tsx src/App.tsx
git rm src/sanity.test.ts
git commit -m "feat: wire GameScreen into the app, remove sanity test"
```

---

### Task 9: Playful neubrutalism styling

**Files:**
- Create: `src/index.css`
- Modify: `src/main.tsx` — import the stylesheet

**Interfaces:**
- Consumes: the class names already used by `GameScreen`, `LetterButton`, and `CompletionModal` (Tasks 6–8): `game-screen`, `game-screen__header`, `game-screen__xp`, `game-screen__progress`, `game-screen__body`, `speaker-button`, `letter-grid`, `letter-button`, `letter-button--shake`, `completion-modal`, `completion-modal__title`, `completion-modal__xp`, `primary-button`.
- Produces: visual styling only — no new exports.

- [ ] **Step 1: Create `src/index.css`**

```css
:root {
  --color-bg: #fff4d6;
  --color-primary: #ff6b6b;
  --color-secondary: #4ecdc4;
  --color-accent: #ffd93d;
  --color-ink: #22223b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Comic Sans MS", "Baloo 2", system-ui, sans-serif;
}

.game-screen {
  width: min(480px, 92vw);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.game-screen__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 4px solid var(--color-ink);
  border-radius: 24px;
  padding: 12px 20px;
  box-shadow: 6px 6px 0 var(--color-ink);
  font-size: 1.25rem;
  font-weight: 700;
}

.game-screen__xp {
  color: var(--color-primary);
}

.game-screen__progress {
  color: var(--color-secondary);
}

.game-screen__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.speaker-button {
  width: 96px;
  height: 96px;
  font-size: 3rem;
  border-radius: 50%;
  border: 4px solid var(--color-ink);
  background: var(--color-accent);
  box-shadow: 6px 6px 0 var(--color-ink);
  cursor: pointer;
}

.speaker-button:active {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0 var(--color-ink);
}

.letter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.letter-button {
  padding: 20px 0;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 20px;
  border: 4px solid var(--color-ink);
  background: var(--color-secondary);
  box-shadow: 6px 6px 0 var(--color-ink);
  cursor: pointer;
  color: var(--color-ink);
}

.letter-button:active {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0 var(--color-ink);
}

.letter-button--shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8px);
  }
  50% {
    transform: translateX(8px);
  }
  75% {
    transform: translateX(-8px);
  }
}

.completion-modal {
  background: white;
  border: 4px solid var(--color-ink);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 8px 8px 0 var(--color-ink);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.completion-modal__title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.completion-modal__xp {
  font-size: 1.25rem;
  color: var(--color-primary);
  margin: 0;
}

.primary-button {
  padding: 16px;
  font-size: 1.25rem;
  font-weight: 700;
  border-radius: 20px;
  border: 4px solid var(--color-ink);
  background: var(--color-accent);
  box-shadow: 6px 6px 0 var(--color-ink);
  cursor: pointer;
}

.primary-button:active {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0 var(--color-ink);
}
```

- [ ] **Step 2: Import the stylesheet in `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Verify tests and build still pass**

Run: `npm test && npm run build`
Expected: all tests still pass (CSS changes don't affect logic tests), build succeeds.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open the printed local URL in a browser. Confirm: large rounded buttons with bold offset drop-shadows, bright warm background, 5 letter buttons laid out in a 3-column grid, header shows "0 XP" and "Câu 1/5". Stop the dev server (Ctrl+C) when done.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/main.tsx
git commit -m "style: add playful neubrutalism styling"
```

---

### Task 10: README and final verification

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (documentation only) — last task, no downstream consumers.

- [ ] **Step 1: Create `README.md`**

```markdown
# Vui Học Bảng Chữ

App demo nhỏ giúp bé lớp 1 làm quen 5 chữ cái tiếng Việt (a, b, c, o, ô) qua trò chơi "Nghe đọc — chọn đúng chữ". Xem đặc tả đầy đủ tại spec gốc trong repo `viettyping`: `docs/superpowers/specs/2026-07-11-vui-hoc-bang-chu-design.md`.

## Chạy thử

\`\`\`bash
npm install
npm run dev
\`\`\`

Mở URL được in ra (mặc định `http://localhost:5173`).

## Test

\`\`\`bash
npm test
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
```

- [ ] **Step 2: Run the full verification suite**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup and run instructions"
```

- [ ] **Step 4: Confirm git log**

Run: `git log --oneline`
Expected: 10 commits, one per task, in order from "chore: scaffold..." to "docs: add README...".

---

## Self-Review

**Spec coverage:**
- 5 fixed letters (a, b, c, o, ô) → Task 2 (`LETTERS`).
- Phonic (not letter-name) TTS reading → Task 3 (`getPhonicReading`) + Task 4 (`webSpeechEngine`), wired in Task 8.
- 5 displayed choices, text-only, no images → Task 6 (`LetterButton`) + Task 8 (fixed `LETTERS` order, no image props anywhere).
- Correct → +10 XP, advance → Task 5 (`useGame.answer`).
- Wrong → shake 0.3s, no penalty, retry same question → Task 8 (`handleChoice` + `letter-button--shake` + `GameScreen.test.tsx` timeout test).
- Round = 5 questions, bag-without-replacement, shuffled → Task 2 (`shuffleLetters`) + Task 5 (`createRound`).
- Completion → confetti + total XP + "Chơi lại" resetting XP to 0 → Task 7 (`CompletionModal`) + Task 5 (`restart`).
- Playful/neubrutalism UI, no mascot → Task 9 (`src/index.css`); no mascot component exists anywhere in the plan.
- No login/persistence/timer → no `localStorage`, no auth, no timer code anywhere in any task; confirmed absent by construction.
- Standalone from `viettyping` → separate repo (`viettyping-workshop-demo`), no imports from the `viettyping` codebase.

**Placeholder scan:** no "TBD"/"TODO" strings; every step has complete, runnable code; every test file has real assertions rather than descriptions of assertions.

**Type consistency:** `UseGameResult` (Task 5) matches exactly what `GameScreen` (Task 8) destructures (`letters`, `currentIndex`, `currentLetter`, `xp`, `status`, `answer`, `restart`). `LetterButtonProps` (Task 6: `letter`, `isShaking`, `onClick`) matches how `GameScreen` calls `<LetterButton letter isShaking onClick />`. `CompletionModalProps` (Task 7: `xp`, `onRestart`) matches `<CompletionModal xp={xp} onRestart={restart} />` in Task 8. `getPhonicReading` (Task 3) and `webSpeechEngine.speak` (Task 4) signatures match their Task 8 call sites.
