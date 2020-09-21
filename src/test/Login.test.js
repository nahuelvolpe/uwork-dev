import React from 'react';
import ReactDOM from "react-dom";
import '@testing-library/react';
import { render, fireEvent, waitFor, screen, wait } from '@testing-library/react'
import Login from '../uWork/components/Login/Login';
import App from '../App';
import { BrowserRouter as Router } from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
  })


  it('submits correct values', async () => {
    const { container } = render(<Router>
                                    <Login />
                                 </Router>)

    const email = container.querySelector('input[id="login-email"]')
    const password = container.querySelector('input[id="login-pass"]')
    const submit = container.querySelector('button[id="login-button"]')
    const results = container.querySelector('p[id="ingreso"]');

    
    console.log(email._valueTracker.getValue);

     await wait(() => {
        fireEvent.change(email, {
            value: "vnahui@outlook.com"
        })
      }) 

      console.log(email.value);

      await wait(() => {
        fireEvent.change(password, {
          target: {
            value: "123456"
          }
        })
      })

      await wait(() => {
        fireEvent.click(submit)
      })

      expect(results.innerHTML).toBe('ingreso')


  })