import React from 'react'
import { render, cleanup, queryByAttribute, wait } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { createMuiTheme, MenuItem, MuiThemeProvider } from "@material-ui/core";
import Dashboard from '../uWork/components/Dashboard/Dashboard'
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as MateriasService from '../uWork/services/MateriasService'
import CardSubject from '../uWork/components/Subject/CardSubject'
import LinealLoading from '../uWork/components/LoadingPage/LinealLoading'
import AddSubject from '../uWork/components/Dashboard/AddSubject'

jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')

configure({ adapter: new Adapter() })

afterEach(cleanup)

const SizeWrapper = (props) => {
  const theme = createMuiTheme({
    props: { MuiWithWidth: { initialWidth: props.size } },
  })

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export const customRender = (ui, options) => {
  return render(ui, {
    wrapper: (props) => <SizeWrapper {...props} {...options} />
  })
}

describe('Dashboard', () => {
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

  it('has an Alert', async () => {
    const getById = queryByAttribute.bind(null, 'id')
    const { container } = customRender(<Dashboard />, { size: 'lg' })
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValueOnce([])
    
    let alert
    await wait(() => {
      alert = getById(container, "guide-alert")
    })
    expect(alert).not.toBe(null)
    expect(alert).toHaveTextContent("No tenés materias asignadas! Para agregar tu primer materia hacé click en el botón '+' de abajo a la derecha")
    expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalled()
  })
  it('has a floating button on xs and sm width', async () => {
    let floatingButton
    let c
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValueOnce([])

    c = customRender(<Dashboard />, { size: 'xs' })      
    await wait(() => {
      floatingButton = c.container.querySelector('button[title="Agregar Materia"]')
    })
    expect(floatingButton).not.toBe(null)

    c = customRender(<Dashboard />, { size: 'sm' })      
    await wait(() => {
      floatingButton = c.container.querySelector('button[title="Agregar Materia"]')
    })
    expect(floatingButton).not.toBe(null)

    expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalled()
  })
  it('has a button on md and lg width', async () => {
    let button
    let c
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValueOnce([])
    c = customRender(<Dashboard />, { size: 'md' })

    await wait(() => {
      button = c.container.querySelector('button[label="Agregar Materia"]')
    })
    expect(button).not.toBe(null)
    expect(button).toHaveTextContent("Agregar Materia")

    c = customRender(<Dashboard />, { size: 'lg' })
    await wait(() => {
      button = c.container.querySelector('button[label="Agregar Materia"]')
    })
    expect(button).not.toBe(null)
    expect(button).toHaveTextContent("Agregar Materia")

    expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalled()
  })
  it('opens AddSubject modal when "Agregar Materia" button is clicked', async () => {
    const theme = createMuiTheme({
      props: { MuiWithWidth: { initialWidth: 'md' } },
    })
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValue([])
    const wrapper = mount(<MemoryRouter><MuiThemeProvider theme={theme}><Dashboard /></MuiThemeProvider></MemoryRouter>)

    await wait(() => {
      wrapper.update()
      wrapper.find('button[label="Agregar Materia"]').simulate('click')
    })

    await wait(() => {
      wrapper.update()
      expect(wrapper.find(AddSubject)).toHaveLength(1)
    })
  })
  it('opens AddSubject modal when "Agregar Materia" floating button is clicked', async () => {
    const theme = createMuiTheme({
      props: { MuiWithWidth: { initialWidth: 'sm' } },
    })
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValue([])
    const wrapper = mount(<MemoryRouter><MuiThemeProvider theme={theme}><Dashboard /></MuiThemeProvider></MemoryRouter>)

    await wait(() => {
      wrapper.update()
      wrapper.find('button[title="Agregar Materia"]').simulate('click')
    })

    await wait(() => {
      wrapper.update()
      expect(wrapper.find(AddSubject)).toHaveLength(1)
    })
  })
  it('has a CardSubject when a subject is added', async () => {
    const materias = [
      {
        materiaId: '123',
        carrera: 'Licenciatura en Informatica',
        nombre: 'Tecnologia Aplicada',
        link: 'link'
      }
    ]
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValueOnce(materias)
    const wrapper = mount(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(wrapper.find(LinealLoading)).toHaveLength(1)
    await wait(() => {
      wrapper.update()
      expect(wrapper.find('#grid-task')).not.toBe(null)
      expect(wrapper.find(CardSubject)).toHaveLength(1)
      expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
      expect(MateriasService.getSubjects).toHaveBeenCalled()
      expect(MateriasService.getSubjects).toHaveBeenCalledWith('id')
    })
  })
  it('subject cards has "Eliminar" option when user is admin', async () => {
    const materias = [
      {
        materiaId: '123',
        carrera: 'Licenciatura en Informatica',
        nombre: 'Tecnologia Aplicada',
        link: 'link'
      },
      {
        materiaId: '456',
        carrera: 'Licenciatura en Informatica',
        nombre: 'Matemática Discreta',
        link: 'link'
      }
    ]
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValueOnce(materias)
    MateriasService.verifyAdmin.mockResolvedValue(true)
    const wrapper = mount(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(wrapper.find(LinealLoading)).toHaveLength(1)
    await wait(() => {
      wrapper.update()
      expect(wrapper.find('#grid-task')).not.toBe(null)
      expect(wrapper.find(CardSubject)).toHaveLength(2)
      expect(wrapper.find(CardSubject).at(0).find(MenuItem).getDOMNode()).toHaveTextContent("Eliminar")
      expect(wrapper.find(CardSubject).at(1).find(MenuItem).getDOMNode()).toHaveTextContent("Eliminar")
    })

    expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalledWith('id')
    expect(MateriasService.verifyAdmin).toHaveBeenCalled()
  })
  it('subject cards has "Salir" option when user is not admin', async () => {
    const materias = [
      {
        materiaId: '123',
        carrera: 'Licenciatura en Informatica',
        nombre: 'Tecnologia Aplicada',
        link: 'link'
      },
      {
        materiaId: '456',
        carrera: 'Licenciatura en Informatica',
        nombre: 'Matemática Discreta',
        link: 'link'
      }
    ]
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValueOnce(materias)
    MateriasService.verifyAdmin.mockResolvedValue(false)
    const wrapper = mount(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(wrapper.find(LinealLoading)).toHaveLength(1)
    await wait(() => {
      wrapper.update()
      expect(wrapper.find('#grid-task')).not.toBe(null)
      expect(wrapper.find(CardSubject)).toHaveLength(2)
      expect(wrapper.find(CardSubject).at(0).find(MenuItem).getDOMNode()).toHaveTextContent("Salir")
      expect(wrapper.find(CardSubject).at(1).find(MenuItem).getDOMNode()).toHaveTextContent("Salir")
    })

    expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalledWith('id')
    expect(MateriasService.verifyAdmin).toHaveBeenCalled()
  })
  it('subject cards has "Salir" and "Eliminar" option when its appropriate', async () => {
    const materias = [
      {
        materiaId: '123',
        carrera: 'Licenciatura en Informatica',
        nombre: 'Tecnologia Aplicada',
        link: 'link'
      },
      {
        materiaId: '456',
        carrera: 'Licenciatura en Informatica',
        nombre: 'Matemática Discreta',
        link: 'link'
      }
    ]
    AuthenticationService.getSessionUserId.mockReturnValue('id')
    MateriasService.getSubjects.mockResolvedValueOnce(materias)
    MateriasService.verifyAdmin.mockResolvedValue(false).mockResolvedValueOnce(true)
    const wrapper = mount(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(wrapper.find(LinealLoading)).toHaveLength(1)
    await wait(() => {
      wrapper.update()
      expect(wrapper.find('#grid-task')).not.toBe(null)
      expect(wrapper.find(CardSubject)).toHaveLength(2)
      expect(wrapper.find(CardSubject).at(0).find(MenuItem).getDOMNode()).toHaveTextContent("Eliminar")
      expect(wrapper.find(CardSubject).at(1).find(MenuItem).getDOMNode()).toHaveTextContent("Salir")
    })

    expect(AuthenticationService.getSessionUserId).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalled()
    expect(MateriasService.getSubjects).toHaveBeenCalledWith('id')
    expect(MateriasService.verifyAdmin).toHaveBeenCalled()
  })
}) 
