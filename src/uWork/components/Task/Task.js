import 'date-fns';
import React, { useState, useEffect, useContext, Fragment } from 'react';
import moment from 'moment'
import MomentUtils from "@date-io/moment"
import { Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction,
  Checkbox, Dialog, DialogActions, DialogContent, Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid, IconButton, makeStyles } from '@material-ui/core'
import { ExpandMore, Create, Close } from '@material-ui/icons'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { Formik, Form, Field, FieldArray } from 'formik'
import FormikField from '../FormikField/FormikField'
import { SubjectContext } from '../../context/subject'
import AdornedButton from '../AdornedButton/AdornedButton'
import LinealLoading from '../LoadingPage/LinealLoading'
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import * as MateriasService from '../../services/MateriasService'
import * as TaskService from '../../services/TaskService'
import * as Yup from 'yup'
import 'moment/locale/es-mx'
moment.locale('es-mx')

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto'
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
  },
  botonAccept: {
    color: 'white'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
      disableToolbar
      variant="dialog"
      id="date-picker-dialog"
      format="DD/MM/yyyy"
      label="Fecha de Vencimiento"
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
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [openErrorSnack, setOpenErrorSnack] = useState(false)
  const [message, setMessage] = useState('Error al crear la tarea.')
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    aCargo: [],
    fechaLimite: moment()
  })
  
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)
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
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  const getColaboradores = (colabsFromData) => {
    return Object.keys(colabsFromData)
  }

  const handleCloseSnackError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnack(false);
  }

  const handleClose = () => {
    setOpen(false)
    setOwnOpen(false)
  };

  const changeEdition = () => {
    setIsViewMode(!isViewMode)
    setIsEditMode(!isEditMode)
  }

  const onSubmit = (values) => {
    setCreating(true)
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
      fechaLimite: moment(values.fechaLimite).toDate(),
      estado: 'pendiente'
    }
    createTask(task, index)
  }

  const createTask = (task, index) => {
    if (!isEditMode) {
      TaskService.createTask(task, subjectId)
        .then(async (doc) => {
            let task = await doc.get()
            task = task.data()
            setCreating(false)
            acceptHandler(doc.id, task)
            setOwnOpen(false)
            setOpen(false)
        }).catch(e => {
          console.log(e)
          setCreating(false)
          setMessage('Error al crear la tarea.')
          setOpenErrorSnack(true)
        })
    } else {
      TaskService.updateTask(task.tareaId, task)
        .then(() => {
          setCreating(false)
          acceptHandler(task.tareaId, task, index)
          setOwnOpen(false)
          setOpen(false)
        })
        .catch(e => {
          console.log(e)
          setCreating(false)
          setMessage('Error al editar la tarea.')
          setOpenErrorSnack(true)
        })
    }
  }

  return (
    <Fragment>
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
            <Form className={classes.form} style={{width: loading ? '250px' : 'fit-content'}} noValidate>
              <h2 className={classes.dialogTitle}>{isViewMode ? "Ver Tarea" : (isEditMode ? "Editar Tarea" : "Nueva Tarea")}</h2>
              {
                loading ? <LinealLoading height="30vh" width="50%">Cargando tarea...</LinealLoading>
              : <><DialogContent>
                <FormikField className={classes.titulo} required label="Titulo" id="title" name="titulo"
                type="text" variant="outlined" error={errors.titulo && touched.titulo} disabled={isViewMode} fullWidth />
                <FormikField label="Descripción" id="description" name="descripcion"
                type="text" variant="outlined" multiline rows={4} error={errors.descripcion && touched.descripcion} disabled={isViewMode} fullWidth />
                <Accordion className={classes.collabAccordion}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography className={classes.heading}>Seleccionar colaboradores</Typography>
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
                    <AdornedButton
                      className={classes.botonAccept}
                      type="submit"
                      variant="contained"
                      color="secondary"
                      loading={creating}
                      disabled={creating}
                      >
                      Aceptar
                    </AdornedButton>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                      <Close />
                    </IconButton>
                </>
                : <>
                  <Button type="submit" color="primary" style={{display: 'none'}}>
                  </Button>
                  {data.estado === 'pendiente' ? 
                  <Button onClick={changeEdition} variant="outlined" color="primary">
                    <Create fontSize="small"/> Editar
                  </Button>:
                  null
                  }
                  <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                    <Close />
                  </IconButton>
                </>
              }
              </DialogActions></>
              }
            </Form>
          </Dialog>
        )}}
      </Formik>
      <CustomizedSnackbars open={openErrorSnack} handleClose={handleCloseSnackError} severity="error">
        {message}
      </CustomizedSnackbars>
    </Fragment>
  );
}