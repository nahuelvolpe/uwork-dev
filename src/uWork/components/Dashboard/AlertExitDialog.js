import React, { useState } from 'react'
import { makeStyles, Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AdornedButton from '../AdornedButton/AdornedButton'

import AuthenticationService from '../../services/AuthenticationService'
import * as MateriasService from '../../services/MateriasService'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    background: '#ab003c',
    color: 'white'
  },
}));

export default function AlertExitDialog(props) {
  const { open, setOpen, subjectId, acceptHandler, errorHandler } = props;
  const classes = useStyles();
  const userId = AuthenticationService.getSessionUserId()
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = () => {
    setLoading(true)
    MateriasService.exitMateria(subjectId, userId)
        .then(() => {
            setLoading(false)
            acceptHandler(subjectId)
            setOpen(false)
        })
        .catch((e) => {
            console.log(e) 
            setLoading(false)
            errorHandler()
        })
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Advertencia</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              <strong>¿Está seguro que desea salir de esta materia?</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <AdornedButton
            variant="contained"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={handleAccept}
            loading={loading}
            disabled={loading}
          > 
            Salir
          </AdornedButton>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}