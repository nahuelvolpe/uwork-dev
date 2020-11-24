import React from 'react'
import '@testing-library/react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { AuthContext, AuthContextProvider } from '../uWork/context/auth'

import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'
import { Button } from "@material-ui/core";

import EditProfile from '../uWork/components/EditProfile/EditProfile'
import AppRouter from '../uWork/routers/AppRouter';
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as MateriasService from '../uWork/services/MateriasService'
import * as UserService from '../uWork/services/UserService'
import { PrivateRoute } from '../uWork/routers/PrivateRoute';
import Layout from '../uWork/components/Layout/Layout';

jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')
jest.mock('../uWork/services/UserService')

configure({ adapter: new Adapter() })

afterEach(cleanup)

describe('EditProfile', () => {

    /* let wrapper
    beforeEach(() => {
        jest.setTimeout(10000)
        const context = {
            authReady: true
        }
        AuthenticationService.getCurrentUser.mockReturnValue({ uid: 'id' })
        AuthenticationService.getSessionUserId.mockReturnValue('id')
        UserService.getUserDataById.mockResolvedValue({ photoURL: 'photo', firstName: '', lastName: '', uid: 'id', email: 'email', materias: {} })
        wrapper = renderAppRouter('/edit_profile', context)
    }) */

    describe('When user is register', () => {

    it('should renders correctly Layout and EditProfile', async () => {
      jest.setTimeout(10000)
      const context = {
        authReady: true
      }
      AuthenticationService.getCurrentUser.mockReturnValue({ uid: 'id' })
      AuthenticationService.getSessionUserId.mockReturnValue('id')
      UserService.getUserDataById.mockResolvedValue({ photoURL: 'photo', firstName: '', lastName: '', uid: 'id', email: 'email', materias: {} })
      const wrapper = renderAppRouter('/edit_profile', context)
      await wait(() => {
        expect(wrapper.find(PrivateRoute)).toHaveLength(3)
        expect(wrapper.find(Layout)).toHaveLength(1)
        expect(wrapper.find(EditProfile)).toHaveLength(1)
      })
      expect(AuthenticationService.getCurrentUser).toHaveBeenCalled()
      expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
      expect(UserService.getUserDataById).toHaveBeenCalled()
      expect(UserService.getUserDataById).toHaveBeenCalledWith('id')
    })

    it('has a Formik Form, three FormikField and a Button', () => {
        jest.setTimeout(10000)
        const context = {
            authReady: true
        }
        AuthenticationService.getCurrentUser.mockReturnValue({ uid: 'id' })
        AuthenticationService.getSessionUserId.mockReturnValue('id')
        UserService.getUserDataById.mockResolvedValue({ photoURL: 'photo', firstName: '', lastName: '', uid: 'id', email: 'email', materias: {} })
        const wrapper = renderAppRouter('/edit_profile', context)
        expect(wrapper.find(Formik)).toHaveLength(1)
        expect(wrapper.find(Form)).toHaveLength(1)
        expect(wrapper.find(FormikField)).toHaveLength(3)
        expect(wrapper.find(Button)).toHaveLength(1)
      })

  })

})


function renderAppRouter(route, state) {
    return mount(
      <MemoryRouter initialEntries={[route]}>
        <AuthContext.Provider value={state}>
          <AppRouter />
        </AuthContext.Provider>
      </MemoryRouter>
    )
  }