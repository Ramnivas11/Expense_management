import { render, screen } from '@testing-library/react';

jest.mock('./services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
  setAuth: jest.fn(),
}));

import App from './App';

test('renders login heading', () => {
  render(<App />);
  expect(screen.getByText(/Expense Management/i)).toBeInTheDocument();
});
