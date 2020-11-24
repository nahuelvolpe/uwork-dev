import React from 'react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16'
import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'
import { Button, Alert } from "@material-ui/core";
import Dashboard from '../uWork/components/Dashboard/Dashboard'
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as MateriasService from '../uWork/services/MateriasService'
import * as UserService from '../uWork/services/UserService'
import LinealLoading from '../uWork/components/LoadingPage/LinealLoading'



jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')
jest.mock('../uWork/services/UserService')

configure({ adapter: new Adapter() })

afterEach(cleanup)

const setUp = () => {
  const getById = queryByAttribute.bind(null, 'id')
  const { container } = render(<MemoryRouter><Dashboard/></MemoryRouter>)
  const buttonLarge = container.querySelector('button[label="Agregar Materia"]')
  const buttonIcon = container.querySelector('button[label="Add Subject"]')

  return { getById, container, buttonLarge, buttonIcon }
}

describe('Dashboard', () => {
  describe('When user is register', () => {
    it('should renders Dashboard correctly', async () => {
      jest.setTimeout(10000)
      AuthenticationService.getSessionUserId.mockReturnValue('id')
      MateriasService.getSubjects.mockResolvedValue([])
      const wrapper = mount(<MemoryRouter><Dashboard /></MemoryRouter>)
      await wait(() => {
        expect(wrapper.find(Dashboard)).toHaveLength(1)
        expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
        expect(MateriasService.getSubjects).toHaveBeenCalled()
        expect(MateriasService.getSubjects).toHaveBeenCalledWith('id')
      })
    })

    /* it('has a Alert and a Button', async () => {
      jest.setTimeout(20000)
      AuthenticationService.getSessionUserId.mockReturnValue('id')
      MateriasService.getSubjects.mockResolvedValue([])
      const wrapper = render(<MemoryRouter><Dashboard /></MemoryRouter>)

      await wait(() => {
        expect(wrapper.find(Button)).toHaveLength(1)
        expect(wrapper.find(Alert)).toHaveLength(1)
      })
    }) */  
  })
}) 
