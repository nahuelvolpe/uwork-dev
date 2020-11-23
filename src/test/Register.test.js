import React from 'react'
import '@testing-library/react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import Register from '../uWork/components/Register/Register'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'

configure({ adapter: new Adapter() })

afterEach(cleanup)

describe('Register', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(<MemoryRouter><Register /></MemoryRouter>)
  })
  it('renders correctly', () => {
    expect(wrapper.find(Register)).toHaveLength(1)
  })
  it('has a Formik Form and three FormikField', () => {
    expect(wrapper.find(Formik)).toHaveLength(1)
    expect(wrapper.find(Form)).toHaveLength(1)
    expect(wrapper.find(FormikField)).toHaveLength(3)
  })
  describe('Form', () => {
    let container
    let getById
    beforeEach(() => {
      getById = queryByAttribute.bind(null, 'id')
      const c = render(<MemoryRouter><Register /></MemoryRouter>)
      container = c.container
    })
    it('show required validation messages on blur', async () => {
      const emailInput = container.querySelector('input[name="email"]')
      const passInput = container.querySelector('input[name="password"]')
      const confirmInput = container.querySelector('input[name="confirmPassword"]')
      
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      fireEvent.blur(confirmInput)

      await wait(() => {
        expect(getById(container, 'register-email-helper-text')).not.toBe(null)
        expect(getById(container, 'register-email-helper-text')).toHaveTextContent("Email requerido!")
        expect(getById(container, 'register-pass-helper-text')).not.toBe(null)
        expect(getById(container, 'register-pass-helper-text')).toHaveTextContent("Contraseña requerida!")
        expect(getById(container, 'register-conf-pass-helper-text')).not.toBe(null)
        expect(getById(container, 'register-conf-pass-helper-text')).toHaveTextContent('Debes confirmar la contraseña!')
      })
    })
    it('show equal, length and format validation messages on blur', async () => {
      const emailInput = container.querySelector('input[name="email"]')
      const passInput = container.querySelector('input[name="password"]')
      const confirmInput = container.querySelector('input[name="confirmPassword"]')
      
      fireEvent.change(emailInput, { target: {value: 'badmail.com'} })
      fireEvent.change(passInput, { target: {value: 'short'} })
      fireEvent.change(confirmInput, { target: {value: 'notequal'} })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      fireEvent.blur(confirmInput)

      await wait(() => {
        expect(getById(container, 'register-email-helper-text')).not.toBe(null)
        expect(getById(container, 'register-email-helper-text')).toHaveTextContent("Formato inválido!")
        expect(getById(container, 'register-pass-helper-text')).not.toBe(null)
        expect(getById(container, 'register-pass-helper-text')).toHaveTextContent("La contraseña debe tener como minimo 6 digitos")
        expect(getById(container, 'register-conf-pass-helper-text')).not.toBe(null)
        expect(getById(container, 'register-conf-pass-helper-text')).toHaveTextContent('Las contraseñas no coinciden')
      })
    })
  })
})