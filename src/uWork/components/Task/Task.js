import 'date-fns';
import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction,
  Checkbox, Dialog, DialogActions, DialogContent, Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MomentUtils from "@date-io/moment"
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import * as MateriasService from '../../services/MateriasService';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup'
import FormikField from '../FormikField/FormikField'
import { SubjectContext } from '../../context/subject'
import 'moment/locale/es-mx'
moment.locale('es-mx')

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  keyboardDate: {
    marginTop: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  titulo: {
    marginBottom: theme.spacing(3)
  },
  descripcion: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  colaboradores: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  fechaLimite: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  collabAccordion : {
    marginTop: theme.spacing(2),
    border: '1px solid #c4c4c4',
    boxShadow: '0 0 black',
    position: 'initial',
    borderRadius: '4px'
  },
  dialogTitle: {
    marginBottom: theme.spacing(1),
    alignContent: 'center',
    textAlign: 'center'
  }
}));

const TaskSchema = Yup.object().shape({
  titulo: Yup.string()
    .required("Titulo requerido")
})

const DatePickerField = ({ field, form, ...other }) => {
  const currentError = form.errors[field.name];
  return (
    <KeyboardDatePicker
      clearable
      disablePast
      disabled={other.disabled}
      name={field.name}
      value={field.value}
      format="MM/DD/yyyy"
      helperText={currentError}
      error={Boolean(currentError)}
      onError={error => {
        if (error !== currentError) {
          form.setFieldError(field.name, error);
        }
      }}
      onChange={date => form.setFieldValue(field.name, date, false)}
      {...other}
    />
  );
};

export default function Task(props) {

  const { open, setOpen, acceptHandler, index } = props
  const { subjectId } = useContext(SubjectContext)
  let { data } = props
  if (!data) data = {}
  const classes = useStyles();

  const [ownOpen, setOwnOpen] = useState(Boolean(open))
  const [colaboradores, setColaborares] = useState([]);
  const [isViewMode, setIsViewMode] = useState(Boolean(data.tareaId))
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    aCargo: [],
    fechaLimite: moment()
  })
  
  useEffect(() => {
    const cargarDatos = async () => {
        if(subjectId) {
            const collabs = await MateriasService.getCollabsFromSubject(subjectId)
            setColaborares(collabs)
            if (isViewMode) {
              setFormData({
                titulo: data.titulo,
                descripcion: data.descripcion,
                aCargo: getColaboradores(data.colaboradores),
                fechaLimite: moment(data.fechaLimite, 'DD-MM-YYYY')
              })
            }
        }
    }
    cargarDatos()
  }, [])

  const getColaboradores = (colabsFromData) => {
    return Object.keys(colabsFromData)
  }

  const handleClose = () => {
    setOwnOpen(false);
    setOpen(false)
  };

  const changeEdition = () => {
    setIsViewMode(!isViewMode)
    setIsEditMode(!isEditMode)
  }

  const onSubmit = (values) => {
    let collabs = {};
    values.aCargo.forEach(selectedColab => {
      let colaborador = {};
      colaboradores.forEach(colab => {
        if(colab.uid === selectedColab) {
          colaborador = { [selectedColab]: { photoURL: colab.photoURL, name: `${colab.firstName} ${colab.lastName}` } }
        }
      })
      collabs = {...collabs, ...colaborador}
    })
    const task = {
      tareaId: isEditMode ? data.tareaId : '',
      titulo: values.titulo,
      descripcion: values.descripcion,
      aCargo: collabs,
      fechaLimite: moment(values.fechaLimite).toDate()
    }
    acceptHandler(task, isEditMode, index)
    setOwnOpen(false)
  }

  return (
      <Formik
        enableReinitialize
        initialValues={formData}
        validationSchema={TaskSchema}
        validateOnChange={false}
        onSubmit={onSubmit}>
        {({ values, errors, touched }) => {
          return (
          <Dialog
            open={ownOpen}
            onClose={handleClose}
            aria-labelledby="dialog-title">
            <Form className={classes.form} noValidate>
              <h2 className={classes.dialogTitle}>{isViewMode ? "Ver Tarea" : (isEditMode ? "Editar Tarea" : "Nueva Tarea")}</h2>
              <DialogContent>
                <FormikField className={classes.titulo} required label="Titulo" id="title" name="titulo"
                type="text" variant="outlined" error={errors.titulo && touched.titulo} disabled={isViewMode} fullWidth />
                <FormikField label="Descripción" id="description" name="descripcion"
                type="text" variant="outlined" multiline rows={4} error={errors.descripcion && touched.descripcion} disabled={isViewMode} fullWidth />
                <Accordion className={classes.collabAccordion}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography className={classes.heading}>Seleccionar colabodores</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FieldArray name="aCargo"
                      render={arrayHelpers => (
                        <List dense>
                          {colaboradores.map((option) => {
                            return (
                              <ListItem key={option.uid} button>
                                <ListItemAvatar>
                                  <Avatar
                                    alt={option.firstName}
                                    src={option.photoURL}
                                  />
                                </ListItemAvatar>
                                <ListItemText id={option.uid} primary={`${option.firstName} ${option.lastName}`} />
                                <ListItemSecondaryAction>
                                  <Checkbox
                                    edge="end"
                                    disabled={isViewMode}
                                    onChange={() => {
                                      const currentIndex = values.aCargo.indexOf(option.uid)
                                      if(currentIndex !== -1) { arrayHelpers.remove(currentIndex) }
                                      else { arrayHelpers.push(option.uid) }
                                    }}
                                    checked={values.aCargo.some((id) => id === option.uid)}
                                    inputProps={{ 'aria-labelledby': option.uid }}
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                        </List>
                      )}/>
                  </AccordionDetails>
                </Accordion>
                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="es">
                  <Grid container className={classes.keyboardDate} justify="space-around">
                    <Field name="fechaLimite" component={DatePickerField} disabled={isViewMode} />
                  </Grid>
                </MuiPickersUtilsProvider>
              </DialogContent>
              <DialogActions>
              {
                !isViewMode ? <>
                    <Button type="submit" color="primary">
                      Aceptar
                    </Button>
                    <Button onClick={handleClose} color="primary">
                      Cerrar
                    </Button>
                </>
                : <>
                  <Button type="submit" color="primary" style={{display: 'none'}}>
                  </Button>
                  <Button onClick={changeEdition} color="primary">
                    Editar
                  </Button>
                </>
              }
              </DialogActions>
            </Form>
          </Dialog>
        )}}
      </Formik>
  );
}