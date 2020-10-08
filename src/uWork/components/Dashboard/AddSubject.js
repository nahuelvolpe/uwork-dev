import React from 'react';
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

export default function AddSubject({carrera, subject, open, setOpen, setCarrera, setSubject}) {
  const classes = useStyles();
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCarrera = (e) => {
    setCarrera(e.target.value)
  }
  const handleSubject = (e) => {
    setSubject(e.target.value)
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
                value={carrera}
                onChange={handleCarrera}
                inputProps={{
                  name: 'carrera',
                  id: 'carrera',
                }}
              >
                <MenuItem value="informatica">Licenciatura en Informática</MenuItem>
              </Select>
            </FormControl>   
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="subject">Materia</InputLabel>
              <Select
                autoFocus
                value={subject}
                onChange={handleSubject}
                inputProps={{
                  name: 'subject',
                  id: 'subject',
                }}
              >
                <MenuItem value="algoritmos">Algoritmos y Estructuras de Datos</MenuItem>
                <MenuItem value="poo">Programacion con Objetos</MenuItem>
                <MenuItem value="base-datos">Base de datos</MenuItem>
                <MenuItem value="tecnologia-aplicada">Tecnología Aplicada</MenuItem>
              </Select>
            </FormControl>         
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}