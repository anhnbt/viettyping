import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RealWorldMathGame from '../RealWorldMathGame';
import { RealWorldMathGameItem } from '@/types/lesson';

const mockGameConfig: RealWorldMathGameItem = {
  id: 'math-test-1',
  type: 'math_realworld_dragdrop',
  items: [
    {
      question: '3 + 2 = ?',
      targetNum: 5,
      itemType: 'apple',
      sentence: 'Bé hãy kéo 5 quả táo vào giỏ nhé!',
    }
  ]
};

const mockOnComplete = jest.fn();

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  volume: 0,
}));

describe('RealWorldMathGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders instructions and questions correctly', () => {
    render(<RealWorldMathGame gameConfig={mockGameConfig} onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Bé hãy kéo 5 quả táo vào giỏ nhé!')).toBeInTheDocument();
    expect(screen.getByText(/Nhiệm vụ: Kéo số lượng vật phẩm tương ứng/i)).toBeInTheDocument();
    expect(screen.getByText('🧺 Giỏ Táo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kiểm tra/i })).toBeInTheDocument();
  });

  it('shows error hint when checking empty targets', () => {
    render(<RealWorldMathGame gameConfig={mockGameConfig} onComplete={mockOnComplete} />);
    
    const checkBtn = screen.getByRole('button', { name: /Kiểm tra/i });
    fireEvent.click(checkBtn);
    
    expect(screen.getByText('Bé cần thêm 5 vật phẩm nữa nhé!')).toBeInTheDocument();
  });
});
