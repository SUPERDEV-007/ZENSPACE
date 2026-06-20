import { render, screen, fireEvent, act } from '@testing-library/react';
import MoodGrid from '../src/components/MoodGrid';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('MoodGrid Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the grid with 30 days', () => {
    render(<MoodGrid />);
    act(() => {
      jest.runAllTimers();
    });
    // Check if at least one Day is rendered
    expect(screen.getByTitle('Day 1: NO DATA')).toBeInTheDocument();
  });

  it('updates mood on click', () => {
    render(<MoodGrid />);
    act(() => {
      jest.runAllTimers();
    });
    
    // Click DAY 1
    const day1 = screen.getByTitle('Day 1: NO DATA');
    expect(day1).toBeInTheDocument();
    
    act(() => {
      fireEvent.click(day1!);
    });

    // Mood options should appear
    expect(screen.getByText('FOCUSED / CALM')).toBeInTheDocument();
    expect(screen.getByText('BURNOUT / PANIC')).toBeInTheDocument();

    // Select CRITICAL
    const criticalBtn = screen.getByText('BURNOUT / PANIC');
    act(() => {
      fireEvent.click(criticalBtn);
    });

    // Check if local storage was updated
    const saved = JSON.parse(window.localStorage.getItem('zenspace_mood_grid') || '[]');
    expect(saved[0]).toBe('CRITICAL');
  });
});
