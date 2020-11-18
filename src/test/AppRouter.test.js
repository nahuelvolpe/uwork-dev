import React from 'react';
import { render, cleanup, screen, wait } from '@testing-library/react';
import { configure, mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Adapter from 'enzyme-adapter-react-16';
import AppRouter from '../uWork/routers/AppRouter';
import { AuthContext, AuthContextProvider } from '../uWork/context/auth'
import Login from '../uWork/components/Login/Login'
import Register from '../uWork/components/Register/Register'
import { PublicRoute } from '../uWork/routers/PublicRoute'
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as MateriasService from '../uWork/services/MateriasService'
import { PrivateRoute } from '../uWork/routers/PrivateRoute';
import Dashboard from '../uWork/components/Dashboard/Dashboard';
import Layout from '../uWork/components/Layout/Layout';

jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')

configure({ adapter: new Adapter() });

afterEach(cleanup)

describe('App Router', () => {

  it('should render correctly', () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <AppRouter />
        </AuthContextProvider>
      </MemoryRouter>
    )
  })

  it('should render Public Route and Login component when path is /', () => {
    const context = {
      authReady: true
    }
    const wrapper = renderAppRouter('/', context)
    expect(wrapper.find(PublicRoute)).toHaveLength(1);
    expect(wrapper.find(Login)).toHaveLength(1);
  })

  it('should render Public Route and Login component when path is /login', () => {
    const context = {
      authReady: true
    }
    const wrapper = renderAppRouter('/login', context)
    expect(wrapper.find(PublicRoute)).toHaveLength(1);
    expect(wrapper.find(Login)).toHaveLength(1);
  })

  it('should render Public Route and Register component when path is /register', () => {
    const context = {
      authReady: true
    }
    const wrapper = renderAppRouter('/register', context)
    expect(wrapper.find(PublicRoute)).toHaveLength(1);
    expect(wrapper.find(Register)).toHaveLength(1);
  })

  describe('When user is logged', () => {
    beforeEach(() => {
      /* jest.mock('../uWork/services/AuthenticationService', () => {
        return jest.fn().mockImplementation(() => {
          return {getCurrentUser: jest.fn(() => true)};
        });
      }); */
    })

    it('should render Private Route', async () => {
      jest.setTimeout(10000)
      const context = {
        authReady: true
      }
      AuthenticationService.getCurrentUser.mockReturnValue({ uid: 'id' })
      MateriasService.getSubjects.mockResolvedValue([{ materiaId: 'asdasd' }])
      const wrapper = renderAppRouter('/dashboard', context)
      await wait(() => {
        expect(wrapper.find(PrivateRoute)).toHaveLength(3)
        expect(wrapper.find(Layout)).toHaveLength(1)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
      expect(AuthenticationService.getCurrentUser).toHaveBeenCalled()
      expect(MateriasService.getSubjects).toHaveBeenCalled()
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