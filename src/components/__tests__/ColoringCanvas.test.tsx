import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColoringCanvas from '../ColoringCanvas';
import { ColoringCanvasItem } from '@/types/lesson';

const mockGameConfig: ColoringCanvasItem = {
  id: 'coloring-test-1',
  type: 'drawing_coloring_canvas',
  items: [
    {
      outlineSvgName: 'heart',
      title: 'Tô màu hình Trái tim',
      targetCoveragePercent: 70,
    }
  ]
};

const mockOnComplete = jest.fn();

describe('ColoringCanvas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders canvas, color options and instruction text', () => {
    render(<ColoringCanvas gameConfig={mockGameConfig} onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Tô màu hình Trái tim')).toBeInTheDocument();
    expect(screen.getByText(/Nhiệm vụ: Chọn bút sáp màu bên dưới/i)).toBeInTheDocument();
    expect(screen.getByText('🖍️ Hộp Bút Màu Sáp')).toBeInTheDocument();
    expect(screen.getByText(/Phủ màu:/i)).toBeInTheDocument();
    expect(screen.getByText(/Lem viền:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tô lại/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hoàn thành/i })).toBeInTheDocument();
  });

  it('shows error notice when clicking complete on uncolored canvas', () => {
    render(<ColoringCanvas gameConfig={mockGameConfig} onComplete={mockOnComplete} />);
    
    const completeBtn = screen.getByRole('button', { name: /Hoàn thành/i });
    fireEvent.click(completeBtn);
    
    expect(screen.getByText(/Bé ơi, hãy tô màu thêm một chút nữa trước khi hoàn thành nhé!/i)).toBeInTheDocument();
  });
});
