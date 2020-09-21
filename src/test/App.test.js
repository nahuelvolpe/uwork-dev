import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  test('renders App component correctamente', () => {
    render(<App />);
  });

  test('check if uWorkApp component renders inside App', () => {
    const { getByTestId } = render(<App />)
    const workApp = getByTestId("work-app")
    expect(workApp).toBeInTheDocument();
  })
});