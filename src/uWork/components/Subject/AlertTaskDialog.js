import React, { useState } from 'react'
import { Button, Dialog, makeStyles, DialogActions,
  DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AdornedButton from '../AdornedButton/AdornedButton'
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import * as TaskService from '../../services/TaskService'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    background: '#ab003c',
    color: 'white'
  },
}));

export default function AlertTaskDialog(props) {
  const {open, setOpen, taskId, subjectId, cantColaboradores, acceptHandler} = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false)
  const [openErrorSnack, setOpenErrorSnack] = useState(false)

  const handleCloseSnackError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnack(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTask = () => {
    setLoading(true)
    TaskService.deleteTask(taskId, subjectId)
      .then(() => {
        setLoading(false)
        acceptHandler(taskId)
        setOpen(false)
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
        setOpenErrorSnack(true)
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
              En esta tarea hay <strong>{`${cantColaboradores}`}</strong> {`${(cantColaboradores > 1 || cantColaboradores === 0) ? 'colaboradores' : 'colaborador/a'} a cargo,`} <strong>¿Estás seguro que querés eliminarla?</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <AdornedButton
            variant="contained"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={deleteTask}
            autoFocus
            loading={loading}
            disabled={loading}>
            Eliminar
          </AdornedButton>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <CustomizedSnackbars open={openErrorSnack} handleClose={handleCloseSnackError} severity="error">
        Error al eliminar la tarea. Intentá de nuevo más tarde.
      </CustomizedSnackbars>
    </div>
  );
}