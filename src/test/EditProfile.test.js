import React from 'react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'
import { Button } from "@material-ui/core";

import EditProfile from '../uWork/components/EditProfile/EditProfile'
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as MateriasService from '../uWork/services/MateriasService'
import * as UserService from '../uWork/services/UserService'

jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')
jest.mock('../uWork/services/UserService')

configure({ adapter: new Adapter() })

afterEach(cleanup)

const setUp = () => {
  const getById = queryByAttribute.bind(null, 'id')
  const { container } = render(<MemoryRouter><EditProfile/></MemoryRouter>)
  const photoInput = container.querySelector('input[name="userImg"]')
  const nameInput = container.querySelector('input[name="nombre"]')
  const lastInput = container.querySelector('input[name="apellido"]')
  const submitBtn = container.querySelector('button[type="submit"]')

  return { getById, container, photoInput, nameInput, lastInput, submitBtn }
}

describe('EditProfile', () => {
  describe('When user is register', () => {
    it('should renders EditProfile correctly', async () => {
      jest.setTimeout(10000)
      AuthenticationService.getSessionUserId.mockReturnValue('id')
      UserService.getUserData.mockResolvedValue({ data: jest.fn(() => { return { photoURL: 'photo', firstName: '', lastName: '', uid: 'id', email: 'email', materias: {} } }) })
      const wrapper = mount(<MemoryRouter><EditProfile /></MemoryRouter>)
      await wait(() => {
        expect(wrapper.find(EditProfile)).toHaveLength(1)
        expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
        expect(UserService.getUserData).toHaveBeenCalled()
        expect(UserService.getUserData).toHaveBeenCalledWith('id')
      })
    })

    it('has a Formik Form, three FormikField and a Button', async () => {
      AuthenticationService.getSessionUserId.mockReturnValue('id')
      UserService.getUserDataById.mockResolvedValue({ photoURL: 'photo', firstName: '', lastName: '', uid: 'id', email: 'email', materias: {} })
      const wrapper = mount(<MemoryRouter><EditProfile /></MemoryRouter>)
      await wait(() => {
        expect(wrapper.find(Formik)).toHaveLength(1)
        expect(wrapper.find(Form)).toHaveLength(1)
        expect(wrapper.find(FormikField)).toHaveLength(3)
        expect(wrapper.find(Button)).toHaveLength(1)
      })
    })
  })
})

describe('Profile Form', () => {
  it('triggers fields validation on blur', async () => {
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    UserService.getUserData.mockResolvedValue({ data: jest.fn(() => undefined) })
    const { container, nameInput, lastInput, getById } = setUp()
    
    await wait(() => {
      fireEvent.blur(nameInput)
    })
    await wait(() => {
      fireEvent.blur(lastInput)
    })

    await wait(() => {
      expect(getById(container, 'user-name-helper-text')).not.toBe(null)
      expect(getById(container, 'user-name-helper-text')).toHaveTextContent("Nombre requerido!")
    })
  })
})