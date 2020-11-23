import React from 'react';
import '@testing-library/react';
import { render, fireEvent, wait, cleanup, screen, queryByAttribute } from '@testing-library/react'
import Login from '../uWork/components/Login/Login';
import { Formik } from 'formik'
import { MemoryRouter } from 'react-router';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormikField from '../uWork/components/FormikField/FormikField'
import AuthenticationService from '../uWork/services/AuthenticationService'

jest.mock('../uWork/services/AuthenticationService')

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
    it('has two fields', () => {
      const component = mount(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      expect(component.find(FormikField)).toHaveLength(2)
    })
    it('shows required validation messages on blur', async () => {
      const getById = queryByAttribute.bind(null, 'id')
      const { container } = render(<MemoryRouter><Login /></MemoryRouter>)
      const emailInput = getById(container, 'login-email')
      const passInput = getById(container, 'login-pass')

      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      
      await wait(() => {
        expect(getById(container, "login-email-helper-text")).not.toBe(null);
        expect(getById(container, 'login-email-helper-text')).toHaveTextContent("Email requerido!")
        expect(getById(container, "login-pass-helper-text")).not.toBe(null);
        expect(getById(container, 'login-pass-helper-text')).toHaveTextContent("Contraseña requerida!")
      });
    })
    it('shows length and format validation', async () => {
      const getById = queryByAttribute.bind(null, 'id')
      const { container } = render(<MemoryRouter><Login /></MemoryRouter>)
      const emailInput = getById(container, 'login-email')
      const passInput = getById(container, 'login-pass')

      fireEvent.change(emailInput, { target: { value: 'invalidmail'} })
      fireEvent.change(passInput, { target: { value: "pass" } })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)

      await wait(() => {
        expect(getById(container, "login-email-helper-text")).not.toBe(null);
        expect(getById(container, 'login-email-helper-text')).toHaveTextContent("Formato inválido!")
        expect(getById(container, "login-pass-helper-text")).not.toBe(null);
        expect(getById(container, 'login-pass-helper-text')).toHaveTextContent("La contraseña debe tener como minimo 6 digitos y ser alfanumerica")
      });
    })
    it('has button disabled when there is an error', async () => {
      const getById = queryByAttribute.bind(null, 'id')
      const { container } = render(<MemoryRouter><Login /></MemoryRouter>)
      const emailInput = getById(container, 'login-email')
      const passInput = getById(container, 'login-pass')

      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)

      await wait(() => {
        expect(getById(container, 'login-button')).toBeDisabled()
      })
    })
    it('trigger login functions when click on submit button', async () => {
      const getById = queryByAttribute.bind(null, 'id')
      AuthenticationService.loginEmail.mockResolvedValue(undefined)
      const { container } = render(<MemoryRouter><Login /></MemoryRouter>)

      const emailInput = getById(container, 'login-email')
      const passInput = getById(container, 'login-pass')
      const button = getById(container, "login-button")

      fireEvent.change(emailInput, { target: { value: 'mail@mail.com'} })
      fireEvent.change(passInput, { target: { value: "contraseña" } })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      await wait(() => {
        fireEvent.click(button)
      })

      await wait (() => {
        expect(AuthenticationService.loginEmail).toHaveBeenCalled()
        expect(AuthenticationService.loginEmail).toHaveBeenCalledWith("mail@mail.com", "contraseña")
      })
    })
    it('should show usuario no encontrado error message coming from firebase', async () => {
      const getById = queryByAttribute.bind(null, 'id')
      AuthenticationService.loginEmail.mockRejectedValue({ code: "auth/invalid-email" })
      const { container } = render(<MemoryRouter><Login /></MemoryRouter>)

      const emailInput = getById(container, 'login-email')
      const passInput = getById(container, 'login-pass')
      const button = getById(container, "login-button")

      fireEvent.change(emailInput, { target: { value: 'mail@mail.com'} })
      fireEvent.change(passInput, { target: { value: "contraseña" } })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      await wait(() => {
        fireEvent.click(button)
      })

      await wait (() => {
        expect(AuthenticationService.loginEmail).toHaveBeenCalled()
        expect(AuthenticationService.loginEmail).toHaveBeenCalledWith("mail@mail.com", "contraseña")
        expect(getById(container, "login-email-helper-text")).not.toBe(null);
        expect(getById(container, 'login-email-helper-text')).toHaveTextContent("Usuario no encontrado")
      })
    })
    it('should show contraseña incorrecta error message coming from firebase', async () => {
      const getById = queryByAttribute.bind(null, 'id')
      AuthenticationService.loginEmail.mockRejectedValue({ code: "auth/wrong-password" })
      const { container } = render(<MemoryRouter><Login /></MemoryRouter>)

      const emailInput = getById(container, 'login-email')
      const passInput = getById(container, 'login-pass')
      const button = getById(container, "login-button")

      fireEvent.change(emailInput, { target: { value: 'mail@mail.com'} })
      fireEvent.change(passInput, { target: { value: "contraseña" } })
      fireEvent.blur(emailInput)
      fireEvent.blur(passInput)
      await wait(() => {
        fireEvent.click(button)
      })

      await wait (() => {
        expect(AuthenticationService.loginEmail).toHaveBeenCalled()
        expect(AuthenticationService.loginEmail).toHaveBeenCalledWith("mail@mail.com", "contraseña")
        expect(getById(container, "login-pass-helper-text")).not.toBe(null);
        expect(getById(container, 'login-pass-helper-text')).toHaveTextContent("Contraseña incorrecta")
      })
    })
    it('should trigger social login when click on ingresar con google', async () => {
      const getById = queryByAttribute.bind(null, 'id')
      AuthenticationService.loginSocial.mockResolvedValue(undefined)
      const { container } = render(<MemoryRouter><Login /></MemoryRouter>)
      const button = getById(container, "login-google-button")

      await wait(() => {
        fireEvent.click(button)
      })

      await wait (() => {
        expect(AuthenticationService.loginSocial).toHaveBeenCalled()
        expect(AuthenticationService.loginSocial).toHaveBeenCalledTimes(1)
      })
    })
  })