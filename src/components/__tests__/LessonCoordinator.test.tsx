/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import LessonCoordinator from "../lesson/LessonCoordinator";
import { LessonConfig } from "@/types/lesson";

// Mock framer-motion
jest.mock("framer-motion", () => {
  const React = require("react");
  const cache: Record<string, any> = {};
  const motionProxy = new Proxy(
    {},
    {
      get: (target, key: string) => {
        if (!cache[key]) {
          cache[key] = React.forwardRef(({ children, ...props }: any, ref: any) => {
            const {
              initial,
              animate,
              exit,
              transition,
              whileHover,
              whileTap,
              style,
              ...rest
            } = props;
            const Component = key as any;
            const mergedStyle = {
              ...style,
              ...(animate && typeof animate === "object" ? animate : {}),
            };
            return (
              <Component ref={ref} style={mergedStyle} {...rest}>
                {children}
              </Component>
            );
          });
        }
        return cache[key];
      },
    }
  );
  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock canvas-confetti
jest.mock("canvas-confetti", () => jest.fn());

// Mock useTypingSound hook to avoid missing SoundProvider context
jest.mock("@/hooks/useTypingSound", () => ({
  useTypingSound: () => ({
    playCorrectSound: jest.fn(),
    playWrongSound: jest.fn(),
  }),
}));

// Mock Audio
const mockPlay = jest.fn().mockResolvedValue(undefined);
global.Audio = jest.fn().mockImplementation(() => ({
  play: mockPlay,
  volume: 0,
}));

// Mock other games to simplify integration testing
jest.mock("@/components/MatchingGame", () => {
  return jest.fn(({ gameConfig, onComplete }: any) => (
    <div data-testid="mock-matching-game">
      <button onClick={() => onComplete({ score: 90, durationSeconds: 10 })}>
        Complete Matching
      </button>
    </div>
  ));
});

jest.mock("@/components/SpinWheelGame", () => {
  return jest.fn(({ gameConfig, onComplete }: any) => (
    <div data-testid="mock-spin-wheel-game">
      <button onClick={() => onComplete({ score: 100, durationSeconds: 5 })}>
        Complete Spin Wheel
      </button>
    </div>
  ));
});

jest.mock("@/components/FillInTheBlankGame", () => {
  return jest.fn(({ gameConfig, onComplete }: any) => (
    <div data-testid="mock-fill-blank-game">
      <button onClick={() => onComplete({ score: 80, durationSeconds: 15 })}>
        Complete Fill Blank
      </button>
    </div>
  ));
});

jest.mock("@/components/MultipleChoiceGame", () => {
  return jest.fn(({ gameConfig, onComplete }: any) => (
    <div data-testid="mock-multiple-choice-game">
      <button onClick={() => onComplete({ score: 100, durationSeconds: 8 })}>
        Complete Multiple Choice
      </button>
    </div>
  ));
});

describe("LessonCoordinator Integration", () => {
  const mockConfig: LessonConfig = {
    lesson_title: "Học chữ B và vần BA",
    topic: "Siêu xe",
    flashcards: [
      {
        word: "ba",
        word_uppercase: "BA",
        spelling_guide: "bờ - a - ba",
        example_sentence: "Ba đưa bé đi học.",
        image_prompt: "Dad illustration",
        image_url: "/assets/ba.jpg",
      },
      {
        word: "bò",
        word_uppercase: "BÒ",
        spelling_guide: "bờ - o - bo - huyền - bò",
        example_sentence: "Bò ăn cỏ.",
        image_prompt: "Cow illustration",
        image_url: "/assets/bo.jpg",
      }
    ],
    typing_practice: [
      {
        content: "ba",
        type: "word",
        description: "bờ - a - ba",
        time_limit_seconds: 15,
      }
    ],
    summary_config: {
      show_typing_summary: false,
      celebration_message: "Bé giỏi quá!",
    },
    mini_games: [
      {
        id: "game-tf-1",
        type: "true_false_game",
        items: [
          {
            correct_word: "ba",
            distractor_word: "ca",
            image_prompt: "Dad image",
          }
        ]
      }
    ],
    base_rewards: {
      completion_xp: 100,
      badge_unlock_id: "badge_b",
      badge_name_vi: "Huy hiệu Chữ B",
      celebration_type: "fireworks",
    }
  };

  const mockOnActivityComplete = jest.fn();
  const mockOnAllActivitiesComplete = jest.fn();
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    Math.random = originalRandom;
    jest.useRealTimers();
  });

  it("should navigate through flashcards and transition to true_false_game, then finish", async () => {
    // Force Math.random in TrueFalseGame to show correct word
    Math.random = () => 0.9;

    render(
      <LessonCoordinator
        config={mockConfig}
        onActivityComplete={mockOnActivityComplete}
        onAllActivitiesComplete={mockOnAllActivitiesComplete}
      />
    );

    // 1. Check initial render shows Flashcards step
    // Check first flashcard uppercase word
    expect(screen.getByText("BA")).toBeInTheDocument();
    
    // Progress should be 0% at the start
    // ProgressBar width is represented by style.width
    const progressBarDiv = screen.getByRole("img", { hidden: true }).parentElement; 
    // ProgressBar has: <div className="w-full ... h-6 ..."><motion.div ... /></div>
    // Let's query by progressbar class or container
    const progressFill = document.querySelector(".bg-gradient-to-r");
    expect(progressFill).toBeInTheDocument();
    expect(progressFill).toHaveStyle("width: 0%");

    // Check that previous button is disabled
    const prevBtn = screen.getByTestId("prev-fc-btn");
    expect(prevBtn).toBeDisabled();

    // Click Next to go to the second flashcard
    const nextBtn = screen.getByTestId("next-fc-btn");
    fireEvent.click(nextBtn);

    // Now showing the second (and last) flashcard
    expect(screen.getByText("BÒ")).toBeInTheDocument();
    // Progress should have updated: (1/2) * (1/3) * 100 = 16.666%
    expect(progressFill).toHaveStyle("width: 16.666666666666664%");

    // The next button should now be "Chơi game!" button
    const playBtn = screen.getByTestId("play-game-btn");
    expect(playBtn).toBeInTheDocument();

    // Click "Chơi game!" to finish flashcards step
    fireEvent.click(playBtn);

    // Should call onActivityComplete for 'flashcards'
    expect(mockOnActivityComplete).toHaveBeenCalledWith("flashcards", expect.objectContaining({
      score: 100,
    }));

    // 2. Transitioned to Typing Practice step
    expect(screen.getByText(/Luyện gõ: Từ vựng/i)).toBeInTheDocument();
    expect(progressFill).toHaveStyle("width: 33.33333333333333%");

    // Simulate typing the correct word "ba"
    const inputEl = screen.getByRole("textbox");
    fireEvent.change(inputEl, { target: { value: "ba" } });

    // Should call onActivityComplete for 'typing_0'
    expect(mockOnActivityComplete).toHaveBeenCalledWith("typing_0", expect.objectContaining({
      score: 100,
    }));

    // 3. Transitioned to True/False Game
    expect(screen.getByText(/Trò chơi: true false game/i)).toBeInTheDocument();
    
    // Progress should be: ((1 + 1 + 0) / 3) * 100 = 66.66%
    expect(progressFill).toHaveStyle("width: 66.66666666666666%");

    // True/False Game displays correct word "ba" (because Math.random = 0.9 > 0.5)
    // Check displayed word in the game
    expect(screen.getByText("ba")).toBeInTheDocument();

    // Select "Đúng" to answer correctly
    const dungBtn = screen.getByRole("button", { name: /Đúng/i });
    fireEvent.click(dungBtn);

    // Fast forward TrueFalseGame transition timeout (1.5s)
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // 4. Since there was only 1 game, it should transition to the summary step
    expect(screen.getByText("Bé đã hoàn thành!")).toBeInTheDocument();
    expect(screen.getByText("Tổng số hoạt động:")).toBeInTheDocument();
    expect(screen.getByText("Huy hiệu Chữ B")).toBeInTheDocument();
    expect(screen.getByText("+100 XP")).toBeInTheDocument();
    expect(progressFill).toHaveStyle("width: 100%");

    // Verify onAllActivitiesComplete was called
    expect(mockOnAllActivitiesComplete).toHaveBeenCalledTimes(1);
    const summary = mockOnAllActivitiesComplete.mock.calls[0][0];
    expect(summary.totalScore).toBe(300); // 100 flashcards + 100 typing + 100 true_false_game
    expect(summary.activityResults).toHaveLength(3);
    expect(summary.activityResults[0].activityId).toBe("flashcards");
    expect(summary.activityResults[1].activityId).toBe("typing_0");
    expect(summary.activityResults[2].activityId).toBe("game-tf-1");
  });

  it("should integrate with all types of mini-games correctly and compile overall telemetry", async () => {
    const configWithAllGames: LessonConfig = {
      ...mockConfig,
      mini_games: [
        {
          id: "game-tf-1",
          type: "true_false_game",
          items: [{ correct_word: "ba", distractor_word: "ca", image_prompt: "Dad image" }]
        },
        {
          id: "game-matching-1",
          type: "matching_game",
          items: [{ word: "ba", image_prompt: "Dad image" }]
        },
        {
          id: "game-spin-1",
          type: "spin_wheel_items",
          items: ["ba"]
        },
        {
          id: "game-fill-1",
          type: "fill_in_the_blank",
          items: [{ full_word: "ba", missing_char: "a", sentence: "b_" }]
        },
        {
          id: "game-mc-1",
          type: "multiple_choice",
          items: [{ question: "Từ nào là 'ba'?", correct_answer: "ba", distractors: ["ca"] }]
        }
      ]
    };

    Math.random = () => 0.9;

    render(
      <LessonCoordinator
        config={configWithAllGames}
        onActivityComplete={mockOnActivityComplete}
        onAllActivitiesComplete={mockOnAllActivitiesComplete}
      />
    );

    // 1. Flashcards (2 flashcards)
    fireEvent.click(screen.getByTestId("next-fc-btn"));
    fireEvent.click(screen.getByTestId("play-game-btn"));

    // 2. Typing practice
    const inputEl = screen.getByRole("textbox");
    fireEvent.change(inputEl, { target: { value: "ba" } });

    // 3. True/False Game
    expect(screen.getByText(/Trò chơi: true false game/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Đúng/i }));
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // 4. Matching Game (Mocked)
    expect(screen.getByTestId("mock-matching-game")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Complete Matching/i }));

    // 5. Spin Wheel Game (Mocked)
    expect(screen.getByTestId("mock-spin-wheel-game")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Complete Spin Wheel/i }));

    // 6. Fill in the blank (Mocked)
    expect(screen.getByTestId("mock-fill-blank-game")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Complete Fill Blank/i }));

    // 7. Multiple Choice (Mocked)
    expect(screen.getByTestId("mock-multiple-choice-game")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Complete Multiple Choice/i }));

    // 8. Summary Screen
    expect(screen.getByText("Bé đã hoàn thành!")).toBeInTheDocument();

    expect(mockOnAllActivitiesComplete).toHaveBeenCalledTimes(1);
    const summary = mockOnAllActivitiesComplete.mock.calls[0][0];
    
    // 100 fc + 100 typing + 100 tf + 90 matching + 100 spin + 80 blank + 100 mc = 670
    expect(summary.totalScore).toBe(670);
    expect(summary.activityResults).toHaveLength(7);
  });
});
