import React from 'react'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { wait } from '@testing-library/react'
import AlertDialog from '../uWork/components/Dashboard/AlertDialog'
import { DialogContentText } from '@material-ui/core'
import AdornedButton from '../uWork/components/AdornedButton/AdornedButton'
import * as MateriasService from '../uWork/services/MateriasService'

configure({ adapter: new Adapter() })

jest.mock('../uWork/services/AuthenticationService', () => {
  return {
    getSessionUserId: jest.fn(() => 'id')
  }
})
jest.mock('../uWork/services/MateriasService')

describe('Alert dialog modal', () => {
  let wrapper
  const setOpen = jest.fn()
  const subjectId = 'materiaId'
  const acceptHandler = jest.fn()
  const errorHandler = jest.fn()
  beforeEach(() => {
    wrapper = mount(<AlertDialog
      open
      setOpen={setOpen}
      subjectId={subjectId}
      acceptHandler={acceptHandler}
      errorHandler={errorHandler}
      />)
  })
  afterEach(() => {
    wrapper.unmount()
  })
  it('renders correctly', () => {
    expect(wrapper.find(AlertDialog).exists()).toBeTruthy()
  })

  it('has dialog text content', () => {
    expect(wrapper.find(DialogContentText).getDOMNode()).toHaveTextContent("Posiblemente haya colaborares en esta matería y se eliminará tambien de sus cuentas.¿Está seguro que desea eliminarla?")
  })

  it('has a confirmation button', () => {
    expect(wrapper.find(AdornedButton).exists()).toBeTruthy()
    expect(wrapper.find(AdornedButton)).toHaveLength(1)
    expect(wrapper.find(AdornedButton).getDOMNode()).toHaveTextContent("Eliminar")
  })
  it('triggers subject deletion on click', async () => {
    MateriasService.deleteMateriaAdmin.mockResolvedValue()

    await wait(() => {
      wrapper
        .find(AdornedButton)
        .at(0)
        .props()
        .onClick()
    })

    expect(MateriasService.deleteMateriaAdmin).toHaveBeenCalled()
    expect(MateriasService.deleteMateriaAdmin).toHaveBeenCalledTimes(1)
    expect(MateriasService.deleteMateriaAdmin).toHaveBeenCalledWith(subjectId, 'id')
    expect(setOpen).toHaveBeenCalled()
    expect(acceptHandler).toHaveBeenCalled()
  })
  it('triggers error handler when delete failed', async () => {
    MateriasService.deleteMateriaAdmin.mockRejectedValue()

    await wait(() => {
      wrapper
        .find(AdornedButton)
        .at(0)
        .props()
        .onClick()
    })

    expect(MateriasService.deleteMateriaAdmin).toHaveBeenCalled()
    expect(MateriasService.deleteMateriaAdmin).toHaveBeenCalledWith(subjectId, 'id')
    expect(setOpen).toHaveBeenCalled()
    expect(errorHandler).toHaveBeenCalled()
  })
})