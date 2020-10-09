import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import careers from '../../services/subjects/careers.json'
import subjects from '../../services/subjects/subjects.json'

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
}));

export default function AddSubject(props) {
  const { open, setOpen, acceptHandler } = props
  const classes = useStyles();

  const [subject, setSubject] = useState({})
  const [career, setCareer] = useState({})
  const [subjectOptions, setOptions] = useState([])

  const handleClose = () => {
      MateriasService.addMateria()
        .then( () => {
            setOpen(false);
        })
  };

  const handleCarrera = (e) => {
    setCareer(e.target.value)
    let filteredOptions = subjects.filter(s => s.career === e.target.value.id)
    setOptions(filteredOptions)
  }
  const handleSubject = (e) => {
    setSubject(e.target.value)
  }

  const onAccept = () => {
    acceptHandler({ career: career.description, subject: subject.description })
    setOpen(false)
  }


  return (
    <React.Fragment>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">Agregar una materia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Primero elija la carrera y luego la materia
          </DialogContentText>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="carrera">Carrera</InputLabel>
              <Select
                autoFocus
                value={career}
                onChange={handleCarrera}
              >
                {
                  careers.map(
                    (career) => <MenuItem key={career.id} value={career}>{career.description}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="subject">Materia</InputLabel>
              <Select
                autoFocus
                value={subject}
                onChange={handleSubject}
              >
                {
                  subjectOptions.map(
                    subject => <MenuItem key={subject.id} value={subject}>{subject.description}</MenuItem>
                  )
                }
                {/* <MenuItem value="algoritmos">Algoritmos y Estructuras de Datos</MenuItem>
                <MenuItem value="poo">Programacion con Objetos</MenuItem>
                <MenuItem value="base-datos">Base de datos</MenuItem>
                <MenuItem value="tecnologia-aplicada">Tecnología Aplicada</MenuItem> */}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onAccept} color="primary">
            Aceptar
          </Button>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}