import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import UWorkApp from '../uWork/uWork'
import { mount, configure } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Login from '../uWork/components/Login/Login';
import Register from '../uWork/components/Register/Register'
import Adapter from 'enzyme-adapter-react-16';
import Dashboard from '../uWork/components/Dashboard/Dashboard'
//import mocksdk from '../__mocks__/firebase'
import { fire, auth, db, storage } from '../uWork/services/firebase/setup'

// Now mock 'firebase/app`:
/* jest.mock('firebase/app', () => {
  const firebasemock = require('firebase-mock')
  const mockauth = new firebasemock.MockAuthentication()
  const mockfirestore = new firebasemock.MockFirestore()
  return new firebasemock.MockFirebaseSdk(
    null, // RTDB
    () => mockauth, 
    () => mockfirestore
  )
}) */

jest.mock(
  '../uWork/services/firebase/setup',
  () => { 
    var mocksdk = require.requireActual('../__mocks__/firebase').default
    return mocksdk
  }
);

configure({ adapter: new Adapter() });

afterEach(cleanup)

describe('uWorkApp', () => {
  it('renders correctly', () => {
    render(<MemoryRouter><UWorkApp /></MemoryRouter>)
  })

  it('should show Login component when path is /', () => {
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
  })

  describe('when user is logged in', () => {
    beforeEach(() => {
      auth().currentUser = {
        uid: '10123012'
      }
    });

    /* it('should render Dashboard component when path is /dashboard', () => {
    
      const component = mount(
        <MemoryRouter initialEntries={['/dashboard']}>
          <UWorkApp />
        </MemoryRouter>
      );
      screen.debug()
      expect(component.find(Dashboard)).toHaveLength(1);
    }) */
  })
});