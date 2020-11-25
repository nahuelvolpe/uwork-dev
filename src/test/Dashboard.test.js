import React from 'react'
import { render, cleanup, screen, fireEvent, wait, queryByAttribute } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mount, configure, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16'
import FormikField from '../uWork/components/FormikField/FormikField'
import { Form, Formik } from 'formik'
import { Button, Alert } from "@material-ui/core";
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

    it('has a Alert and a Button', async () => {
      //jest.setTimeout(20000)
      const { container, getById } = setUp()
      AuthenticationService.getSessionUserId.mockReturnValue('id')
      MateriasService.getSubjects.mockResolvedValueOnce([])
      //const { container } = render(/* <MemoryRouter> */<Dashboard />/* </MemoryRouter> */)
      let alert
      await wait(() => {
        alert = getById(container, "guide-alert")
      })
      expect(alert).toHaveTextContent("No tenés materias asignadas! Para agregar tu primer materia hacé click en el botón '+' de abajo a la derecha")
    })

    it('has a CardSubject when Subject is added', async () => {
        //jest.setTimeout(20000)      
        const materias = [{materiaId: '123', carrera: 'Licenciatura en Informatica', nombre: 'Tecnologia Aplicada', link: 'link'}];
        const { container, getById } = setUp()
        AuthenticationService.getSessionUserId.mockReturnValue('id')
        MateriasService.getSubjects.mockResolvedValueOnce(materias)

        await wait(() => expect(getById(container, "grid-task")).toBeInTheDocument());

        let cardSubject;
        await wait(() => {
            expect(screen.getByText(materias[0].nombre)).toBeInTheDocument()
            cardSubject = getById(container, "123")
        })
        
        expect(cardSubject).toBeInTheDocument()
      })
  })
}) 
