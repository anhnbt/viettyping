/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpinWheelGame, { SpinWheelGameConfig } from '../SpinWheelGame';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, onAnimationComplete, ...rest } = props;
        return (
          <div 
            ref={ref} 
            {...rest}
            data-testid={props['data-testid'] || 'motion-div'}
            onClick={() => {
              if (onAnimationComplete) {
                onAnimationComplete();
              }
            }}
          >
            {children}
          </div>
        );
      }),
      button: React.forwardRef(({ children, ...props }: any, ref: any) => {
        const { whileHover, whileTap, animate, ...rest } = props;
        return <button ref={ref} {...rest}>{children}</button>;
      }),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn());

// Mock Audio
const mockPlay = jest.fn().mockResolvedValue(undefined);
global.Audio = jest.fn().mockImplementation(() => ({
  play: mockPlay,
  volume: 0,
  load: jest.fn(),
  pause: jest.fn(),
}));

describe('SpinWheelGame', () => {
  const mockConfig: SpinWheelGameConfig = {
    id: 'spin-test-game',
    items: ['ba', 'bò', 'ca']
  };

  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the wheel and spin button', () => {
    render(<SpinWheelGame gameConfig={mockConfig} onComplete={mockOnComplete} />);
    
    expect(screen.getByRole('button', { name: /Quay Ngay!/i })).toBeInTheDocument();
    expect(screen.getByText('ba')).toBeInTheDocument();
    expect(screen.getByText('bò')).toBeInTheDocument();
    expect(screen.getByText('ca')).toBeInTheDocument();
  });

  it('should spin, select winner, show popup, and trigger onComplete', async () => {
    // Mock SpeechSynthesis
    const mockSpeak = jest.fn();
    global.window.speechSynthesis = {
      speak: mockSpeak,
      cancel: jest.fn(),
      getVoices: () => [],
      pause: jest.fn(),
      resume: jest.fn(),
    } as any;
    global.SpeechSynthesisUtterance = jest.fn();

    render(<SpinWheelGame gameConfig={mockConfig} onComplete={mockOnComplete} />);
    
    const spinBtn = screen.getByRole('button', { name: /Quay Ngay!/i });
    fireEvent.click(spinBtn);

    expect(spinBtn).toBeDisabled();
    expect(screen.getByText('Đang quay...')).toBeInTheDocument();

    // Trigger onAnimationComplete by clicking the motion-div representing the wheel
    // The wheel has class name "w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative"
    // and is rendered inside the container.
    // In our mock, the div has data-testid="motion-div" (or we can query by container)
    const wheel = screen.getAllByTestId('motion-div')[0];
    fireEvent.click(wheel);

    // After animation complete, popup should appear
    expect(screen.getByText('Bạn quay được chữ:')).toBeInTheDocument();
    
    // One of the items should be in the popup
    const textElements = screen.getAllByText(/ba|bò|ca/);
    // There should be the wheel text and the popup text
    expect(textElements.length).toBeGreaterThan(0);

    // Click "Tiếp tục" in the popup
    const continueBtn = screen.getByRole('button', { name: /Tiếp tục/i });
    fireEvent.click(continueBtn);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
    const telemetry = mockOnComplete.mock.calls[0][0];
    expect(telemetry.score).toBe(100);
    expect(telemetry.durationSeconds).toBeGreaterThanOrEqual(0);
  });
});
