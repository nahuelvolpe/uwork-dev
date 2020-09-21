import React from 'react';
import ReactDOM from "react-dom";
import '@testing-library/react';
import { render, fireEvent, waitFor, screen, wait } from '@testing-library/react'
import Register from '../uWork/components/Register/Register';
import { BrowserRouter as Router } from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Router>
                        <Register />
                    </Router>, div)
  })