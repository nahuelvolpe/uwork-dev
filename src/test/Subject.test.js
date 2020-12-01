import React from 'react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MuiThemeProvider, createMuiTheme, Button, IconButton, Paper, AppBar, Tabs, Tab } from "@material-ui/core";
import Subject, { TabPanel } from '../uWork/components/Subject/Subject'
import { SubjectContext, SubjectProvider } from '../uWork/context/subject'
import * as MateriasService from '../uWork/services/MateriasService'
import * as TaskService from '../uWork/services/TaskService'
import * as UserService from '../uWork/services/UserService'
import LinealLoading from '../uWork/components/LoadingPage/LinealLoading'
import { Close } from '@material-ui/icons'
import CardTask from '../uWork/components/Task/CardTask'
import Task from '../uWork/components/Task/Task'
import Invite from '../uWork/components/Subject/Invite'

jest.mock('../uWork/components/Task/Task', () => () => 'Task')
jest.mock('../uWork/components/Subject/Invite', () => () => 'Invite')
jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')
jest.mock('../uWork/services/UserService')
jest.mock('../uWork/services/TaskService')

configure({ adapter: new Adapter() })

afterEach(cleanup)

const materiaMock = {
  materiaId: 'id',
  carrera: 'carrera',
  nombre: 'nombre',
  roles: {
    id: 'admin'
  },
  link: 'link',
  tarea: {
    id: 'pendiente'
  }
}

const tasks = [
  {
    tareaId: '1',
    colaboradores: {},
    descripcion: "",
    estado: "pendiente",
    fechaLimite: new Date(),
    titulo: 'Titulo 1'
  },
  {
    tareaId: '2',
    colaboradores: {},
    descripcion: "",
    estado: "pendiente",
    fechaLimite: new Date(),
    titulo: 'Titulo 2'
  }
]

const oneAndOneTasks = [
  {
    tareaId: '1',
    colaboradores: {},
    descripcion: "",
    estado: "pendiente",
    fechaLimite: new Date(),
    titulo: 'Titulo 1'
  },
  {
    tareaId: '2',
    colaboradores: {},
    descripcion: "",
    estado: "finalizada",
    fechaLimite: new Date(),
    titulo: 'Titulo 2'
  }
]

const context = {
  subjectName: 'Materia',
  subjectId: 'materiaId',
  setSubjectName: jest.fn(),
  setSubjectId: jest.fn()
}

