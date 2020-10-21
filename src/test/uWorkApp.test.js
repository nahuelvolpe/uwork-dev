import React from 'react';
import { render, cleanup } from '@testing-library/react';
import UWorkApp from '../uWork/uWork'
import { configure } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Adapter from 'enzyme-adapter-react-16';
import AppRouter from '../uWork/routers/AppRouter';
import { AuthContextProvider } from '../uWork/context/auth'

configure({ adapter: new Adapter() });

afterEach(cleanup)

describe('uWorkApp', () => {

  it('renders correctly', () => {
    render(<MemoryRouter><UWorkApp /></MemoryRouter>)
  })

  it('renders App Router component correctly', () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <AppRouter />
        </AuthContextProvider>
      </MemoryRouter>
    )
  })

  /* it('should show Login component when path is /', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <UWorkApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Login)).toHaveLength(1);
  });

  it('should show Login component when path is /login', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/login']}>
        <UWorkApp />
      </MemoryRouter>
    );
    expect(component.find(Login)).toHaveLength(1);
  })

  it('should show Register component when path is /register', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/register']}>
        <UWorkApp />
      </MemoryRouter>
    );
    expect(component.find(Register)).toHaveLength(1);
  }) */

});