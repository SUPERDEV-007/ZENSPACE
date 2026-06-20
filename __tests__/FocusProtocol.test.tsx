import { render, screen, fireEvent, act } from '@testing-library/react';
import FocusProtocol from '../src/components/FocusProtocol';

describe('FocusProtocol Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders standby mode initially', () => {
    render(<FocusProtocol />);
    expect(screen.getByText('STANDBY MODE')).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('starts focus timer when START FOCUS is clicked', () => {
    render(<FocusProtocol />);
    const startBtn = screen.getByText(/START FOCUS/i);
    
    act(() => {
      fireEvent.click(startBtn);
    });

    expect(screen.getByText('FOCUS INITIATED')).toBeInTheDocument();
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should tick down to 24:59
    expect(screen.getByText('24:59')).toBeInTheDocument();
  });

  it('aborts the timer', () => {
    render(<FocusProtocol />);
    const startBtn = screen.getByText(/START FOCUS/i);
    
    act(() => {
      fireEvent.click(startBtn);
    });
    
    const abortBtn = screen.getByText(/ABORT PROTOCOL/i);
    
    act(() => {
      fireEvent.click(abortBtn);
    });

    expect(screen.getByText('STANDBY MODE')).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });
});
