import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

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

  const handleClose = () => {
        setOpen(false);
  };

  const onAccept = () => {
    console.log("Tarea agregada")
    setOpen(false)
  }


  return (
    <React.Fragment>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">Nueva Tarea</DialogTitle>
        <DialogContent>
          
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <label> 
                  Nombre: 
                  <input type="text"/>
              </label>
              <label> 
                  Descripcion: 
                  <input type="text"/>
              </label>
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