import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Add your specific tests here
    // Example: expect(screen.getByText(/Greek Souvlaki/i)).toBeInTheDocument();
  });

  // Add more tests as needed
});
