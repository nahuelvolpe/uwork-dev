import 'date-fns';
import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction,
  Checkbox, Dialog, DialogActions, DialogContent, Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import * as MateriasService from '../../services/MateriasService';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup'
import FormikField from '../FormikField/FormikField'
import { SubjectContext } from '../../context/subject'

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
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  titulo: {
    marginBottom: theme.spacing(2)
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
      format="dd/MM/yyyy"
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

  const { open, setOpen, acceptHandler, isView } = props
  const { subjectId } = useContext(SubjectContext)
  let { data } = props
  if (!data) data = {}
  const classes = useStyles();
  const [colaboradores, setColaborares] = useState([]);
  const [aCargo, setACargo] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [titulo, setTitulo] = useState('')
  const [fechaLimite, setFechaLimite] = useState(new Date())
  const [isViewState, setIsView] = useState(false)
  
  useEffect(() => {
      const cargarDatos = async () => {
          if(subjectId) {
              const collabs = await MateriasService.getCollabsFromSubject(subjectId)
              setColaborares(collabs)
              if (data) {
                setACargo(prev => data.colaboradores ? getColaboradores(data.colaboradores) : prev)
                setTitulo(prev => data.titulo ? data.titulo : prev)
                setDescripcion(prev => data.descripcion ? data.descripcion : prev)
                setFechaLimite(prev => data.fechaLimite ? data.fechaLimite : prev)
                setIsView(prev => isView ? isView : prev)
              }
          }
      }
      cargarDatos()
  })

  const getColaboradores = (colabsFromData) => {
    return Object.keys(colabsFromData)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values) => {
    let collabs = {};
    let colaborador = {};
    values.aCargo.forEach((colab)=>{
      colaborador = {[colab]: new Date()}
      collabs = {...collabs, ...colaborador}
    })
    acceptHandler({titulo: values.titulo, descripcion: values.descripcion, aCargo: collabs, fechaLimite: values.fechaLimite})
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Formik
        enableReinitialize
        initialValues={{ titulo, descripcion, aCargo, fechaLimite }}
        validationSchema={TaskSchema}
        onSubmit={onSubmit}>
        {({ values, errors, touched }) => (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="dialog-title">
            <Form className={classes.form} noValidate>
              <h2 className={classes.dialogTitle}>{!isViewState ? "Nueva Tarea" : "Ver Tarea"}</h2>
              <DialogContent>
                <FormikField className={classes.titulo} required label="Titulo" id="title" name="titulo"
                type="text" variant="outlined" error={errors.titulo && touched.titulo} disabled={isViewState} fullWidth />
                <FormikField label="Descripción" id="description" name="descripcion"
                type="text" variant="outlined" multiline rows={4} error={errors.descripcion && touched.descripcion} disabled={isViewState} fullWidth />
                <Accordion>
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
                                    disabled={isViewState}
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
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <Field name="fechaLimite" component={DatePickerField} disabled={isViewState} />
                  </Grid>
                </MuiPickersUtilsProvider>
        </DialogContent>
        {
          !isViewState && <DialogActions>
            <Button type="submit" color="primary">
              Aceptar
            </Button>
            <Button onClick={handleClose} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        }
        </Form>
      </Dialog>
      )}
      </Formik>
    </React.Fragment>
  );
}