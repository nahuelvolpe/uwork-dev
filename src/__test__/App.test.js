import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
  });

  it('renders uWorkApp component correctly', () => {
    const { getByTestId } = render(<App />)
    const workApp = getByTestId("work-app")
    expect(workApp).toBeInTheDocument();
  })
});