describe('Subject component', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders correctly', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      expect(wrapper.find(Subject).exists()).toBeTruthy()
      expect(MateriasService.getSubjectById).toHaveBeenCalled()
      expect(TaskService.getTasks).toHaveBeenCalled()
    }) 
  })
  it('when searching tasks shows lineal loading', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      expect(wrapper.find(LinealLoading).exists()).toBeTruthy()
      expect(wrapper.find(LinealLoading).getDOMNode()).toHaveTextContent("Cargando sus tareas...")
    })
  })
  it('it has two normal buttons when width is md', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Button).exists()).toBeTruthy()
      expect(wrapper.find(Button)).toHaveLength(2)
      expect(wrapper.find(Button).at(0).getDOMNode()).toHaveTextContent("Agregar Tarea")
      expect(wrapper.find(Button).at(1).getDOMNode()).toHaveTextContent("Añadir colaborador")
    })
  })
  it('it has two floating buttons when width is sm', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id', 'sm')
    await wait(() => {
      wrapper.update()      
      expect(wrapper.find(IconButton).exists()).toBeTruthy()
      expect(wrapper.find(IconButton)).toHaveLength(2)
      expect(wrapper.find(IconButton).at(0).props()['arial-label']).toBe("Agregar colaborador")
      expect(wrapper.find(IconButton).at(1).props()['arial-label']).toBe("Agregar tarea")
    })
  })
  it('has an information sign', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Paper).exists()).toBeTruthy()
      expect(wrapper.find(Paper).at(0).getDOMNode()).toHaveTextContent("Para encontrar apuntes, exámenes, trabajos prácticos y más información sobre esta materia, ingresá al foro de la UNO")
    })
  })
  it('information sign closes when click on close icon', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Close).exists()).toBeTruthy()
      wrapper.find(Close).props().onClick()
      wrapper.update()
      expect(wrapper.find(Paper).at(0).getDOMNode()).not.toHaveTextContent("Para encontrar apuntes, exámenes, trabajos prácticos y más información sobre esta materia, ingresá al foro de la UNO")
    })
  })
  it('has an AppBar and a TabPanel', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(AppBar).exists()).toBeTruthy()
      expect(wrapper.find(Tabs).exists()).toBeTruthy()
      expect(wrapper.find(TabPanel).exists()).toBeTruthy()
    })
  })
  it('has two tabs for pending and finished tasks', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Tab).exists()).toBeTruthy()
      expect(wrapper.find(Tab)).toHaveLength(2)
      expect(wrapper.find(Tab).at(0).getDOMNode()).toHaveTextContent("Tareas pendientes")
      expect(wrapper.find(Tab).at(1).getDOMNode()).toHaveTextContent("Tareas finalizadas")
    })
  })
  it('renders card task when get tasks', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue(tasks)
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(CardTask).exists()).toBeTruthy()
      expect(wrapper.find(CardTask)).toHaveLength(2)
    })
  })
  it('cards are shown in corresponding tab', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue(oneAndOneTasks)
    wrapper = renderSubject('/subject/id')
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(CardTask).exists()).toBeTruthy()
      expect(wrapper.find(Tab).at(0).props().selected).toBeTruthy()
      expect(wrapper.find(Tab).at(1).props().selected).not.toBeTruthy()
      expect(wrapper.find(CardTask)).toHaveLength(1)
      wrapper.find(Tab).at(1).props().onChange(undefined, 1)
    })
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(CardTask).exists()).toBeTruthy()
      expect(wrapper.find(Tab).at(0).props().selected).not.toBeTruthy()
      expect(wrapper.find(Tab).at(1).props().selected).toBeTruthy()
      expect(wrapper.find(CardTask)).toHaveLength(1)
    })
  })
  it('shows Task component when "Agregar Tarea" button is clicked', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue(tasks)
    wrapper = renderSubject('/subject/id')

    await wait(() => {
      wrapper.update()
      wrapper.find(Button).at(0).props().onClick()
    })
    
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Task).exists()).toBeTruthy()
    })
  })
  it('shows Invite component when "Añadir colaborador" button is clicked', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue(tasks)
    wrapper = renderSubject('/subject/id')

    await wait(() => {
      wrapper.update()
      wrapper.find(Button).at(1).props().onClick()
    })
    
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Invite).exists()).toBeTruthy()
    })
  })
  it('shows Invite component when "Añadir colaborador" floating button is clicked', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id', 'sm')

    await wait(() => {
      wrapper.update()
      wrapper.find(IconButton).at(0).props().onClick()
    })
    
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Invite).exists()).toBeTruthy()
    })
  })
  it('shows Task component when "Agregar tarea" floating button is clicked', async () => {
    MateriasService.getSubjectById.mockResolvedValue(materiaMock)
    TaskService.getTasks.mockResolvedValue([])
    wrapper = renderSubject('/subject/id', 'sm')

    await wait(() => {
      wrapper.update()
      wrapper.find(IconButton).at(1).props().onClick()
    })
    
    await wait(() => {
      wrapper.update()
      expect(wrapper.find(Task).exists()).toBeTruthy()
    })
  })
})

function renderSubject(route, size = 'md') {
  const theme = createMuiTheme({
    props: { MuiWithWidth: { initialWidth: size } },
  })
  return mount(
    <SubjectContext.Provider value={context}>
      <MuiThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>
          <Subject />
        </MemoryRouter>
      </MuiThemeProvider>
    </SubjectContext.Provider>
  )
}