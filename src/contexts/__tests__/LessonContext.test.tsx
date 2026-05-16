import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LessonProvider, useLesson } from '../LessonContext';

// Test component to consume the context
const TestComponent = () => {
  const {
    currentXP,
    streak,
    progress,
    totalActivities,
    badges,
    addXP,
    incrementStreak,
    resetStreak,
    markActivityCompleted,
    setTotalActivities,
    unlockBadge,
  } = useLesson();

  return (
    <div>
      <span data-testid="xp">{currentXP}</span>
      <span data-testid="streak">{streak}</span>
      <span data-testid="progress">{progress}</span>
      <span data-testid="totalActivities">{totalActivities}</span>
      <span data-testid="badges">{badges.join(',')}</span>

      <button onClick={() => addXP(10)}>Add 10 XP</button>
      <button onClick={() => incrementStreak()}>Increment Streak</button>
      <button onClick={() => resetStreak()}>Reset Streak</button>
      <button onClick={() => markActivityCompleted('act-1')}>Complete Act 1</button>
      <button onClick={() => markActivityCompleted('act-2')}>Complete Act 2</button>
      <button onClick={() => setTotalActivities(4)}>Set Total to 4</button>
      <button onClick={() => unlockBadge('badge-1')}>Unlock Badge 1</button>
    </div>
  );
};

describe('LessonContext', () => {
  it('should provide default values', () => {
    render(
      <LessonProvider>
        <TestComponent />
      </LessonProvider>
    );

    expect(screen.getByTestId('xp')).toHaveTextContent('0');
    expect(screen.getByTestId('streak')).toHaveTextContent('0');
    expect(screen.getByTestId('progress')).toHaveTextContent('0');
    expect(screen.getByTestId('totalActivities')).toHaveTextContent('1');
    expect(screen.getByTestId('badges')).toHaveTextContent('');
  });

  it('should allow adding XP', () => {
    render(
      <LessonProvider>
        <TestComponent />
      </LessonProvider>
    );

    act(() => {
      screen.getByText('Add 10 XP').click();
    });

    expect(screen.getByTestId('xp')).toHaveTextContent('10');
  });

  it('should allow incrementing and resetting streak', () => {
    render(
      <LessonProvider>
        <TestComponent />
      </LessonProvider>
    );

    act(() => {
      screen.getByText('Increment Streak').click();
    });
    expect(screen.getByTestId('streak')).toHaveTextContent('1');

    act(() => {
      screen.getByText('Increment Streak').click();
    });
    expect(screen.getByTestId('streak')).toHaveTextContent('2');

    act(() => {
      screen.getByText('Reset Streak').click();
    });
    expect(screen.getByTestId('streak')).toHaveTextContent('0');
  });

  it('should calculate progress correctly based on activities', () => {
    render(
      <LessonProvider>
        <TestComponent />
      </LessonProvider>
    );

    act(() => {
      screen.getByText('Set Total to 4').click();
    });

    act(() => {
      screen.getByText('Complete Act 1').click();
    });
    expect(screen.getByTestId('progress')).toHaveTextContent('25');

    act(() => {
      screen.getByText('Complete Act 2').click();
    });
    expect(screen.getByTestId('progress')).toHaveTextContent('50');

    // Completing an already completed activity should not change progress
    act(() => {
      screen.getByText('Complete Act 1').click();
    });
    expect(screen.getByTestId('progress')).toHaveTextContent('50');
  });

  it('should allow unlocking badges without duplicates', () => {
    render(
      <LessonProvider>
        <TestComponent />
      </LessonProvider>
    );

    act(() => {
      screen.getByText('Unlock Badge 1').click();
    });
    expect(screen.getByTestId('badges')).toHaveTextContent('badge-1');

    // Unlocking the same badge again should not create duplicates
    act(() => {
      screen.getByText('Unlock Badge 1').click();
    });
    expect(screen.getByTestId('badges')).toHaveTextContent('badge-1');
  });

  it('should throw error when useLesson is used outside of LessonProvider', () => {
    // Suppress console.error for this expected error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useLesson must be used within a LessonProvider'
    );

    consoleSpy.mockRestore();
  });
});
