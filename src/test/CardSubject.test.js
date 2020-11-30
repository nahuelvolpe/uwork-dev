import React from 'react'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { wait } from '@testing-library/react'
import CardSubject from '../uWork/components/Subject/CardSubject'
import * as MateriasService from '../uWork/services/MateriasService'
import { CardContent, IconButton, Menu, MenuItem } from '@material-ui/core'

configure({ adapter: new Adapter() })

jest.mock('../uWork/services/MateriasService')

const subject = {
  carrera: 'Licenciatura en informática',
  nombre: 'Práctica Profesional'
}

describe('Card Subject component', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders correctly', async () => {
    MateriasService.verifyAdmin.mockResolvedValue(true)
    wrapper = mount(<CardSubject data={subject} />)

    await wait(() => {
      expect(wrapper.find(CardSubject).exists()).toBeTruthy()
      expect(MateriasService.verifyAdmin).toHaveBeenCalled()
    })
  })
  it('has a menu button', async () => {
    MateriasService.verifyAdmin.mockResolvedValue(true)
    wrapper = mount(<CardSubject data={subject} />)

    await wait(() => {
      expect(wrapper.find(IconButton).exists()).toBeTruthy()
      expect(wrapper.find(IconButton)).toHaveLength(1)
      expect(MateriasService.verifyAdmin).toHaveBeenCalled()
    })
  })
  it('opens a dropdown menu when click on button', async () => {
    MateriasService.verifyAdmin.mockResolvedValue(true)
    wrapper = mount(<CardSubject data={subject} />)

    await wait(() => {
      expect(wrapper.find(Menu).exists()).toBeTruthy()
      expect(wrapper.find(Menu)).toHaveLength(1)
      wrapper.find(IconButton).simulate('click', { currentTarget: 'target' })
      expect(wrapper.find(Menu).props().anchorEl).not.toBe(null)
      expect(wrapper.find(Menu).props().open).toBeTruthy()
    })
  })
  it('shows "Eliminar" option when user is admin', async () => {
    MateriasService.verifyAdmin.mockResolvedValue(true)
    wrapper = mount(<CardSubject data={subject} />)

    await wait(() => {
      expect(wrapper.find(MenuItem).exists()).toBeTruthy()
      expect(wrapper.find(MenuItem)).toHaveLength(1)
      expect(wrapper.find(MenuItem).getDOMNode()).toHaveTextContent("Eliminar")
    })
  })
  it('shows "Salir" option when user is not admin', async () => {
    MateriasService.verifyAdmin.mockResolvedValue(false)
    wrapper = mount(<CardSubject data={subject} />)

    await wait(() => {
      expect(wrapper.find(MenuItem).exists()).toBeTruthy()
      expect(wrapper.find(MenuItem)).toHaveLength(1)
      expect(wrapper.find(MenuItem).getDOMNode()).toHaveTextContent("Salir")
    })
  })
  it('calls delete handler when clicks on "Eliminar" option', async () => {
    const deleteHandler = jest.fn()
    MateriasService.verifyAdmin.mockResolvedValue(true)
    wrapper = mount(<CardSubject data={subject} deleteHandler={deleteHandler} />)

    await wait(() => {
      wrapper.update()
      expect(wrapper.find(MenuItem).getDOMNode()).toHaveTextContent("Eliminar")
      wrapper.find(MenuItem).props().onClick(new Event('click'))
      wrapper.update()
      expect(deleteHandler).toHaveBeenCalled()
    })
  })
  it('calls exit handler when clicks on "Salir" option', async () => {
    const exitHandler = jest.fn()
    MateriasService.verifyAdmin.mockResolvedValue(false)
    wrapper = mount(<CardSubject data={subject} exitHandler={exitHandler} />)

    await wait(() => {
      wrapper.update()
      expect(wrapper.find(MenuItem).getDOMNode()).toHaveTextContent("Salir")
      wrapper.find(MenuItem).props().onClick(new Event('click'))
      wrapper.update()
      expect(exitHandler).toHaveBeenCalled()
    })
  })
  it('redirects to /subject/:id', async () => {
    const history = { push: jest.fn() }
    MateriasService.verifyAdmin.mockResolvedValue(true)
    wrapper = mount(<CardSubject data={subject} history={history} />)

    await wait(() => {
      wrapper.update()
      expect(wrapper.find(CardContent).exists()).toBeTruthy()
      wrapper.find(CardContent).props().onClick()
      wrapper.update()
      expect(history.push).toHaveBeenCalled()
    })
  })
})