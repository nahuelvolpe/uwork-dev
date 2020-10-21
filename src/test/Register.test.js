import React from 'react';
import ReactDOM from "react-dom";
import '@testing-library/react';
import { render } from '@testing-library/react'
import Register from '../uWork/components/Register/Register';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Register', () => {
    test('renders Register component correctamente', () => {
      render(<Router>
                <Register />
             </Router>);
    });
  });