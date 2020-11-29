import React from 'react'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { wait } from '@testing-library/react'
import AddSubject from '../uWork/components/Dashboard/AddSubject'
import { Dialog, Select } from '@material-ui/core'
import AdornedButton from '../uWork/components/AdornedButton/AdornedButton'
import * as UserService from '../uWork/services/UserService'
import * as MateriasService from '../uWork/services/MateriasService'
import CustomizedSnackbars from '../uWork/components/CustomSnackBar/CustomSnackBar'

jest.mock('../uWork/services/AuthenticationService', () => {
  return {
    getSessionUserId: jest.fn(() => 'id')
  }
})

jest.mock('../uWork/services/UserService')
jest.mock('../uWork/services/MateriasService')

configure({ adapter: new Adapter() })

describe('AddSubject component', () => {
  it('renders correctly', () => {
    const wrapper = mount(<AddSubject open />)
    expect(wrapper.find(AddSubject).exists()).toBeTruthy()
  })
  it('renders a Dialog', () => {
    const wrapper = mount(<AddSubject open />)
    expect(wrapper.find(Dialog).exists()).toBeTruthy()
    expect(wrapper.find(Dialog)).toHaveLength(1)
  })
  it('renders two Select components', () => {
    const wrapper = mount(<AddSubject open />)
    expect(wrapper.find(Select).exists()).toBeTruthy()
    expect(wrapper.find(Select)).toHaveLength(2)
  })
})
describe('AddSubject Form', () => {
  it('career and subject select update with values', async () => {
    jest.setTimeout(10000)
    const career = { "id": 1, "description": "Licenciatura en Informática" }
    const subject = {
      "id": 1,
      "career": 1,
      "description": "Tecnología Aplicada",
      "link": "https://forouno.org/forumdisplay.php?fid=197"
    }
    const wrapper = mount(<AddSubject open />)
    
    await wait (() => {
      wrapper
        .find(Select)
        .at(0)
        .props()
        .onChange({ target: { value: career } })
      wrapper
        .find(Select)
        .last()
        .props()
        .onChange({ target: { value: subject } })
    })
    
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Select).at(0).props().value).toStrictEqual(career)
      expect(wrapper.find(Select).last().props().value).toStrictEqual(subject)
    })
  })
  it('has a submit button and its disabled', async () => {
    const wrapper = mount(<AddSubject open />)
    await wait (() => {
      expect(wrapper.find(AdornedButton).exists()).toBeTruthy()
      expect(wrapper.find(AdornedButton).getDOMNode()).toHaveTextContent("Aceptar")
      expect(wrapper.find(AdornedButton)).toHaveLength(1)
      expect(wrapper.find(AdornedButton).props().disabled).toBeTruthy()
    })
  })
  it('submits when its filled', async () => {
    jest.setTimeout(10000)
    const acceptHandler = jest.fn()
    const setOpen = jest.fn()
    UserService.existSubject.mockReturnValue(false)
    UserService.updateUser.mockResolvedValue()
    MateriasService.createSubject.mockResolvedValue({ id: 'materiaId' })
    MateriasService.getSubjectById.mockResolvedValue({})
    const career = { "id": 1, "description": "Licenciatura en Informática" }
    const subject = {
      "id": 1,
      "career": 1,
      "description": "Tecnología Aplicada",
      "link": "https://forouno.org/forumdisplay.php?fid=197"
    }
    const wrapper = mount(<AddSubject open setOpen={setOpen} acceptHandler={acceptHandler} />)
    
    await wait (() => {
      wrapper
        .find(Select)
        .at(0)
        .props()
        .onChange({ target: { value: career } })
      wrapper
        .find(Select)
        .last()
        .props()
        .onChange({ target: { value: subject } })
    })

    await wait(() => {
      wrapper.update()
      wrapper.find(AdornedButton).at(0).props().onClick()
    })

    await wait(() => {
      wrapper.update()
    })

    expect(UserService.existSubject).toHaveBeenCalled()
    expect(UserService.updateUser).toHaveBeenCalled()
    expect(MateriasService.createSubject).toHaveBeenCalled()
    expect(MateriasService.getSubjectById).toHaveBeenCalled()
    expect(acceptHandler).toHaveBeenCalled()
    expect(setOpen).toHaveBeenCalled()
  })
  it('shows error when same subject is already created', async () => {
    jest.setTimeout(10000)
    UserService.existSubject.mockReturnValue(true)
    const career = { "id": 1, "description": "Licenciatura en Informática" }
    const subject = {
      "id": 1,
      "career": 1,
      "description": "Tecnología Aplicada",
      "link": "https://forouno.org/forumdisplay.php?fid=197"
    }
    const wrapper = mount(<AddSubject open />)
    await wait (() => {
      wrapper
        .find(Select)
        .at(0)
        .props()
        .onChange({ target: { value: career } })
      wrapper
        .find(Select)
        .last()
        .props()
        .onChange({ target: { value: subject } })
    })

    await wait(() => {
      wrapper.update()
      wrapper.find(AdornedButton).at(0).props().onClick()
      expect(wrapper.find(CustomizedSnackbars).props().open).toBeTruthy()
      expect(wrapper.find(CustomizedSnackbars).getDOMNode()).toHaveTextContent("La materia seleccionada ya existe dentro de sus materias.")
    })
  })
})