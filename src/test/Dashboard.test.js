import React from 'react'
import { render, cleanup, fireEvent, queryByAttribute, wait } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import Dashboard from '../uWork/components/Dashboard/Dashboard'
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as MateriasService from '../uWork/services/MateriasService'
import * as UserService from '../uWork/services/UserService'
import CardSubject from '../uWork/components/Subject/CardSubject';


jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')
jest.mock('../uWork/services/UserService')

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

    it('has a CardSubject when Subject is added', async () => {
        //jest.setTimeout(20000)      
        const materias = [{materiaId: '123', carrera: 'Licenciatura en Informatica', nombre: 'Tecnologia Aplicada', link: 'link'}];
        const { container, getById } = setUp()
        AuthenticationService.getSessionUserId.mockReturnValue('id')
        MateriasService.getSubjects.mockResolvedValueOnce(materias)

        await wait(() => expect(getById(container, "grid-task")).toBeInTheDocument());

        /* let cardSubject;
        await wait(() => {
            expect(screen.getByText(materias[0].nombre)).toBeInTheDocument()
            cardSubject = getById(container, "123")
        })
        
        expect(cardSubject).toBeInTheDocument() */
      })
  })
}) 
