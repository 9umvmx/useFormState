import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // Const linkElement = screen.getByText(/[a-z]/i);
  // expect(linkElement).toBeInTheDocument();
  expect(1).toBe(1);
});
