import React from 'react';
import '@testing-library/react';
import { render, fireEvent, wait, cleanup } from '@testing-library/react'
import Login from '../uWork/components/Login/Login';
import { Formik } from 'formik'
import { MemoryRouter } from 'react-router';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormikField from '../uWork/components/FormikField/FormikField'
import { Button } from '@material-ui/core';

configure({ adapter: new Adapter() });

afterEach(cleanup)

  describe('Login', () => {
    it('renders correctly', () => {
      render(<MemoryRouter><Login /></MemoryRouter>);
    });
  });

  describe('Form', () => {
    it('renders correctly', () => {
      const component = mount(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      expect(component.find(Formik)).toHaveLength(1)
    })
    it('has two fields rendered', () => {
      const component = mount(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      expect(component.find(FormikField)).toHaveLength(2)
    })
    it('has submit button', () => {
      const component = mount(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      expect(component.find(Button)).toHaveLength(2)
    })
  })

/*   describe('', () => {

  }) */


 /*  it('submits correct values', async () => {
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
  }) */