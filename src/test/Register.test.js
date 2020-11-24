import React from 'react'
import '@testing-library/react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import Register from '../uWork/components/Register/Register'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'
import AuthenticationService from '../uWork/services/AuthenticationService'

jest.mock('../uWork/services/AuthenticationService')

configure({ adapter: new Adapter() })

afterEach(cleanup)

const setUp = () => {
  const getById = queryByAttribute.bind(null, 'id')
  const { container } = render(<MemoryRouter><Register /></MemoryRouter>)
  const emailInput = container.querySelector('input[name="email"]')
  const passInput = container.querySelector('input[name="password"]')
  const confirmInput = container.querySelector('input[name="confirmPassword"]')
  const submitButton = container.querySelector('button[type="submit"]')
  const googleButton = getById(container, 'register-google-btn')

  return { container, emailInput, passInput, confirmInput, submitButton, googleButton, getById }
}

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
    it('show required validation messages on blur', async () => {
      const { container, emailInput, passInput, confirmInput, getById } = setUp()
      
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
      const { container, emailInput, passInput, confirmInput, getById } = setUp()

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
    it('disables button when form is not dirty or theres an error', async () => {
      const { container, emailInput, submitButton, getById } = setUp()

      expect(submitButton).toBeDisabled()

      fireEvent.change(emailInput, { target: {value: 'badmail.com'} })
      fireEvent.blur(emailInput)

      await wait(() => {
        expect(getById(container, 'register-email-helper-text')).not.toBe(null)
        expect(submitButton).toBeDisabled()
      })
    })
    it('enables button when there is no error', async () => {
      const { container, emailInput, passInput, confirmInput, submitButton, getById } = setUp()

      expect(submitButton).toBeDisabled()

      fireEvent.change(emailInput, { target: {value: 'goodemail@gmail.com'} })
      fireEvent.change(passInput, { target: {value: 'password'} })
      fireEvent.change(confirmInput, { target: {value: 'password'} })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      fireEvent.blur(confirmInput)

      await wait(() => {
        expect(getById(container, 'register-email-helper-text')).not.toHaveTextContent()
        expect(getById(container, 'register-pass-helper-text')).not.toHaveTextContent()
        expect(getById(container, 'register-conf-pass-helper-text')).not.toHaveTextContent()
        expect(submitButton).not.toBeDisabled()
      })
    })
    it('should trigger register when click submit button', async () => {
      AuthenticationService.register.mockResolvedValue(undefined)
      const { emailInput, passInput, confirmInput, submitButton } = setUp()

      fireEvent.change(emailInput, { target: {value: 'goodemail@gmail.com'} })
      fireEvent.change(passInput, { target: {value: 'password'} })
      fireEvent.change(confirmInput, { target: {value: 'password'} })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      fireEvent.blur(confirmInput)
      fireEvent.click(submitButton)

      await wait(() => {
        expect(AuthenticationService.register).toHaveBeenCalled()
        expect(AuthenticationService.register).toHaveBeenCalledWith('goodemail@gmail.com', 'password')
      })
    })
    it('should trigger async already in use email validation when registration fail', async () => {
      AuthenticationService.register.mockRejectedValue({ code: 'auth/email-already-in-use' })
      const { container, emailInput, passInput, confirmInput, submitButton, getById } = setUp()

      fireEvent.change(emailInput, { target: {value: 'goodemail@gmail.com'} })
      fireEvent.change(passInput, { target: {value: 'password'} })
      fireEvent.change(confirmInput, { target: {value: 'password'} })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      fireEvent.blur(confirmInput)
      fireEvent.click(submitButton)

      await wait(() => {
        expect(AuthenticationService.register).toHaveBeenCalled()
        expect(AuthenticationService.register).toHaveBeenCalledWith('goodemail@gmail.com', 'password')
        expect(getById(container, 'register-email-helper-text')).toHaveTextContent('El email ingresado se encuentra en uso')
      })
    })
    it('should trigger social login when click on google button', async () => {
      AuthenticationService.loginSocial.mockResolvedValue(undefined)
      const { googleButton } = setUp()
      
      await wait(() => {
        fireEvent.click(googleButton)
      })
      
      await wait(() => {
        expect(AuthenticationService.loginSocial).toHaveBeenCalled()
        expect(AuthenticationService.loginSocial).toHaveBeenCalledTimes(1)
      })
    })
  })
})