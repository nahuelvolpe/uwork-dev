import React from 'react'
import { render, cleanup, screen, fireEvent, queryByAttribute, wait } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'
import { Button } from "@material-ui/core";

import EditProfile from '../uWork/components/EditProfile/EditProfile'
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as UserService from '../uWork/services/UserService'

jest.mock('../uWork/services/AuthenticationService')
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
  const fileInput = container.querySelector('input[type="file"]')

  return { getById, container, photoInput, nameInput, lastInput, submitBtn, fileInput }
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
      UserService.getUserDataById.mockResolvedValue({ data: jest.fn(() => { return { photoURL: 'photo', firstName: '', lastName: '' } }) })
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
      expect(getById(container, 'user-surname-helper-text')).not.toBe(null)
      expect(getById(container, 'user-surname-helper-text')).toHaveTextContent("Apellido requerido!")
    })
  })
  it('does not trigger validation on correct values and enables button', async () => {
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    UserService.getUserData.mockResolvedValue({ data: jest.fn(() => undefined) })
    const { container, nameInput, lastInput, submitBtn, getById } = setUp()

    fireEvent.change(nameInput, { target: { value: 'Matías' } })
    fireEvent.change(lastInput, { target: { value: 'Giménez' } })

    await wait(() => {
      expect(getById(container, 'user-name-helper-text')).not.toHaveTextContent()
      expect(getById(container, 'user-surname-helper-text')).not.toHaveTextContent()
      expect(submitBtn).not.toBeDisabled()
    })
  })
  it('triggers update profile and shows success snack bar', async () => {
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    UserService.getUserData.mockResolvedValue({ data: jest.fn(() => undefined) })
    UserService.updateUser.mockResolvedValue(undefined)
    AuthenticationService.updateProfilePhoto.mockResolvedValue(undefined)

    const { container, nameInput, lastInput, photoInput, submitBtn, getById } = setUp()

    fireEvent.change(nameInput, { target: { value: 'Matías' } })
    fireEvent.change(lastInput, { target: { value: 'Giménez' } })
    fireEvent.change(photoInput, { target: { value: 'newphoto' } })

    await wait(() => {
      fireEvent.click(submitBtn)
    })

    expect(getById(container, "edit-profile-success")).not.toBe(null)
    expect(getById(container, "edit-profile-success")).toHaveTextContent("Datos guardados!")
    expect(UserService.updateUser).toHaveBeenCalled()
    expect(AuthenticationService.updateProfilePhoto).toHaveBeenCalled()
  })
  it('show error snack bar when update profile fails', async () => {
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    UserService.getUserData.mockResolvedValue({ 
      data: jest.fn(() => undefined) })
    UserService.updateUser.mockRejectedValue(undefined)

    const { container, nameInput, lastInput, photoInput, submitBtn, getById } = setUp()
    
    fireEvent.change(nameInput, { target: { value: 'Matías' } })
    fireEvent.change(lastInput, { target: { value: 'Giménez' } })
    fireEvent.change(photoInput, { target: { value: 'newphoto' } })

    await wait(() => {
      fireEvent.click(submitBtn)
    })

    expect(getById(container, "edit-profile-error")).not.toBe(null)
    expect(getById(container, "edit-profile-error")).toHaveTextContent("Error al guardar los datos.")
    expect(UserService.updateUser).toHaveBeenCalled()
  })
  it('let you upload a profile picture', async () => {
    const values = { firstName: 'Mati', lastName: 'Gimenez', photoURL: 'file/imagen' }
    const file = new File(["hello"], "hello.png", { type: "image/png" })
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    UserService.getUserData.mockResolvedValue({
      data: jest.fn(() => values)
    })
    UserService.updateUser.mockResolvedValue(undefined)
    const { fileInput, submitBtn } = setUp()

    await wait(() => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    await wait(() => {
      expect(fileInput.files[0]).toStrictEqual(file)
      expect(fileInput.files).toHaveLength(1)
      expect(submitBtn).not.toBeDisabled()
    })
  })
})