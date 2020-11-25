import React from 'react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure } from 'enzyme'
import { act } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16'
import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'
import { Button, Alert } from "@material-ui/core";
import Subject from '../uWork/components/Subject/Subject'
import AuthenticationService from '../uWork/services/AuthenticationService'
import * as MateriasService from '../uWork/services/MateriasService'
import * as TaskService from '../uWork/services/TaskService'


jest.mock('../uWork/services/AuthenticationService')
jest.mock('../uWork/services/MateriasService')
jest.mock('../uWork/services/UserService')
jest.mock('../uWork/services/TaskService')

configure({ adapter: new Adapter() })

afterEach(cleanup)

const setUp = () => {
  const getById = queryByAttribute.bind(null, 'id')
  const { container } = render(<MemoryRouter><Subject/></MemoryRouter>)
  const buttonAddTarea = container.querySelector('button[label="Agregar Tarea"]')
  const buttonAddColab = container.querySelector('button[label="Añadir Colaborador"]')

  return { getById, container, buttonAddTarea, buttonAddColab }
}

describe('Subject', () => {
  describe('When user is register', () => {

    it('should renders Subject correctly', async () => {
      /* jest.setTimeout(10000)
      MateriasService.getSubjectById.mockResolvedValue({materiaId: 'id', carrera: 'carrera', nombre: 'nombre', roles: {id: 'rol'}, link:'link', tarea:{id: 'url'}})
      TaskService.getTasks.mockResolvedValue([]);
      const wrapper = mount(<MemoryRouter><Subject /></MemoryRouter>)
      await wait(() => {
        expect(wrapper.find(Subject)).toHaveLength(1)
        expect(MateriasService.getSubjectById).toHaveBeenCalled()
        expect(TaskService.getTasks).toHaveBeenCalled()
<<<<<<< HEAD
      })
    }) */ 
=======
      }) */
    })
>>>>>>> 82f7f02e867c365ed2d199fafca4c9622f1fa793

  })
}) 