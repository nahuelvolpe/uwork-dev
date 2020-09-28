import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { configure, mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Adapter from 'enzyme-adapter-react-16';
import AppRouter from '../uWork/routers/AppRouter';
import { AuthContext, AuthContextProvider } from '../uWork/context/auth'
import Login from '../uWork/components/Login/Login'
import Register from '../uWork/components/Register/Register'
import { PublicRoute } from '../uWork/routers/PublicRoute';

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

  it('should render Private Route and Register component when path is /register', () => {
    const context = {
      authReady: true
    }
    const wrapper = renderAppRouter('/register', context)
    expect(wrapper.find(PublicRoute)).toHaveLength(1);
    expect(wrapper.find(Register)).toHaveLength(1);
  })

  /* it('should show Login component when path is /', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <AuthContextProvider>
          <AppRouter />
        </AuthContextProvider>
      </MemoryRouter>
    );
    //expect(wrapper.find(Login)).toHaveLength(1);
  }); */

  /* it('should show Login component when path is /login', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/login']}>
        <AuthContextProvider>
          <AppRouter />
        </AuthContextProvider>
      </MemoryRouter>
    );
    expect(component.find(Login)).toHaveLength(1);
  })

  it('should show Register component when path is /register', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/register']}>
        <AuthContextProvider>
          <AppRouter />
        </AuthContextProvider>
      </MemoryRouter>
    );
    expect(component.find(Register)).toHaveLength(1);
  }) */

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