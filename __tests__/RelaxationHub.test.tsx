import { render, screen, act } from '@testing-library/react';
import RelaxationHub from '../src/components/RelaxationHub';

describe('RelaxationHub Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    render(<RelaxationHub />);
    expect(screen.getByText('4-7-8 CYCLE')).toBeInTheDocument();
    expect(screen.getByText(/INITIATE/i)).toBeInTheDocument();
  });

  it('starts the breathing cycle', () => {
    render(<RelaxationHub />);
    const initBtn = screen.getByText(/INITIATE/i);
    
    act(() => {
      initBtn.click();
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('INHALE')).toBeInTheDocument();
  });
});
